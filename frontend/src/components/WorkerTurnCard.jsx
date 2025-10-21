import React, { useEffect, useState } from "react";
import { pasarTurno } from "../api/turnosApi";
import { useNavigate } from "react-router-dom";
import "./WorkerTurnCard.css";
import "./DiagnosticoModal.css";
import ModalAlert from "../components/ModalAlert"; 

const DiagnosticoModal = ({ show, onClose, onSubmit, trabajadorNombre }) => {
  const [descripcion, setDescripcion] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [tipoServicio, setTipoServicio] = useState("");

  const handleSubmit = () => {
    if (!descripcion || !fechaEntrega || !tipoServicio) {
      showModal("Error", "Por favor, completa todos los campos.", "error");
      return;
    }
    onSubmit({ descripcion, fechaEntrega, tipoServicio });
    setDescripcion("");
    setFechaEntrega("");
    setTipoServicio("");
  };

  if (!show) return null;

  const hoy = new Date().toISOString().split("T")[0];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h5>Diagnóstico de {trabajadorNombre}</h5>

        <div className="modal-field">
          <label>Descripción del problema</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Describe el problema..."
          />
        </div>

        <div className="modal-field">
          <label>Tiempo estimado de entrega</label>
          <input
            type="date"
            value={fechaEntrega}
            onChange={(e) => setFechaEntrega(e.target.value)}
            min={hoy}
          />
        </div>

        <div className="modal-field">
          <label>Tipo de servicio</label>
          <input
            type="text"
            value={tipoServicio}
            onChange={(e) => setTipoServicio(e.target.value)}
            placeholder="Escribe el tipo de servicio..."
          />
        </div>

        <div className="modal-buttons">
          <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Guardar</button>
        </div>
      </div>
    </div>
  );
};

const WorkerTurnCard = ({ trabajadores = [], filtroBusqueda = "", mostrarCargo = false, modoMosaico = false, onRefresh, onDiagnostico }) => {
  const [turnoEnProceso, setTurnoEnProceso] = useState(null);
  const [trabajadoresLocal, setTrabajadoresLocal] = useState(trabajadores);
  const [now, setNow] = useState(new Date());
  const [modalData, setModalData] = useState({ show: false, trabajador: null });
  const navigate = useNavigate();

  const [modal, setModal] = useState({
  show: false,
  title: "",
  message: "",
  type: "info",
});

const showModal = (title, message, type = "info") => {
  setModal({ show: true, title, message, type });
};

const closeModal = () => setModal({ ...modal, show: false });


  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setTrabajadoresLocal(trabajadores);
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

  const trabajadoresFiltrados = trabajadores.filter(
    t =>
      t.NOMBRE.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
      (t.CARGO && t.CARGO.toLowerCase().includes(filtroBusqueda.toLowerCase()))
  );

  if (!trabajadoresFiltrados.length) return <p>No hay trabajadores que coincidan.</p>;

  const handlePasarTurno = async (idEmpleado, cargo) => {
    setTurnoEnProceso(idEmpleado);
    try {
      await pasarTurno(idEmpleado, cargo);
      setTimeout(() => onRefresh && onRefresh(), 300);
    } catch (err) {
      console.error("Error al pasar turno:", err);
      setTurnoEnProceso(null);
    }
  };

  const handleAbrirDiagnostico = (trabajador) => {
    const turnoId = trabajador.turnos?.[0]?.ID_TURNO;
    if (!turnoId) return showModal("Error", "Este trabajador no tiene un turno asignado", "error");
    setModalData({ show: true, trabajador, turnoId });
  };


  const handleGuardarDiagnostico = async (data) => {
      const turnoId = modalData.trabajador.turnos?.[0]?.ID_TURNO;
      console.log("Turno a diagnosticar:", turnoId);

      if (!turnoId) return showModal("Error", "No hay turno seleccionado.", "error");

      try {
          const response = await fetch(`http://127.0.0.1:8000/api/turnos/${turnoId}/diagnostico`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
          });

          // Log completo para depuración
          console.log("HTTP Status:", response.status, response.statusText);
          const text = await response.text(); // primero obtenemos texto crudo
          console.log("Cuerpo de la respuesta:", text);

          // Intentamos parsear JSON solo si hay algo
          let result = null;
          try {
              result = text ? JSON.parse(text) : null;
          } catch (err) {
              console.error("Error al parsear JSON:", err);
          }

          if (!response.ok) {
              showModal("Error", `Error al guardar diagnóstico: ${response.status} ${response.statusText}`, "error");
              return;
          }

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

      setModalData({ show: false, trabajador: null });
  };



  const formatHora = (hora) => {
    if (!hora) return "—";
    const date = new Date(hora);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

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
              <div className="text-center">
                <div className="fw-bold fs-4">{t.NOMBRE} {t.APELLIDOS} {estaAusente && <span className="badge bg-secondary ms-2">Ausente</span>}</div>
                {mostrarCargo && <div className="text-muted mb-1">{t.CARGO}</div>}
                {turno ? (
                  <>
                    <div>Atendiendo turno: #{turno.ID_TURNO}</div>
                    <div className="mt-1">{turno ? formatHora(turno.ATENCION_EN) : "—"} <i className="bi bi-hourglass-split spin ms-1"></i> {getTiempoTranscurrido(turno.ATENCION_EN)}</div>
                  </>
                ) : <div className="turno-sin">Sin turno asignado</div>}
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
