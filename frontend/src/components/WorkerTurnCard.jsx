import React, { useEffect, useState } from "react";
import { pasarTurno } from "../api/turnosApi";
import { useNavigate } from "react-router-dom";
import API_URL from "../api/config";
import "./WorkerTurnCard.css";
import "./DiagnosticoModal.css";
import ModalAlert from "../components/ModalAlert"; 
import DiagnosticoModal from "../components/DiagnosticoModal";

/* 
--------------------------------------------------
 COMPONENTE PRINCIPAL: WorkerTurnCard
Muestra las tarjetas con la información de los trabajadores,
sus turnos actuales y permite pasar turno o registrar diagnóstico.
--------------------------------------------------
*/
const WorkerTurnCard = ({ trabajadores = [], filtroBusqueda = "", mostrarCargo = false, modoMosaico = false, onRefresh, onDiagnostico }) => {
  // Estados principales
  const [turnoEnProceso, setTurnoEnProceso] = useState(null);
  const [trabajadoresLocal, setTrabajadoresLocal] = useState(trabajadores);
  const [now, setNow] = useState(new Date()); // ⏰ Control de tiempo transcurrido
  const [modalData, setModalData] = useState({ show: false, trabajador: null }); // Modal diagnóstico

  const navigate = useNavigate();

  //  Modal genérico de alertas
  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
    type: "info",
  });

  const showModal = (title, message, type = "info") => setModal({ show: true, title, message, type });
  const closeModal = () => setModal({ ...modal, show: false });

  /* 
  --------------------------------------------------
   Actualiza el reloj cada segundo
  --------------------------------------------------
  */
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  /* 
  --------------------------------------------------
   Actualiza el estado local si cambian los trabajadores
  --------------------------------------------------
  */
  useEffect(() => {
    setTrabajadoresLocal(trabajadores);

    // Si el turno cambia o termina, limpia el estado
    if (turnoEnProceso && trabajadores.length > 0) {
      const trabajadorActualizado = trabajadores.find(t => t.ID_EMPLEADO === turnoEnProceso);
      if (trabajadorActualizado) {
        const turnoAnterior = trabajadoresLocal.find(t => t.ID_EMPLEADO === turnoEnProceso)?.turnos?.[0];
        const turnoNuevo = trabajadorActualizado.turnos?.[0];
        if ((turnoAnterior?.ID_TURNO !== turnoNuevo?.ID_TURNO) || (!turnoAnterior && turnoNuevo) || (turnoAnterior && !turnoNuevo)) {
          setTurnoEnProceso(null);
        }
      }
    }
  }, [trabajadores]);

  /* 
  --------------------------------------------------
   Filtrado de trabajadores por nombre o cargo
  --------------------------------------------------
  */
  const trabajadoresFiltrados = trabajadores.filter(
    t =>
      t.NOMBRE.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
      (t.CARGO && t.CARGO.toLowerCase().includes(filtroBusqueda.toLowerCase()))
  );

  if (!trabajadoresFiltrados.length) return <p>No hay trabajadores que coincidan.</p>;

  /* 
  --------------------------------------------------
   Pasa al siguiente turno de un empleado
  --------------------------------------------------
  */
  const handlePasarTurno = async (idEmpleado, cargo) => {
  setTurnoEnProceso(idEmpleado);
  
  try {
    console.log("🟢 handlePasarTurno - Iniciando para:", idEmpleado, cargo);
    
    const resultado = await pasarTurno(idEmpleado, cargo);
    
    console.log("🟢 handlePasarTurno - Resultado recibido:", resultado);
    
    // ✨ NUEVO: Verificar si success es true pero no hay turnos (null)
    if (resultado && resultado.success === true) {
      if (resultado.nuevo_turno === null && resultado.turno_atendido === null) {
        console.log("🟡 handlePasarTurno - Mostrando modal: Sin turnos (turnos null)");
        showModal("Sin turnos pendientes", "No hay más turnos en la fila de espera.", "info");
        setTurnoEnProceso(null);
        setTimeout(() => onRefresh && onRefresh(), 300);
        return;
      }
    }
    
    // Verificar si tiene el flag noTurnos
    if (resultado && resultado.noTurnos === true) {
      console.log("🟡 handlePasarTurno - Mostrando modal: Sin turnos");
      showModal("Sin turnos pendientes", "No hay más turnos en la fila de espera.", "info");
      setTurnoEnProceso(null);
      setTimeout(() => onRefresh && onRefresh(), 300);
      return;
    }
    
    // Verificar diferentes formatos de respuesta cuando no hay turnos
    if (resultado) {
      // Si hay un mensaje específico
      if (resultado.message) {
        const mensaje = resultado.message.toLowerCase();
        console.log("🟢 handlePasarTurno - Mensaje en resultado:", mensaje);
        
        if (mensaje.includes("no hay turnos") || 
            mensaje.includes("sin turnos") || 
            mensaje.includes("pendientes") ||
            mensaje.includes("no hay más turnos")) {
          console.log("🟡 handlePasarTurno - Mostrando modal: Sin turnos (por mensaje)");
          showModal("Sin turnos pendientes", "No hay más turnos en la fila de espera.", "info");
          setTurnoEnProceso(null);
          setTimeout(() => onRefresh && onRefresh(), 300);
          return;
        }
      }
      
      // Si la respuesta indica éxito explícito = false
      if (resultado.success === false) {
        console.log("🟡 handlePasarTurno - Mostrando modal: Sin turnos (success false)");
        showModal("Sin turnos pendientes", "No hay más turnos en la fila de espera.", "info");
        setTurnoEnProceso(null);
        setTimeout(() => onRefresh && onRefresh(), 300);
        return;
      }
    }
    
    // Si llegamos aquí, el turno se pasó exitosamente
    console.log("✅ handlePasarTurno - Turno pasado exitosamente");
    setTimeout(() => {
      onRefresh && onRefresh();
      setTurnoEnProceso(null);
    }, 300);
    
  } catch (err) {
    console.error("🔴 handlePasarTurno - Error capturado:", err);
    
    // Verificar el mensaje de error
    const errorMsg = err.message ? err.message.toLowerCase() : "";
    console.log("🔴 handlePasarTurno - Mensaje de error:", errorMsg);
    
    if (errorMsg.includes("no hay turnos") || 
        errorMsg.includes("sin turnos") || 
        errorMsg.includes("pendientes") ||
        errorMsg.includes("no hay más turnos") ||
        errorMsg.includes("404")) {
      console.log("🟡 handlePasarTurno - Mostrando modal: Sin turnos (por error)");
      showModal("Sin turnos pendientes", "No hay más turnos en la fila de espera.", "info");
    } else {
      console.log("🔴 handlePasarTurno - Mostrando modal: Error real");
      showModal("Error", "Ocurrió un error al pasar el turno: " + err.message, "error");
    }
    
    setTurnoEnProceso(null);
    setTimeout(() => onRefresh && onRefresh(), 300);
  }
};

  /* 
  --------------------------------------------------
   Abre el modal de diagnóstico
  --------------------------------------------------
  */
  const handleAbrirDiagnostico = (trabajador) => {
    const turnoId = trabajador.turnos?.[0]?.ID_TURNO;
    if (!turnoId) return showModal("Error", "Este trabajador no tiene un turno asignado", "error");
    setModalData({ show: true, trabajador, turnoId });
  };

  /* 
  --------------------------------------------------
   Guarda el diagnóstico en el backend
  --------------------------------------------------
  */
  const handleGuardarDiagnostico = async (data) => {
    const turnoId = modalData.trabajador.turnos?.[0]?.ID_TURNO;
    if (!turnoId) return showModal("Error", "No hay turno seleccionado.", "error");

    try {
      const response = await fetch(`${API_URL}/turnos/${turnoId}/diagnostico`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // Logs para depuración
      console.log("HTTP Status:", response.status, response.statusText);
      const text = await response.text();
      console.log("Cuerpo de la respuesta:", text);

      // Intenta parsear JSON si existe
      let result = null;
      try {
        result = text ? JSON.parse(text) : null;
      } catch (err) {
        console.error("Error al parsear JSON:", err);
      }

      // Verifica el estado HTTP
      if (!response.ok) {
        showModal("Error", `Error al guardar diagnóstico: ${response.status} ${response.statusText}`, "error");
        return;
      }

      // Muestra feedback según resultado
      if (result && result.success) {
        showModal("Éxito", "Diagnóstico guardado correctamente", "success");
        onRefresh && onRefresh();
      } else {
        showModal("Error", "Error al guardar diagnóstico: " + (result?.error || "Respuesta inesperada"), "error");
      }
    } catch (err) {
      console.error("Error al guardar diagnóstico:", err);
      showModal("Error", "Error al guardar diagnóstico: " + err.message, "error");
    }

    // Cierra el modal al terminar
    setModalData({ show: false, trabajador: null });
  };

  /* 
  --------------------------------------------------
   Formatea una hora en formato hh:mm
  --------------------------------------------------
  */
  const formatHora = (hora) => {
    if (!hora) return "—";
    const date = new Date(hora);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  /* 
  --------------------------------------------------
   Calcula el tiempo transcurrido desde una hora dada
  --------------------------------------------------
  */
  const getTiempoTranscurrido = (horaInicio) => {
    if (!horaInicio) return "—";
    const inicio = new Date(horaInicio);
    const diffMs = now - inicio;
    if (diffMs < 0) return "—";
    const horas = Math.floor(diffMs / (1000 * 60 * 60));
    const minutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diffMs % (1000 * 60)) / 1000);
    const formato = (n) => String(n).padStart(2, "0");
    return `${formato(horas)}:${formato(minutos)}:${formato(segundos)}`;
  };

  /* 
  --------------------------------------------------
   Renderizado de las tarjetas de trabajadores
  --------------------------------------------------
  */
  return (
    <>
      {trabajadoresFiltrados.map((t) => {
        const turno = t.turnos?.[0] || null;
        const estaAusente = t.ESTADO === 0;
        const estaProcesando = turnoEnProceso === t.ID_EMPLEADO;
        const esReparacion = !!(t.CARGO && t.CARGO.toLowerCase().includes("reparacion"));

        return (
          <div
            key={t.ID_EMPLEADO}
            className={`current-turn-card mb-2 p-3 shadow-sm rounded ${estaProcesando ? "turno-procesando" : ""}`}
          >
            {modoMosaico ? (
              /* Vista tipo mosaico (horizontal) */
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-bold fs-5">
                    <i className="bi bi-person-circle me-1"></i>
                    {t.NOMBRE} {t.APELLIDOS}
                    {estaAusente && <span className="badge bg-secondary ms-2">Ausente</span>}
                  </div>

                  {mostrarCargo && <div className="text-muted"><i className="bi bi-briefcase me-1"></i>{t.CARGO}</div>}
                  {turno ? <div>Turno: #{turno.ID_TURNO}</div> : <div className="turno-sin">Sin turno asignado</div>}
                </div>

                <div className="text-end">
                  {/* Hora + cronómetro */}
                  <div className="d-flex align-items-center mb-1 justify-content-end">
                    <i className="bi bi-clock me-1"></i>
                    {turno?.ATENCION_EN ? (
                      <>
                        <div>{formatHora(turno.ATENCION_EN)}</div>
                        <i className="bi bi-hourglass-split spin ms-2 me-1"></i>
                        <div>{getTiempoTranscurrido(turno.ATENCION_EN)}</div>
                      </>
                    ) : <div>—</div>}
                  </div>

                  {/* Botones de acción */}
                  <div className="btn-group-turnos">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handlePasarTurno(t.ID_EMPLEADO, t.CARGO?.toLowerCase())}
                      disabled={estaProcesando || estaAusente}
                    >
                      {estaProcesando ? "Procesando..." : estaAusente ? "Ausente" : "Pasar turno"}
                    </button>

                    {esReparacion && (
                      <button
                        className="btn btn-outline-light btn-sm"
                        onClick={() => handleAbrirDiagnostico(t)}
                        disabled={estaProcesando || estaAusente}
                      >
                        Diagnóstico
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Vista tipo lista (centrada y vertical) */
              <div className="text-center">
                <div className="fw-bold fs-4">
                  {t.NOMBRE} {t.APELLIDOS}
                  {estaAusente && <span className="badge bg-secondary ms-2">Ausente</span>}
                </div>

                {mostrarCargo && <div className="text-muted mb-1">{t.CARGO}</div>}

                {turno ? (
                  <>
                    <div>Atendiendo turno: #{turno.ID_TURNO}</div>
                    <div className="mt-1">
                      <i className="bi bi-clock me-1"></i>
                      {turno ? formatHora(turno.ATENCION_EN) : "—"} 
                      <i className="bi bi-hourglass-split spin ms-1"></i> 
                      {getTiempoTranscurrido(turno.ATENCION_EN)}
                    </div>
                  </>
                ) : <div className="turno-sin">Sin turno asignado</div>}

                {/* Botones */}
                <button
                  className="btn btn-danger mt-2 bi bi-arrow-right-circle me-2"
                  onClick={() => handlePasarTurno(t.ID_EMPLEADO, t.CARGO?.toLowerCase())}
                  disabled={estaProcesando || estaAusente}
                >
                  {estaProcesando ? "Procesando..." : estaAusente ? "Ausente" : "Pasar turno"}
                </button>

                {esReparacion && (
                  <button
                    className="btn btn-outline-light mt-2 bi bi-tools me-1"
                    onClick={() => handleAbrirDiagnostico(t)}
                    disabled={estaProcesando || estaAusente}
                  >
                    Diagnóstico
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}

      <DiagnosticoModal
        show={modalData.show}
        trabajadorNombre={
          modalData.trabajador 
            ? `turno #${modalData.trabajador.turnos?.[0]?.ID_TURNO || "—"}`
            : ""
        }
        onClose={() => setModalData({ show: false, trabajador: null })}
        onSubmit={handleGuardarDiagnostico}
        showModal={showModal}
      />

      <ModalAlert
        show={modal.show}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onClose={closeModal}
      />
    </>
  );

};

export default WorkerTurnCard;