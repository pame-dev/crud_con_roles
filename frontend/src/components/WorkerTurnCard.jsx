import React, { useState } from "react";
import { pasarTurno } from "../api/turnosApi";
import "./WorkerTurnCard.css";

const WorkerTurnCard = ({ trabajadores = [], filtroBusqueda = "", mostrarCargo = false, modoLista = false, onRefresh }) => {
  const [turnoEnProceso, setTurnoEnProceso] = useState(null);
  const [trabajadoresLocal, setTrabajadoresLocal] = useState(trabajadores);

  // Sincroniza el estado local cuando cambian los props
  useEffect(() => {
    setTrabajadoresLocal(trabajadores);
  }, [trabajadores]);

  const trabajadoresFiltrados = trabajadores.filter(
    (t) =>
      t.NOMBRE.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
      (t.CARGO && t.CARGO.toLowerCase().includes(filtroBusqueda.toLowerCase()))
  );

  if (!trabajadoresFiltrados.length) return <p>No hay trabajadores que coincidan.</p>;

  const handlePasarTurno = async (idEmpleado, cargo) => {
    setTurnoEnProceso(idEmpleado);

    // Guardamos estado anterior por si falla la API
    const prevTrabajadores = [...trabajadoresLocal];

    // Optimistic update: quitar el turno actual inmediatamente
    setTrabajadoresLocal(trabajadoresLocal.map(t =>
      t.ID_EMPLEADO === idEmpleado
        ? { ...t, turnos: [] } 
        : t
    ));

    try {
      await pasarTurno(idEmpleado, cargo); // Llamada al backend

    } catch (err) {
      console.error("Error al pasar turno:", err);
      setTrabajadoresLocal(prevTrabajadores); // Revertir si falla
    } finally {
      setTurnoEnProceso(null);
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

        return (
          <div
            key={t.ID_EMPLEADO}
            className={`current-turn-card mb-2 p-3 shadow-sm rounded ${turnoEnProceso === t.ID_EMPLEADO ? "turno-procesando" : ""}`}
          >
            {modoLista ? (
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-bold fs-5">
                    {t.NOMBRE} {t.APELLIDOS}
                    {estaAusente && <span className="badge bg-secondary ms-2">Ausente</span>}
                  </div>
                  {mostrarCargo && <div className="text-muted">{t.CARGO}</div>}
                  {turno ? <div>Turno: #{turno.ID_TURNO}</div> : <div className="turno-sin">Sin turno asignado</div>}
                </div>

                <div className="text-end">
                  <div className="mb-1">{turno ? formatHora(turno.ATENCION_EN) : "—"}</div>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handlePasarTurno(t.ID_EMPLEADO, t.CARGO.toLowerCase())}
                    disabled={turnoEnProceso === t.ID_EMPLEADO || estaAusente}
                  >
                    {turnoEnProceso === t.ID_EMPLEADO ? "Procesando..." : estaAusente ? "Ausente" : "Pasar turno"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="fw-bold fs-4">
                  {t.NOMBRE} {t.APELLIDOS} {estaAusente && <span className="badge bg-secondary ms-2">Ausente</span>}
                </div>
                {mostrarCargo && <div className="text-muted mb-1">{t.CARGO}</div>}
                {turno ? (
                  <>
                    <div><i className="me-1"></i>Atendiendo turno: #{turno.ID_TURNO}</div>
                    <div className="mt-1"><i className="bi bi-clock me-1"></i>{turno ? formatHora(turno.ATENCION_EN) : "—"}</div>

                  </>
                ) : (
                  <div className="turno-sin">Sin turno asignado</div>
                )}
                <button
                  className="btn btn-danger mt-2"
                  onClick={() => handlePasarTurno(t.ID_EMPLEADO, t.CARGO.toLowerCase())}
                  disabled={turnoEnProceso === t.ID_EMPLEADO || estaAusente}
                >
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
