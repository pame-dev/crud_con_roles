import React, { useEffect, useState } from 'react';
import './WorkerTurnCard.css';
import { pasarTurno } from "../api/turnosApi";

const WorkerTurnCard = ({ filtroBusqueda = "", mostrarCargo = false, modoLista = false }) => {
  const [trabajadores, setTrabajadores] = useState([]);
  const [turnoEnProceso, setTurnoEnProceso] = useState(null);

  const fetchTrabajadores = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/trabajadores/con-turno');
      const data = await response.json();
      setTrabajadores(data);
    } catch (error) {
      console.error('Error al traer trabajadores:', error);
      setTrabajadores([]);
    }
  };

  useEffect(() => {
    fetchTrabajadores();
    const interval = setInterval(fetchTrabajadores, 10000);
    return () => clearInterval(interval);
  }, []);

  const trabajadoresFiltrados = trabajadores.filter(t =>
    t.NOMBRE.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
    (t.CARGO && t.CARGO.toLowerCase().includes(filtroBusqueda.toLowerCase()))
  );

  if (!trabajadoresFiltrados.length) return <p>No hay trabajadores que coincidan.</p>;

  const handlePasarTurno = async (idEmpleado, cargo) => {
    setTurnoEnProceso(idEmpleado);
    try {
      await pasarTurno(idEmpleado, cargo);
      await fetchTrabajadores();
    } catch (err) {
      console.error("Error al pasar turno:", err);
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
        const turno = t.turnos.length > 0 ? t.turnos[0] : null;

        return (
          <div key={t.ID_EMPLEADO} className="current-turn-card mb-2 p-3 shadow-sm rounded">
            {modoLista ? (
              <div className="d-flex justify-content-between align-items-center">
                {/* IZQUIERDA */}
                <div>
                  <div className="fw-bold fs-5">
                    <i className="bi bi-person-circle me-1"></i> {t.NOMBRE} {t.APELLIDOS}
                  </div>
                  {mostrarCargo && <div className="text-muted"><i className="bi bi-briefcase me-1"></i>{t.CARGO}</div>}
                  {turno ? (
                    <>
                      <div><i className="me-1"></i>Turno: #{turno.ID_TURNO}</div>
                    </>
                  ) : (
                    <div className="turno-sin"><i className="bi bi-x-circle me-1"></i>Sin turno asignado</div>
                  )}
                </div>

                {/* DERECHA */}
                <div className="text-end">
                  <div className="mb-1"><i className="bi bi-clock me-1"></i>{turno ? formatHora(turno.ATENCION_EN) : "—"}</div>
                  <button
                    className="btn btn-danger btn-sm d-flex align-items-center"
                    onClick={() => handlePasarTurno(t.ID_EMPLEADO, t.CARGO.toLowerCase())}
                    disabled={turnoEnProceso === t.ID_EMPLEADO}
                  >
                    <i className="bi bi-arrow-right-circle me-1"></i>
                    {turnoEnProceso === t.ID_EMPLEADO ? "..." : "Pasar"}
                  </button>
                </div>
              </div>
            ) : (
              // MODO MOSAICO
              <div className="text-center">
                <div className="fw-bold fs-4"><i className="bi bi-person-circle me-1"></i>{t.NOMBRE} {t.APELLIDOS}</div>
                {mostrarCargo && <div className="text-muted mb-1"><i className="bi bi-briefcase me-1"></i>{t.CARGO}</div>}
                {turno ? (
                  <>
                    <div><i className="bi bi-gear me-1"></i>{turno.ID_AREA === 1 ? 'Reparación' : 'Cotización'}</div>
                    <div><i className="me-1"></i>Atendiendo turno: #{turno.ID_TURNO}</div>
                    <div className="mt-1"><i className="bi bi-clock me-1"></i>{turno ? formatHora(turno.ATENCION_EN) : "—"}</div>
                  </>
                ) : (
                  <div className="turno-sin"><i className="bi bi-x-circle me-1"></i>Sin turno asignado</div>
                )}
                <button
                  className="btn btn-danger mt-2 d-flex align-items-center justify-content-center"
                  onClick={() => handlePasarTurno(t.ID_EMPLEADO, t.CARGO.toLowerCase())}
                >
                  <i className="bi bi-arrow-right-circle me-1"></i>
                  Pasar turno
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
