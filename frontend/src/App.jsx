import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
// Páginas
import PantallaCompleta from "./pages/pantalla_completa";
import FormularioTurno from "./pages/formulario_turno";
import Login from "./pages/login";
import VistaAdministrador from './pages/vista_administrador';




import { useLocation } from 'react-router-dom';
import { 
  Car, 
  Clock, 
  Users, 
  Settings, 
  User, 
  Phone, 
  MapPin, 
  Wrench, 
  CheckCircle, 
  PlayCircle, 
  Edit,
  Trash2,
  AlertTriangle,
  Flag,
  Calendar,
  TrendingUp,
  Star,
  Zap
} from 'lucide-react';

// Custom CSS styles
const customStyles = `
  body, html, #root {
    width: 100%;
    margin: 0;
    padding: 0;
  }
  
  .navbar-custom {
    background: linear-gradient(90deg, #212529 0%, #dc3545 50%, #212529 100%);
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
  }
  
  .hero-section {
    background: linear-gradient(90deg, #dc3545 0%, #c82333 100%);
    color: white;
    padding: 4rem 0;
    margin-top: 50px;
    margin-bottom: -4rem;
    position: relative;
    width: 100%;
  }
  
  .hero-section::after {
    content: '';
    position: absolute;
    bottom: -40px;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(90deg, #dc3545 0%, #c82333 100%);
    clip-path: ellipse(70% 100% at 50% 0%);
  }
  
  .stat-card {
    border-radius: 1rem;
    box-shadow: 0 8px 30px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    border: none;
    position: relative;
    z-index: 2;
  }
  
  .stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0,0,0,0.15);
  }
  
  .stat-card.clickable {
    cursor: pointer;
  }
  
  .action-card {
    border: 2px solid #e9ecef;
    border-radius: 0.75rem;
    transition: all 0.3s ease;
  }
  
  .action-card:hover {
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    border-color: rgba(220, 53, 69, 0.3);
    transform: translateY(-2px);
  }
  
  .queue-item {
    border-left: 4px solid;
    border-radius: 0 0.5rem 0.5rem 0;
  }
  
  .priority-high {
    border-left-color: #dc3545;
  }
  
  .priority-normal {
    border-left-color: #fd7e14;
  }
  
  .form-control:focus {
    border-color: #dc3545;
    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
  }
  
  .form-select:focus {
    border-color: #dc3545;
    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
  }
  
  .btn-primary {
    background-color: #dc3545;
    border-color: #dc3545;
  }
  
  .btn-primary:hover {
    background-color: #c82333;
    border-color: #c82333;
  }
  
  /* Asegurar que todo ocupe el 100% del ancho */
  .full-width-container {
    width: 100%; 
    max-width: 100%;
    padding-right: 0px;
    padding-left: 0px;
    margin-right: auto;
    margin-left: auto;
  }
  
  .full-width-row {
    margin-bottom: 0rem;
    width: 100%;
    margin-left: 0;
    margin-right: 0;
  }
  
  .full-width-card {
    width: 100%;
  }
  
  /* Estilos para el turno en atención */
  .current-turn-card {
    background: linear-gradient(135deg, #fd0d0dff 0%, #750b0bff 100%);
    color: white;
    border-radius: 1rem;
    padding: 1rem;
    position: relative;
    overflow: hidden;
  }
  
  .current-turn-card::before {
    content: '';
    position: absolute;
    top: -40%;
    right: -50%;
    width: 100%;
    height: 200%;
    background: rgba(255, 255, 255, 0.1);
    transform: rotate(45deg);
    z-index: 1;
  }
  
  .current-turn-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(255, 255, 255, 0.2);
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    font-weight: bold;
    z-index: 2;
  }
  
  .turn-number-display {
    font-size: 4rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    z-index: 2;
    position: relative;
  }
  
  .customer-name {
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
    z-index: 2;
    position: relative;
  }
  
  .turn-details {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 0.75rem;
    padding: 1rem;
    margin-top: 1.5rem;
    z-index: 2;
    position: relative;
  }
  
  .detail-item {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .detail-item:last-child {
    margin-bottom: 0;
  }
  
  .detail-icon {
    margin-right: 0.75rem;
    width: 20px;
  }
`;

// Layout condicional
const AppLayout = ({ children }) => {
  const location = useLocation();
  
  // Rutas que no deben mostrar header ni footer
  const noHeaderFooterRoutes = ['/pantalla_completa'];
  
  // Rutas que solo deben mostrar header pero no footer
  const noFooterRoutes = ['/formulario_turno', '/']; // Agrega aquí otras rutas si es necesario
  
  const hideHeaderFooter = noHeaderFooterRoutes.includes(location.pathname);
  const hideFooterOnly = noFooterRoutes.includes(location.pathname);

  return (
    <>
      {!hideHeaderFooter && <Header />}
      {children}
      {!hideHeaderFooter && !hideFooterOnly && <Footer />}
    </>
  );
};

// Dashboard Component
const Dashboard = () => {
  const navigate = useNavigate(); // hook declarado correctamente

  return (
    <div className="full-width-container">
      <div className="hero-section">
        <div className="container-fluid text-center">
          <h2 className="display-4 fw-bold mb-1">Bienvenido a PitLine</h2>
          <p className="lead opacity-75">
            Tu taller mecánico de confianza en Manzanillo. Sistema de turnos rápido y eficiente.
          </p>
        </div>
      </div>

      <div className="container-fluid" style={{ marginTop: '-5rem', padding: '0 15px' }}>
        <div className="row full-width-row g-4">
          <div className="col-lg-8">
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

          <div className="col-lg-4">
            <div className="card shadow-lg full-width-card">
              <div className="card-body p-4">
                <h3 className="card-title fw-bold text-dark mb-4 d-flex align-items-center">
                  <Flag size={20} className="text-danger me-2" />
                  Cola Actual
                </h3>
                <div className="d-flex flex-column gap-3">
                  <QueueItem turn={{ turn_number: 122, name: "Juan Pérez", reason: "cotizacion", status: "waiting" }} />
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


// Nuevo componente para mostrar el turno actual en atención
const CurrentTurnCard = () => (
  <div className="current-turn-card h-100 position-relative">
    <div className="current-turn-badge d-flex align-items-center">
      <Zap size={16} className="me-1" fill="currentColor" />
      <span style={{ fontSize: '12px' }}>En Atención</span>
    </div>
    
    <div className="text-center">
      <div className="turn-number-display" style={{ fontSize: '35px' }}>#124</div>
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

// Componente principal de la aplicación
const PitLineApp = () => {
  return (
    <Router>
      <AppLayout>
        <style>{customStyles}</style>
        <Routes>
          
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pantalla_completa" element={<PantallaCompleta />} />
          <Route path="/formulario_turno" element={<FormularioTurno />} />
          <Route path="/login" element={<Login />} />
          <Route path="/vista_administrador" element={<VistaAdministrador />} />
        </Routes>
      </AppLayout>
    </Router>
  );
};
export default PitLineApp;