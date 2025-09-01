import React from 'react';
import { Wrench, Clock, Zap } from '../iconos';
import './CurrentTurnCard.css';

const CurrentTurnCard = ({ turno }) => {
  if (!turno) return <p>No hay turno en atención.</p>;

  return (
    <div className="current-turn-card h-100 position-relative flex-fill">
      <div className="current-turn-badge d-flex align-items-center">
        <Zap size={16} className="me-1" fill="currentColor" />
        <span style={{ fontSize: '12px' }}>
          {turno.priority === 'alta' ? 'Alta Prioridad' : 'Baja Prioridad'}
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
          <span style={{ fontSize: '12px' }}>Iniciado: 10:45 AM</span>
        </div>
      </div>
    </div>
  );
};

export default CurrentTurnCard;
