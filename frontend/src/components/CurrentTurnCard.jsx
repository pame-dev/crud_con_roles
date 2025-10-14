import React, { useEffect, useState, useRef } from 'react';
import { Wrench, Clock } from '../iconos';
import { motion, AnimatePresence } from 'framer-motion';
import './CurrentTurnCard.css';

const CurrentTurnCard = ({ variant, onPasarTurno }) => {
  const [turno, setTurno] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(false); // ✅ si el usuario activó el audio
  const previousTurnoRef = useRef(null);
  const soundRef = useRef(null);

  // Función para desbloquear audio
  const handleEnableAudio = () => {
    if (soundRef.current) {
      soundRef.current.play()
        .then(() => {
          soundRef.current.pause();
          soundRef.current.currentTime = 0;
          setAudioEnabled(true);
        })
        .catch(() => {});
    }
  };

  // Traer el turno en atención
  const fetchTurnoEnAtencion = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/turnos/en_atencion');
      const data = await response.json();

      if (response.ok && data.turno) {
        const mappedTurno = {
          turn_number: data.turno.ID_TURNO,
          reason: data.turno.ID_AREA === 1
            ? 'Reparación'
            : `Pase al módulo: ${data.turno.ID_EMPLEADO}`,
          name: data.turno.cliente,
          empleado_nombre: data.turno.empleado_nombre,
          priority: data.turno.PRIORIDAD || 'baja',
          started_at: new Date(data.turno.ATENCION_EN).toLocaleString(),
          isReparacion: data.turno.ID_AREA === 1,
        };

        setTurno(prev => (!prev || prev.turn_number !== mappedTurno.turn_number ? mappedTurno : prev));
      } else {
        setTurno(null);
      }
    } catch (error) {
      console.error('Error al traer el turno en atención:', error);
      setTurno(null);
    }
  };

  useEffect(() => {
    fetchTurnoEnAtencion();
    const interval = setInterval(fetchTurnoEnAtencion, 2000);
    return () => clearInterval(interval);
  }, []);

  // Reproducir sonido cuando cambia el turno
  useEffect(() => {
    if (!turno || !audioEnabled) return;

    if (previousTurnoRef.current !== turno.turn_number) {
      previousTurnoRef.current = turno.turn_number;
      if (soundRef.current) {
        soundRef.current.currentTime = 0;
        soundRef.current.play().catch(err => console.log('No se pudo reproducir el sonido:', err));
      }
    }
  }, [turno, audioEnabled]);

  const isSuperadmin = variant === 'superadmin';

  if (!turno)
    return (
      <div className="current-turn-card h-100 position-relative flex-fill text-center">
        <p>No hay turno en atención.</p>
        {!audioEnabled && (
          <button className="btn btn-primary mt-2" onClick={handleEnableAudio}>
            Activar sonido
          </button>
        )}
      </div>
    );

  return (
    <div className="current-turn-card h-100 position-relative flex-fill text-center">
      <audio ref={soundRef} src="/sounds/turno-notificacion.mp3" preload="auto" />

      {!audioEnabled && (
        <button className="btn btn-primary mt-2" onClick={handleEnableAudio}>
          Activar sonido
        </button>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={turno.turn_number}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <div className="turn-number-display" style={{ fontSize: '35px' }}>
            #{turno.turn_number}
          </div>

          <div className="customer-name" style={{ fontSize: '20px' }}>
            {turno.reason}
          </div>

          <div className="customer-name" style={{ fontSize: '14px' }}>
            {turno.empleado_nombre ? `Atendido por: ${turno.empleado_nombre}` : null}
          </div>

          <div className="mb-3">
            <span className="badge bg-light text-dark fs-6">
              <Wrench size={14} className="me-1" />
              <span style={{ fontSize: '12px' }}>
                {turno.isReparacion ? 'Reparación' : 'Cotización'}
              </span>
            </span>
          </div>

          <div className="turn-details">
            <div className="detail-item">
              <Clock size={18} className="detail-icon" />
              <span style={{ fontSize: '12px' }}>Iniciado: {turno.started_at || '---'}</span>
            </div>
          </div>

          {isSuperadmin && (
            <div className="text-center mt-3">
              <button className="btn btn-pasarturno" onClick={onPasarTurno}>
                <i className="fa-solid fa-circle-right"></i> Pasar turno
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CurrentTurnCard;
