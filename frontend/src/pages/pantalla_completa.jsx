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
    setTimeout(() => navigate("/"), 500); // ⏳ espera animación
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
              className="back-arrow text-start mt-2 ms-3"
              style={{ cursor: "pointer" }}
              onClick={handleExit}
            >
              <ChevronLeft size={32} className="text-light" />
            </div>
            <div className="container-fluid text-center">
              <h2 className="display-3 fw-bold mb-3">PitLine les da la Bienvenida</h2>
              <p className="lead opacity-75">
                Tu taller mecánico de confianza en Manzanillo. Sistema de turnos rápido y eficiente.
              </p>
            </div>
          </div>

          <div className="container-fluid" style={{ marginTop: '-5rem', padding: '0 15px' }}>
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
                      <div className="col-md-60">
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

          
        </motion.div>
      )}
    </AnimatePresence>
  );
};


export default PantallaCompleta;
