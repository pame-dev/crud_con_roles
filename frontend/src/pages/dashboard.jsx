import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Calendar } from '../iconos';
import CurrentTurnCard from '../components/CurrentTurnCard';
import FilaTurnos from "../components/FilaTurnos";
import { useDiaFinalizado } from '../hooks/useDiaFinalizado';
import './pages-styles/dashboard.css';
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const navigate = useNavigate();
  const [fila, setFila] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [diaFinalizado] = useDiaFinalizado();
  const { t } = useTranslation();

  // Función para cargar la fila desde la API
  const fetchFila = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/turnos/fila");
      if (!res.ok) throw new Error(t("errorCargarFila"));
      const data = await res.json();
      setFila(data);
      setErr("");
    } catch (e) {
      setErr(e.message || t("errorCargarFila"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFila();
    const interval = setInterval(fetchFila, 5000);
    return () => clearInterval(interval);
  }, []);

  const addNewTurnToQueue = (newTurn) => {
    setFila(prevFila => [...prevFila, newTurn]);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="full-width-container"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5 }}
      >
        <div className="hero-section">
          <div className="text-center mt-3">
            <h3 className="display-3 fw-bold mb-1">{t("bienvenida")}</h3>
            <p className="lead opacity-75">{t("descripcionBienvenida")}</p>
          </div>
        </div>

        <div className="container" style={{ marginTop: '-5rem', padding: '0', marginBottom: '2rem' }}>
          <div className="row full-width-row g-3">

            {/* Sección izquierda */}
            <div className="col-lg-8">
              <div className="card shadow-lg full-width-card">
                <div className="card-body p-5">
                  <h3 className="card-title fw-bold text-dark mb-4 d-flex align-items-center" style={{ marginTop: '-2rem'}}>
                    <Wrench size={24} className="text-danger me-3" />
                    {t("accionesRapidas")}
                  </h3>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="action-card p-4 text-center">
                        <Calendar size={60} color="#52130c" className="text-primary mb-3" />
                        <h4 className="fw-bold text-dark">{t("solicitarTurno")}</h4>
                        <p className="text-muted">{t("descripcionSolicitarTurno")}</p>
                        <button
                          className="btn btn-primary w-100"
                          onClick={() => navigate('/formulario_turno')}
                          disabled={diaFinalizado}
                        >
                          {t("agendarAhora")}
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

            {/* Sección derecha */}
            <FilaTurnos cargo={null} />

          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Dashboard;
