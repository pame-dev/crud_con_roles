// src/components/CurrentTurnCard.jsx
import React, { useEffect, useState } from 'react';
import { Wrench, Clock, Zap } from '../iconos';
import { fetchTurnoEnAtencion } from '../api/turnosApi';
import './CurrentTurnCard.css';

const CurrentTurnCard = ({ variant, onPasarTurno }) => {
  const [turno, setTurno] = useState(null);

  // Función para traer el turno que está en atención
  const fetchTurnoEnAtencion = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/turnos/en_atencion'); // Ajusta la ruta
      const data = await response.json();

      if (response.ok && data.turno) {
        // Asegúrate de usar el campo correcto de tu API
        const mappedTurno = {
          turn_number: data.turno.ID_TURNO,
          reason: data.turno.ID_AREA === 1 ? "Reparación" : `Pase al módulo: ${data.turno.ID_EMPLEADO}`,
          name: data.turno.cliente, // cliente
          empleado_nombre: data.turno.empleado_nombre, // ⚡ usa exactamente este nombre
          priority: data.turno.PRIORIDAD || "baja",
          started_at: new Date(data.turno.ATENCION_EN).toLocaleString(),
          isReparacion: data.turno.ID_AREA === 1,
        };



        setTurno(mappedTurno);
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

    // Refrescar cada 10 segundos
    const interval = setInterval(fetchTurnoEnAtencion, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!turno) return <div className="current-turn-card h-100 position-relative flex-fill text-center"><p>No hay turno en atención.</p></div>;

  const isSuperadmin = variant === 'superadmin';

  return (
    <div className="current-turn-card h-100 position-relative flex-fill">
      <div className="text-center">
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
      </div>

      <div className="turn-details">
        <div className="detail-item">
          <Clock size={18} className="detail-icon" />
          <span style={{ fontSize: '12px' }}>
            Iniciado: {turno.started_at || '---'}
          </span>
        </div>
      </div>

      {isSuperadmin && (
        <div className="text-center mt-3">
          <button className="btn btn-pasarturno" onClick={onPasarTurno}>
            <i className="fa-solid fa-circle-right"></i> Pasar turno
          </button>
        </div>
      )}
    </div>
  );
};

export default CurrentTurnCard;
