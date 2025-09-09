// src/components/CurrentTurnCard.jsx
import React, { useEffect, useState } from 'react';
import { Wrench, Clock, Zap } from '../iconos';
import './CurrentTurnCard.css';

const CurrentTurnCard = ({ variant, onPasarTurno }) => {
  const [turno, setTurno] = useState(null);

  // Función para traer el último turno desde la API
  const fetchUltimoTurno = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/turnos/ultimo'); // Ajusta la ruta
      const data = await response.json();

      if (response.ok && data.turno) {
        // Mapear campos del backend al formato que espera el componente
        const mappedTurno = {
          turn_number: data.turno.ID_TURNO,
          reason: data.turno.ID_AREA === 1 ? 'reparacion' : 'cotizacion',
          name: `${data.turno.NOMBRE} ${data.turno.APELLIDOS}`,
          priority: data.turno.PRIORIDAD || 'baja', // si no hay campo prioridad, usa 'baja'
          started_at: data.turno.HORA, // si quieres mostrar la hora real
        };
        setTurno(mappedTurno);
      } else {
        setTurno(null);
      }
    } catch (error) {
      console.error('Error al traer el último turno:', error);
      setTurno(null);
    }
  };

  useEffect(() => {
    fetchUltimoTurno();

    // Opcional: refrescar cada 10 segundos
    const interval = setInterval(fetchUltimoTurno, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!turno) return <p>No hay turno en atención.</p>;

  const isSuperadmin = variant === 'superadmin';

  return (
    <div className="current-turn-card h-100 position-relative flex-fill">
      <div className="current-turn-badge d-flex align-items-center">
        <Zap size={16} className="me-1" fill="currentColor" />
        <span style={{ fontSize: '12px' }}>
          {isSuperadmin
            ? 'En atención'
            : turno.priority === 'alta'
            ? 'Alta Prioridad'
            : 'Baja Prioridad'}
        </span>
      </div>

      <div className="text-center">
        <div className="turn-number-display" style={{ fontSize: '35px' }}>
          #{turno.turn_number}
        </div>
        <div className="customer-name" style={{ fontSize: '20px' }}>
          {turno.reason === 'reparacion' ? 'Reparación' : 'Cotización'}
        </div>
        <div className="customer-name" style={{ fontSize: '15px' }}>
          {turno.name}
        </div>
        <div className="mb-3">
          <span className="badge bg-light text-dark fs-6">
            <Wrench size={14} className="me-1" />
            <span style={{ fontSize: '12px' }}>
              {turno.reason === 'reparacion' ? 'Reparación' : 'Cotización'}
            </span>
          </span>
        </div>
      </div>

      <div className="turn-details">
        <div className="detail-item">
          <Clock size={18} className="detail-icon" />
          <span style={{ fontSize: '12px' }}>
            Iniciado: {turno.started_at || '---'}
          </span>
        </div>
      </div>

      {/* botón solo para superadministrador */}
      <div className="text-center mt-3">
        {isSuperadmin && (
          <button className="btn btn-pasarturno" onClick={onPasarTurno}>
            <i className="fa-solid fa-circle-right"></i> Pasar turno
          </button>
        )}
      </div>
    </div>
  );
};

export default CurrentTurnCard;
