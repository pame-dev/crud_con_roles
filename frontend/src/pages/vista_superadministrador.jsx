import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wrench, Flag, Zap, Clock, ArrowLeft } from "../iconos";
import CurrentTurnCard from '../components/CurrentTurnCard';
import QueueItem from '../components/QueueItem';
import StatusBadge from '../components/StatusBadge';
import './pages-styles/superadmin.css';


// Vista Administrador
const VistaSuperadministrador = () => {
  const navigate = useNavigate();

    const [turnos, setTurnos] = useState([
      { turn_number: 122, name: "Juan Pérez", reason: "cotizacion", status: "waiting", priority: "alta" },
      { turn_number: 123, name: "María García", reason: "reparacion", status: "waiting", priority: "alta" },
      { turn_number: 124, name: "Carlos López", reason: "reparacion", status: "waiting", priority: "baja" },
      { turn_number: 125, name: "Ana Torres", reason: "cotizacion", status: "waiting", priority: "baja" },
      { turn_number: 126, name: "Luis Gómez", reason: "reparacion", status: "waiting",priority: "baja" },
      { turn_number: 127, name: "Sofía Ramírez", reason: "cotizacion", status: "waiting",priority: "alta" }
    ]);

const [turnosEnProgreso, setTurnosEnProgreso] = useState([
  {
    turn_number: 124,
    name: "Carlos López",
    reason: "reparacion",
    status: "in_progress"
  }
]);


  const [filtro, setFiltro] = useState("reparacion");
  const [historial, setHistorial] = useState([]);

const siguienteTurno = () => {
  const siguiente = turnos.find(t => t.status === "waiting" && t.reason === filtro);
  if (siguiente) {
    setTurnos(turnos.map(t =>
      t.turn_number === siguiente.turn_number ? { ...t, status: "in_progress" } : t
    ));

    // mover el turno anterior al historial si ya estaba en progreso
    setTurnosEnProgreso(prev => {
    const nuevos = [...prev.slice(-2), siguiente]; // mantener solo 1 anterior + el nuevo
    // los que se salgan de la ventana de 2 turnos pasan a historial
    const aHistorial = prev.slice(0, -1).map(t => ({ ...t, status: "completed" }));
    setHistorial(hist => [...hist, ...aHistorial]);
    return nuevos;
    });


    // agregar el siguiente turno al array de en progreso
  } else {
    alert("No hay más turnos pendientes en " + filtro);
  }
};


const finalizarDia = () => {
  if (turnosEnProgreso.length > 0) {
    const completados = turnosEnProgreso.map(t => ({ ...t, status: "completed" }));
    setHistorial([...historial, ...completados]);
  }
  setTurnos([]);
  setTurnosEnProgreso([]);
  alert("Día finalizado, se limpiaron los turnos.");
};
;

  const colaFiltrada = turnos.filter(t => t.reason === filtro && t.status === "waiting");

  return (
    <div className="full-width-container"> {/* Contenedor de ancho completo */}

      <div className="hero-section">  {/* Sección Encabezado, Header */}
        <div className="container text-center">
          <h2 className="display-4 fw-bold mb-1">Administración</h2>
          <h3 className="display-13 fw-bold mb-1">Área general</h3>
        </div>
      </div>

    

      <div className="container" style={{ marginTop: '-3rem' }}> {/* Contenedor principal de acciones y fila */}
        <div className="row full-width-row g-4"> {/* Fila principal con espacio entre columnas */}

          <div className="col-md-12 mb-4"> {/* Columna izquierda - Turno en Atención */}
            <div className="card shadow">
              <div className="card-body">
                <h4 className="d-flex align-items-center card-title fw-bold text-dark mb-4">
                  <Zap size={20} className="text-danger me-2" /> Turno en Atención
                </h4>

                <div className="turnos-grid">
                  {turnosEnProgreso.length > 0 ? (
                    turnosEnProgreso.map(t => (
                      <div key={t.turn_number} className="turno-card">
                        <CurrentTurnCard 
                          turno={t} 
                          variant="superadmin" 
                          onPasarTurno={siguienteTurno} 
                        />
                      </div>
                    ))
                  ) : (
                    <p>No hay turnos en atención.</p>
                  )}
                </div>


              </div>

              <div className="text-center mt-3 mb-5">
                
                {/* Aquí cambiar la funcion de administrar cuando haya */}
                <button className="btn btn-custom" onClick={siguienteTurno}>
                  Administrar 
                </button>

                <button className="btn btn-custom" onClick={finalizarDia}>
                  Finalizar Día
                </button>

                <button className="btn btn-custom" onClick={() => navigate("/historial")}>
                  Historial
                </button>
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

export default VistaSuperadministrador;
