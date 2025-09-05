  import React, { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { Wrench, Flag, Zap, Clock, ArrowLeft } from "../iconos";
  import CurrentTurnCard from '../components/CurrentTurnCard';
  import QueueItem from '../components/QueueItem';
  import StatusBadge from '../components/StatusBadge';
  import './pages-styles/admin.css';

  // Vista Administrador
  const VistaAdministrador = () => {
    const navigate = useNavigate();

    const [turnos, setTurnos] = useState([
      { turn_number: 122, name: "Juan Pérez", reason: "cotizacion", status: "waiting", priority: "alta" },
      { turn_number: 123, name: "María García", reason: "reparacion", status: "waiting", priority: "alta" },
      { turn_number: 124, name: "Carlos López", reason: "reparacion", status: "waiting", priority: "baja" },
      { turn_number: 125, name: "Ana Torres", reason: "cotizacion", status: "waiting", priority: "baja" },
      { turn_number: 126, name: "Luis Gómez", reason: "reparacion", status: "waiting",priority: "baja" },
      { turn_number: 127, name: "Sofía Ramírez", reason: "cotizacion", status: "waiting",priority: "alta" }
    ]);

    const [turnoActual, setTurnoActual] = useState({
      turn_number: 124,
      name: "Carlos López",
      reason: "reparacion",
      status: "in_progress",
      priority: "alta"
    });

    const [filtro, setFiltro] = useState("reparacion");
    const [historial, setHistorial] = useState([]);

    const siguienteTurno = () => {
    const siguiente = turnos.find(t => t.status === "waiting" && t.reason === filtro && t.priority === "alta");
    if (siguiente) {
      setTurnos(turnos.map(t =>
        t.turn_number === siguiente.turn_number ? { ...t, status: "in_progress" } : t
      ));
      if (turnoActual) {
        setHistorial([...historial, { ...turnoActual, status: "completed" }]);
      }
      setTurnoActual(siguiente);
    } else {
      alert("No hay más turnos pendientes de alta prioridad en " + filtro);
    }
  };


    const finalizarDia = () => {
      if (turnoActual) setHistorial([...historial, { ...turnoActual, status: "completed" }]);
      setTurnos([]);
      setTurnoActual(null);
      alert("Día finalizado, se limpiaron los turnos.");
    };

    const colaFiltrada = turnos.filter(t => t.reason === filtro && t.status === "waiting");

    return (
      <div className="full-width-container"> {/* Contenedor de ancho completo */}

        <div className="hero-section">  {/* Sección Encabezado, Header */}
          <div className="container text-center">
            <h2 className="display-4 fw-bold mb-1">Área de {filtro === "reparacion" ? "Reparación" : "Cotización"}</h2>
            <p className="lead opacity-75">
              Tu taller mecánico de confianza en Manzanillo. Sistema de turnos rápido y eficiente.
            </p>
          </div>
        </div>

        <div className="container" style={{ marginTop: '-3rem' }}> {/* Contenedor principal de acciones y fila */}
          <div className="row full-width-row g-4"> {/* Fila principal con espacio entre columnas */}

            <div className="col-md-8 mb-4"> {/* Columna izquierda - Turno en Atención */}
              <div className="card shadow">
                <div className="card-body">
                  <h4 className="d-flex align-items-center card-title fw-bold text-dark mb-4">
                    <Zap size={20} className="text-danger me-2" /> Turno en Atención
                  </h4>

                  {turnoActual && turnoActual.priority === "alta" ? (
                    <CurrentTurnCard turno={turnoActual} siguienteTurno={siguienteTurno} />
                  ) : (
                    <p>No hay turno en atención.</p>
                  )}
                </div>

                <div className="text-center mt-3 mb-5">
                  <button className="btn btn-dark me-2" onClick={finalizarDia}>
                    Finalizar Día
                  </button>
                  <button className="btn btn-primary" onClick={siguienteTurno}>
                    Siguiente Turno
                  </button>
                </div>
                
              </div>
            </div>

            
            <div className="col-md-4 mb-4"> {/* Columna derecha - Cola Actual */}
              <div className="card shadow">

                <div className="card-body"> {/* Contenido de la tarjeta */}
                  <h4 className="d-flex align-items-center card-title fw-bold text-dark mb-4">
                    <Flag size={20} className="text-danger me-2" /> Fila Actual ({filtro})
                  </h4>
                  {colaFiltrada.length > 0 ? (
                    <>
                      {colaFiltrada.slice(0,4).map(t => <QueueItem key={t.turn_number} turn={t} />)}
                      {colaFiltrada.length > 4 && (
                        <p className="mt-2 text-muted">...{colaFiltrada.length - 4} más</p>
                      )}
                    </>
                  ) : (
                    <p>No hay turnos en la cola.</p>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

        
      </div>
    );
  };

  // Historial
  const HistorialTurnos = () => {
    const navigate = useNavigate();
    const [historial] = useState(JSON.parse(localStorage.getItem("historial")) || []);

    return (
      <div className="container mt-4">
        <h2 className="mb-4">Historial de Turnos</h2>
        {historial.length > 0 ? (
          historial.map(t => (
            <div key={t.turn_number} className="card mb-2 p-2">
              #{t.turn_number} - {t.name} ({t.reason}) - <StatusBadge status={t.status} />
            </div>
          ))
        ) : (
          <p>No hay historial.</p>
        )}
        <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} className="me-1" /> Regresar
        </button>
      </div>
    );
  };

  export default VistaAdministrador;
