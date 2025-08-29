import React, { useState } from "react";
import { Wrench, Flag, Zap, Clock, ArrowLeft } from "lucide-react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

// Vista Administrador
const VistaAdministrador = () => {
  const navigate = useNavigate();

  const [turnos, setTurnos] = useState([
    { turn_number: 122, name: "Juan Pérez", reason: "cotizacion", status: "waiting" },
    { turn_number: 123, name: "María García", reason: "reparacion", status: "waiting" },
    { turn_number: 124, name: "Carlos López", reason: "reparacion", status: "waiting" },
    { turn_number: 125, name: "Ana Torres", reason: "cotizacion", status: "waiting" },
    { turn_number: 126, name: "Luis Gómez", reason: "reparacion", status: "waiting" },
    { turn_number: 127, name: "Sofía Ramírez", reason: "cotizacion", status: "waiting" }
  ]);

  const [turnoActual, setTurnoActual] = useState({
    turn_number: 124,
    name: "Carlos López",
    reason: "reparacion",
    status: "in_progress"
  });

  const [filtro, setFiltro] = useState("reparacion");
  const [historial, setHistorial] = useState([]);

  const siguienteTurno = () => {
    const siguiente = turnos.find(t => t.status === "waiting" && t.reason === filtro);
    if (siguiente) {
      setTurnos(turnos.map(t =>
        t.turn_number === siguiente.turn_number ? { ...t, status: "in_progress" } : t
      ));
      if (turnoActual) {
        // pasar el turno actual al historial
        setHistorial([...historial, { ...turnoActual, status: "completed" }]);
      }
      setTurnoActual(siguiente);
    } else {
      alert("No hay más turnos pendientes en " + filtro);
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
    <div className="container-fluid mt-4">
      <div className="text-center mb-4">
        <h2>Bienvenido a {filtro === "reparacion" ? "Reparación" : "Cotización"}</h2>
        <div className="btn-group mt-2">
          <button
            className={`btn ${filtro === "reparacion" ? "btn-danger" : "btn-outline-danger"}`}
            onClick={() => setFiltro("reparacion")}
          >
            Reparaciones
          </button>
          <button
            className={`btn ${filtro === "cotizacion" ? "btn-danger" : "btn-outline-danger"}`}
            onClick={() => setFiltro("cotizacion")}
          >
            Cotizaciones
          </button>
        </div>
        <div className="mt-3">
          <button className="btn btn-secondary" onClick={() => navigate("/historial")}>
            Historial
          </button>
        </div>
      </div>

      <div className="row">
        {/* Turno actual - izquierda */}
        <div className="col-md-8 mb-4">
          <div className="card shadow">
            <div className="card-body">
              <h4 className="mb-3 d-flex align-items-center">
                <Zap size={20} className="text-danger me-2" /> Turno en Atención
              </h4>

              {turnoActual ? (
                <CurrentTurnCard turno={turnoActual} siguienteTurno={siguienteTurno} />
              ) : (
                <p>No hay turno en atención.</p>
              )}
            </div>
          </div>
        </div>

        {/* Cola actual - derecha */}
        <div className="col-md-4 mb-4">
          <div className="card shadow">
            <div className="card-body">
              <h4 className="mb-3 d-flex align-items-center">
                <Flag size={20} className="text-danger me-2" /> Cola Actual ({filtro})
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

      <div className="text-center mt-3 mb-5">
        <button className="btn btn-dark me-2" onClick={finalizarDia}>
          Finalizar Día
        </button>
        <button className="btn btn-primary" onClick={siguienteTurno}>
          Siguiente Turno
        </button>
      </div>
    </div>
  );
};

// Turno actual
const CurrentTurnCard = ({ turno, siguienteTurno }) => (
  <div className="current-turn-card h-100 position-relative p-4" style={{ background: 'linear-gradient(135deg, #fd0d0dff 0%, #750b0bff 100%)', color: 'white', borderRadius: '1rem' }}>
    <div className="current-turn-badge d-flex align-items-center mb-3" style={{ background: 'rgba(255,255,255,0.2)', padding: '0.3rem 0.6rem', borderRadius: '2rem', fontSize: '12px' }}>
      <Zap size={16} className="me-1" fill="currentColor" /> En Atención
    </div>

    <div className="text-center mb-3">
      <div className="turn-number-display" style={{ fontSize: '35px' }}>#{turno.turn_number}</div>
      <div className="customer-name" style={{ fontSize: '20px' }}>
        {turno.reason === "reparacion" ? "Ventanilla de Reparación" : "Ventanilla de Cotización"}
      </div>
      <div className="customer-name" style={{ fontSize: '15px' }}>{turno.name}</div>
      <div className="mb-3">
        <span className="badge bg-light text-dark fs-6">
          <Wrench size={14} className="me-1" /> {turno.reason === "reparacion" ? "Reparación" : "Cotización"}
        </span>
      </div>
    </div>

    <div className="turn-details mb-3">
      <div className="detail-item d-flex align-items-center">
        <Clock size={18} className="detail-icon me-2" /> Iniciado: 10:45 AM
      </div>
    </div>
  </div>
);

// Cola
const QueueItem = ({ turn }) => (
  <div className="queue-item p-2 mb-2 bg-light border rounded d-flex justify-content-between align-items-center">
    <div>
      #{turn.turn_number} - {turn.name}
      <br />
      <small>{turn.reason === "reparacion" ? "Reparación" : "Cotización"}</small>
    </div>
    <StatusBadge status={turn.status} />
  </div>
);

const StatusBadge = ({ status }) => {
  const statusConfig = {
    waiting: { color: 'warning', text: 'En Espera' },
    in_progress: { color: 'primary', text: 'En Proceso' },
    completed: { color: 'success', text: 'Completado' }
  };
  const config = statusConfig[status];
  return <span className={`badge bg-${config.color}`}>{config.text}</span>;
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

// App
const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<VistaAdministrador />} />
      <Route path="/historial" element={<HistorialTurnos />} />
    </Routes>
  </Router>
);

export default App;
