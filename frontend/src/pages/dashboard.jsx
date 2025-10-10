import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Calendar, Clock, PlayCircle, CheckCircle, Flag, Zap, AlertTriangle } from '../iconos';
import CurrentTurnCard from '../components/CurrentTurnCard';
import QueueItem from '../components/QueueItem';
import { useDiaFinalizado } from '../hooks/useDiaFinalizado';
import './pages-styles/dashboard.css';
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = () => {
  const navigate = useNavigate();
  const [fila, setFila] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [diaFinalizado] = useDiaFinalizado();

  // Cargar la fila desde la API
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/turnos/fila")
      .then(res => res.json())
      .then(data => setFila(data))
      .catch(e => setErr(e.message || "Error al cargar la fila"))
      .finally(() => setLoading(false));
  }, []);

  // Función para agregar un nuevo turno (puede llamarse desde formulario_turno)
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
                          className="btn btn-primary w-100"
                          onClick={() => navigate('/formulario_turno')}
                          disabled={diaFinalizado}
                        >
                          Agendar Ahora
                        </button>
                      </div>
                    </div>

                    <div className="col-md-6">
                      {/* Aquí puedes pasar un turno actual si lo tienes */}
                      <CurrentTurnCard />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección derecha: fila de turnos */}
            <div className="col-lg-4">
              <div className="card shadow-lg full-width-card">
                <div className="card-body p-4">
                  <h3 className="card-title fw-bold text-dark mb-4 d-flex align-items-center">
                    <Flag size={20} className="text-danger me-2" />
                    Fila Actual
                  </h3>
                  <div className="d-flex flex-column gap-3">
                    {loading && <p className="text-muted">Cargando...</p>}
                    {err && <p className="text-danger">{err}</p>}
                    {!loading && !err && fila.length === 0 && (
                      <p className="text-muted">No hay turnos pendientes</p>
                    )}
                    {/* Mostramos solo los 3 turnos más antiguos */}
                    {!loading && !err && fila.length > 0 && 
                      [...fila]  // hacemos una copia para no mutar el estado
                        .sort((a, b) => a.turn_number - b.turn_number) // ordenar de más antiguo a más reciente
                        .slice(0, 3)  // tomar solo los 3 más antiguos
                        .map(turn => (
                          <QueueItem key={turn.turn_number} turn={turn} />
                        ))
                    }

                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Dashboard;
