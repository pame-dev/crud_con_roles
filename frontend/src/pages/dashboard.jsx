import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Calendar, Clock, PlayCircle, CheckCircle, Flag, Zap, AlertTriangle } from '../iconos';
import CurrentTurnCard from '../components/CurrentTurnCard';
import QueueItem from '../components/QueueItem';
import StatusBadge from '../components/StatusBadge';
import './pages-styles/dashboard.css';


const CurrentTurnCard = () => (
  <div className="current-turn-card h-100 position-relative">
    <div className="current-turn-badge d-flex align-items-center">
      <Zap size={12} className="me-1" fill="currentColor" />
      <span style={{ fontSize: '10px' }}>En Atención</span>
    </div>
    
    <div className="text-center">
      <div className="turn-number-display" style={{ fontSize: '30px' }}>#124</div>
      <div className="customer-name" style={{ fontSize: '20px' }}>Ventanilla de Reparación</div>
      <div className="customer-name" style={{ fontSize: '15px' }}>Carlos López</div>
      <div className="mb-3">
        <span className="badge bg-light text-dark fs-6">
          <Wrench size={14} className="me-1" />
          <span style={{ fontSize: '12px' }}>Reparación</span>
        </span>
      </div>
    </div>
    
    <div className="turn-details">
      <div className="detail-item">
        <Clock size={18} className="detail-icon" />
        <span style={{ fontSize: '12px' }}>Iniciado: 10:45 AM</span>
      </div>
    </div>
  </div>
);

const QueueItem = ({ turn }) => (
  <div className={`queue-item p-3 bg-light ${turn.priority === 'alta' ? 'priority-high' : 'priority-normal'}`}>
    <div className="d-flex justify-content-between align-items-start mb-2">
      <div>
        <h6 className="fw-bold text-dark mb-1">#{turn.turn_number} - {turn.name}</h6>
        <small className="text-muted">{turn.reason === 'cotizacion' ? 'Cotización' : 'Reparación'}</small>
      </div>
      <StatusBadge status={turn.status} priority={turn.priority} />
    </div>
  </div>
);

const StatusBadge = ({ status, priority }) => {
  const statusConfig = {
    waiting: { color: 'warning', text: 'En Espera', icon: <Clock size={12} /> },
    in_progress: { color: 'primary', text: 'En Proceso', icon: <PlayCircle size={12} /> },
    completed: { color: 'success', text: 'Completado', icon: <CheckCircle size={12} /> }
  };
  
  const config = statusConfig[status];
  
  return (
    <div className="d-flex flex-column align-items-end gap-1">
      <span className={`badge bg-${config.color} d-flex align-items-center gap-1`}>
        {config.icon}
        {config.text}
      </span>
      {priority === 'alta' && (
        <span className="badge bg-danger d-flex align-items-center gap-1">
          <AlertTriangle size={12} />
          Prioridad Alta
        </span>
      )}
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate(); // hook declarado correctamente

  return (
    <div className="full-width-container" style={{ padding: 0, margin: 0 }}> {/* Contenedor de ancho completo */}

      <div className="hero-section"> {/* Sección Encabezado, Header */}
        <div className="text-center">
          <h2 className="display-4 fw-bold mb-1">Bienvenido a PitLine</h2>
          <p className="lead opacity-75">
            Tu taller mecánico de confianza en Manzanillo. Sistema de turnos rápido y eficiente.
          </p>
        </div>
      </div>

      <div className="container" style={{ marginTop: '-5rem', padding: '0' }}> {/* Contenedor principal de acciones y fila */}
        <div className="row full-width-row g-4"> {/* Fila principal con espacio entre columnas */}
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
