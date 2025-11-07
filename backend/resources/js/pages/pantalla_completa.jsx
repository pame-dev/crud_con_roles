import React, { useState, useEffect } from 'react';
import { ChevronLeft, Wrench, Flag } from "../iconos";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import './pages-styles/pantalla_completa.css';
import CurrentTurnCard from '../components/CurrentTurnCard';
import FilaTurnos from "../components/FilaTurnos";

const PantallaCompleta = () => {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);

  const handleExit = () => {
    setIsExiting(true);
    setTimeout(() => navigate("/"), 500); // ⏳ espera animación
  };

  const [fila, setFila] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Cargar la fila desde la API
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/turnos/fila")
      .then(res => res.json())
      .then(data => setFila(data))
      .catch(e => setErr(e.message || "Error al cargar la fila"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="full-width-container"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero Section */}
          <div className="hero-section-pc darkable">
            <button
              className="btn_regresar hero-backk"
              onClick={handleExit}
              aria-label="Regresar"
              title="Regresar"
            >
              <ChevronLeft size={22} />
            </button>

            <div className="container-fluid text-center">
              <h2 className="display-3 fw-bold mb-3">PitLine les da la Bienvenida</h2>
              <p className="lead opacity-75">
                Tu taller mecánico de confianza en Manzanillo. Sistema de turnos rápido y eficiente.
              </p>
            </div>
          </div>

          <div className="container-fluid" style={{ marginTop: '-5rem', padding: '0 15px' }}>
            <div className="row full-width-row g-4">

              {/* Turno en atención */}
              <div className="col-lg-8">
                <div className="card shadow-lg full-width-card darkable">
                  <div className="card-body p-4">
                    <h3 className="card-title fw-bold text-dark mb-5 d-flex align-items-center">
                      <Wrench size={24} className="text-danger me-3" />
                      Turno en atención
                    </h3>
                    <div className="row g-4">
                      <div className="col-md-60">
                        <CurrentTurnCard />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fila actual */}
              <FilaTurnos cargo={null}/>

            </div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PantallaCompleta;
