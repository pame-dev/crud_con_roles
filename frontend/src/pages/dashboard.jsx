import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Calendar, Clock, PlayCircle, CheckCircle, Flag, Zap, AlertTriangle } from '../iconos';
import CurrentTurnCard from '../components/CurrentTurnCard';
import QueueItem from '../components/QueueItem';
import StatusBadge from '../components/StatusBadge';
import './pages-styles/dashboard.css';


const Dashboard = () => {
  const navigate = useNavigate(); // hook declarado correctamente

  return (
    <div className="full-width-container"> {/* Contenedor de ancho completo */}

      <div className="hero-section"> {/* Sección Encabezado, Header */}
        <div className="text-center">
          <h2 className="display-3 fw-bold mb-1">PitLine les da la Bienvenida</h2>
          <p className="lead opacity-75">
            Tu taller mecánico de confianza en Manzanillo. Sistema de turnos rápido y eficiente.
          </p>
        </div>
      </div>

      <div className="container" style={{ marginTop: '-5rem', padding: '0' }}> {/* Contenedor principal de acciones y fila */}
        <div className="row full-width-row g-3"> {/* Fila principal con espacio entre columnas */}
          <div className="col-lg-8"> {/* Columna izquierda - Acciones Rápidas */}
            <div className="card shadow-lg full-width-card" > 
              <div className="card-body p-5">
                <h3 className="card-title fw-bold text-dark mb-4 d-flex align-items-center" style={{ marginTop: '-2rem'}}>
                  <Wrench size={24} className="text-danger me-3" />
                  Acciones Rápidas
                </h3>
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="action-card p-4 text-center">
                      <Calendar size={60} color="#52130c" className="text-primary mb-3" />
                      <h4 className="fw-bold text-dark">Solicitar Turno</h4>
                      <p className="text-muted">Agenda tu cita de forma rápida y sencilla</p>
                      <button
                        className="btn btn-primary w-100"
                        onClick={() => navigate('/formulario_turno')}
                      >
                        Agendar Ahora
                      </button>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <CurrentTurnCard />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4"> {/* Columna derecha - Fila Actual */}
            <div className="card shadow-lg full-width-card">
              <div className="card-body p-4">
                <h3 className="card-title fw-bold text-dark mb-4 d-flex align-items-center">
                  <Flag size={20} className="text-danger me-2" />
                  Fila Actual
                </h3>
                <div className="d-flex flex-column gap-3">
                  <QueueItem turn={{ turn_number: 122, name: "Juan Pérez", reason: "cotizacion", status: "waiting", priority: "alta"}} />
                  <QueueItem turn={{ turn_number: 123, name: "María García", reason: "reparacion", status: "waiting" }} />
                  <QueueItem turn={{ turn_number: 124, name: "Carlos López", reason: "reparacion", status: "in_progress" }} />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
