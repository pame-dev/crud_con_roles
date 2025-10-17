import React, { useEffect, useState } from "react";
import { pasarTurno } from "../api/turnosApi";
import "./WorkerTurnCard.css";

const WorkerTurnCard = ({ trabajadores = [], filtroBusqueda = "", mostrarCargo = false, modoMosaico = false, onRefresh }) => {
  const [turnoEnProceso, setTurnoEnProceso] = useState(null);
  const [trabajadoresLocal, setTrabajadoresLocal] = useState(trabajadores);
  const [turnosProcesados, setTurnosProcesados] = useState(new Set());
  const [now, setNow] = useState(new Date());

  // Actualizar el reloj cada segundo que aparece en la tarjeta
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getTiempoTranscurrido = (horaInicio) => {
    if (!horaInicio) return "—";
    const inicio = new Date(horaInicio);
    const diffMs = now - inicio;

    if (diffMs < 0) return "—"; // Por si ATENCION_EN es futuro

    const horas = Math.floor(diffMs / (1000 * 60 * 60));
    const minutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diffMs % (1000 * 60)) / 1000);

    const formato = (n) => String(n).padStart(2, "0");
    return `${formato(horas)}:${formato(minutos)}:${formato(segundos)}`;
  };
 // Fin de lo de actualizar reloj



  // Sincroniza el estado local cuando cambian los props
  useEffect(() => {
    setTrabajadoresLocal(trabajadores);

    // Cuando llegan nuevos datos, quitamos el ID de procesamiento si está presente
    if (turnoEnProceso && trabajadores.length > 0) {
      const trabajadorActualizado = trabajadores.find(t => t.ID_EMPLEADO === turnoEnProceso);
      if (trabajadorActualizado) {
        // Verificar si el turno cambió (lo que indica que la operación terminó)
        const turnoAnterior = trabajadoresLocal.find(t => t.ID_EMPLEADO === turnoEnProceso)?.turnos?.[0];
        const turnoNuevo = trabajadorActualizado.turnos?.[0];
        
        // Si el turno cambió o si no hay turno (se terminaron los turnos)
        if ((turnoAnterior?.ID_TURNO !== turnoNuevo?.ID_TURNO) || (!turnoAnterior && turnoNuevo) || (turnoAnterior && !turnoNuevo)) {
          setTurnoEnProceso(null);
        }
      }
    }
  }, [trabajadores]);

  const trabajadoresFiltrados = trabajadores.filter(
    (t) =>
      t.NOMBRE.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
      (t.CARGO && t.CARGO.toLowerCase().includes(filtroBusqueda.toLowerCase()))
  );

  if (!trabajadoresFiltrados.length) return <p>No hay trabajadores que coincidan.</p>;

  const handlePasarTurno = async (idEmpleado, cargo) => {
    setTurnoEnProceso(idEmpleado);

    try {
      await pasarTurno(idEmpleado, cargo); // Llamada al backend

      // Esperar un poco antes de refrescar para dar tiempo a la base de datos
      setTimeout(() => {
        if (onRefresh) {
          onRefresh();
        }
      }, 300);

    } catch (err) {
      console.error("Error al pasar turno:", err);
      setTurnoEnProceso(null); // Si hay error, quitar el estado de procesamiento
    } 
  };

  const formatHora = (hora) => {
    if (!hora) return "—";
    const date = new Date(hora);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };


  return (
    <>
      {trabajadoresFiltrados.map((t) => {
        const turno = t.turnos && t.turnos.length > 0 ? t.turnos[0] : null;
        const estaAusente = t.ESTADO === 0;
         const estaProcesando = turnoEnProceso === t.ID_EMPLEADO;

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
                  {turno ? <div><i className="me-1"></i>Turno: #{turno.ID_TURNO}</div> : <div className="turno-sin"><i className="bi bi-x-circle me-1"></i>Sin turno asignado</div>}
                </div>

                <div className="text-end">
                  {/* Reloj y hora en la misma línea */}
                  <div className="d-flex align-items-center mb-1 justify-content-end">
                    <i className="bi bi-clock me-1"></i>
                    {turno && turno.ATENCION_EN ? (
                      <>
                        <div>{formatHora(turno.ATENCION_EN)}</div>
                        <i className="bi bi-hourglass-split spin ms-2 me-1"></i>
                        <div>{getTiempoTranscurrido(turno.ATENCION_EN)}</div>
                      </>
                    ) : (
                      <div>—</div>
                    )}
                  </div>

                  {/* Botón debajo */}
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handlePasarTurno(t.ID_EMPLEADO, t.CARGO.toLowerCase())}
                    disabled={turnoEnProceso === t.ID_EMPLEADO || estaAusente}
                  >
                    <i className="bi bi-arrow-right-circle me-1"></i>
                    {turnoEnProceso === t.ID_EMPLEADO
                      ? "Procesando..."
                      : estaAusente
                      ? "Ausente"
                      : "Pasar turno"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="fw-bold fs-4">
                  <i className="bi bi-person-circle me-1"></i>
                  {t.NOMBRE} {t.APELLIDOS} {estaAusente && <span className="badge bg-secondary ms-2">Ausente</span>}
                </div>
                {mostrarCargo && <div className="text-muted mb-1"><i className="bi bi-briefcase me-1"></i>{t.CARGO}</div>}
                {turno ? (
                  <>
                    <div><i className="me-1"></i>Atendiendo turno: #{turno.ID_TURNO}</div>
                    <div className="mt-1">
                      <i className="bi bi-clock me-1"></i>{turno ? formatHora(turno.ATENCION_EN) : "—"}
                      <i className="bi bi-hourglass-split spin me-1 ms-3"></i> {getTiempoTranscurrido(turno.ATENCION_EN)}
                    </div>
                  </>
                ) : (
                  <div className="turno-sin">Sin turno asignado</div>
                )}
                <button
                  className="btn btn-danger mt-2"
                  onClick={() => handlePasarTurno(t.ID_EMPLEADO, t.CARGO.toLowerCase())}
                  disabled={turnoEnProceso === t.ID_EMPLEADO || estaAusente}
                >
                  <i className="bi bi-arrow-right-circle me-1"></i>
                  {turnoEnProceso === t.ID_EMPLEADO ? "Procesando..." : estaAusente ? "Ausente" : "Pasar turno"}
                  
                </button>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default WorkerTurnCard;
