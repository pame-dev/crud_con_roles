// src/pages/pantalla_completa.jsx
import React, { useState } from "react";
import { ChevronLeft, Wrench, Flag, Clock, PlayCircle, CheckCircle, AlertTriangle, Zap } from "../iconos";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import './pages-styles/pantalla_completa.css';
import CurrentTurnCard from '../components/CurrentTurnCard';
import QueueItem from '../components/QueueItem';
import StatusBadge from '../components/StatusBadge';

const PantallaCompleta = () => {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);

  const handleExit = () => {
    setIsExiting(true);
    setTimeout(() => navigate("/ "), 500); // ⏳ espera animación
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="full-width-container"
          initial={{ opacity: 0, x: 50 }}     // entra desde derecha
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}       // sale hacia izquierda
          transition={{ duration: 0.5 }}
        >
          {/* Hero Section */}
          <div className="hero-section-pc">
            {/* Flecha para regresar */}
            <div 
              className="back-arrow text-start mt-3 ms-3"
              style={{ cursor: "pointer" }}
              onClick={handleExit}
            >
              <ChevronLeft size={32} className="text-light" />
            </div>
            <div className="container-fluid text-center">
              <h2 className="display-4 fw-bold mb-4">Bienvenido a PitLine</h2>
              <p className="lead opacity-75">
                Tu taller mecánico de confianza en Manzanillo. Sistema de turnos rápido y eficiente.
              </p>
            </div>
          </div>

          <div className="container-fluid" style={{ marginTop: '-2rem', padding: '0 15px' }}>
            <div className="row full-width-row g-4">
              {/* Quick Actions */}
              <div className="col-lg-8">
                <div className="card shadow-lg full-width-card">
                  <div className="card-body p-5">
                    <h3 className="card-title fw-bold text-dark mb-4 d-flex align-items-center">
                      <Wrench size={24} className="text-danger me-3" />
                      Acciones Rápidas
                    </h3>
                    <div className="row g-4">
                      <div className="col-md-12">
                        <CurrentTurnCard />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Queue */}
              <div className="col-lg-4">
                <div className="card shadow-lg full-width-card">
                  <div className="card-body p-4">
                    <h3 className="card-title fw-bold text-dark mb-4 d-flex align-items-center">
                      <Flag size={20} className="text-danger me-2" />
                      Fila Actual
                    </h3>
                    <div className="d-flex flex-column gap-3">
                      <QueueItem 
                        turn={{ turn_number: 122, name: "Juan Pérez", reason: "cotizacion", status: "waiting", priority: "alta" }} 
                      />
                      <QueueItem 
                        turn={{ turn_number: 123, name: "María García", reason: "reparacion", status: "waiting", priority: "normal" }} 
                      />
                      <QueueItem 
                        turn={{ turn_number: 124, name: "Carlos López", reason: "reparacion", status: "in_progress", priority: "normal" }} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CSS Inline */}
          <style>{`
            .full-width-container {
              width: 100%; 
              max-width: 100%;
              padding-right: 0;
              padding-left: 0;
              margin: 0 auto;
            }

            .hero-section {
              background: linear-gradient(90deg, #dc3545 0%, #c82333 100%);
              color: white;
              padding: 2rem 2rem 2rem 2rem;
              margin: -3.5rem 0rem -4rem -1.3rem; 
              position: relative;
              width: 100vw;
            }

            .hero-section::after {
              content: '';
              position: absolute;
              bottom: -50px;
              left: 0;
              right: 0;
              height: 100px;
              background: linear-gradient(90deg, #dc3545 0%, #c82333 100%);
              clip-path: ellipse(70% 100% at 50% 0%);
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
              top: -50%;
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
              right: 0.5rem;
              background: rgba(255, 255, 255, 0.2);
              padding: 0.5rem 1rem;
              border-radius: 2rem;
              font-weight: bold;
              z-index: 2;
            }

            .turn-number-display {
              font-size: 4rem;
              font-weight: bold;
              margin-bottom: 0.2rem;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
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
          `}</style>

        </motion.div>
      )}
    </AnimatePresence>
  );
};


export default PantallaCompleta;
