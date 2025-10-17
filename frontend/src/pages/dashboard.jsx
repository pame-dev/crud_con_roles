import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Calendar } from '../iconos';
import CurrentTurnCard from '../components/CurrentTurnCard';
import FilaTurnos from "../components/FilaTurnos";
import { useDiaFinalizado } from '../hooks/useDiaFinalizado';
import './pages-styles/dashboard.css';
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = () => {
  const navigate = useNavigate();
  const [fila, setFila] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [diaFinalizado] = useDiaFinalizado();

  // Función para cargar la fila desde la API
  const fetchFila = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/turnos/fila");
      if (!res.ok) throw new Error("Error al cargar la fila");
      const data = await res.json();
      setFila(data);
      setErr("");
    } catch (e) {
      setErr(e.message || "Error al cargar la fila");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Primer fetch al montar
    fetchFila();

    // Intervalo cada 5 segundos
    const interval = setInterval(fetchFila, 5000);

    // Limpiar el interval al desmontar
    return () => clearInterval(interval);
  }, []);

  // Función para agregar un nuevo turno (si quieres usar desde otro componente)
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
            <h3 className="display-3 fw-bold mb-1">PitLine les da la Bienvenida</h3>
            <p className="lead opacity-75">
              Tu taller mecánico de confianza en Manzanillo. Sistema de turnos rápido y eficiente.
            </p>
          </div>
        </div>

        <div className="container" style={{ marginTop: '-5rem', padding: '0', marginBottom: '2rem' }}>
          <div className="row full-width-row g-3">

            {/* Sección izquierda: acciones y CurrentTurnCard */}
            <div className="col-lg-8">
              <div className="card shadow-lg full-width-card">
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
                          className="turno-btn text-white fw-bold mt-3 w-100 btn-primary"
                          onClick={() => navigate('/formulario_turno')}
                          disabled={diaFinalizado}
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

            {/* Sección derecha: fila de turnos */}
            <FilaTurnos cargo={null}/>

          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Dashboard;
