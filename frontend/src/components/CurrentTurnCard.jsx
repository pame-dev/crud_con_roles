import React from 'react';
import { Wrench, Clock, Zap } from '../iconos';

// Componente para la tarjeta del turno actual
const CurrentTurnCard = () => (
  <div className="current-turn-card h-100 position-relative">
    <div className="current-turn-badge d-flex align-items-center">
      <Zap size={16} className="me-1" fill="currentColor" />
      <span style={{ fontSize: '12px' }}>En Atención</span>
    </div>
    
    <div className="text-center">
      <div className="turn-number-display" style={{ fontSize: '35px' }}>#124</div>
      <div className="customer-name" style={{ fontSize: '20px' }}>Ventanilla de Reparación</div>
      <div className="customer-name" style={{ fontSize: '15px' }}>Carlos López</div>
      <div className="mb-3">
        <span className="badge bg-light text-dark fs-6">
          <Wrench size={14} className="me-1" />
          <span style={{ fontSize: '12px' }}>Reparación</span>
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

export default CurrentTurnCard;
