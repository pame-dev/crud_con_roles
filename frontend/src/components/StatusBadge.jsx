import React from 'react';
import { Clock, PlayCircle, CheckCircle, AlertTriangle } from '../iconos';

// Componente para el badge de estado y prioridad

const StatusBadge = ({ status, priority }) => {
  const statusConfig = {
    waiting: { color: 'warning', text: 'En Espera', icon: <Clock size={12} /> },
    in_progress: { color: 'primary', text: 'En Proceso', icon: <PlayCircle size={12} /> },
    completed: { color: 'success', text: 'Completado', icon: <CheckCircle size={12} /> }
  };
  
  const config = statusConfig[status];
  
  return (
    <div className="d-flex flex-column align-items-end gap-1">
      <span className={`badge bg-${config.color} d-flex align-items-center gap-1`}>
        {config.icon}
        {config.text}
      </span>
      {priority === 'alta' && (
        <span className="badge bg-danger d-flex align-items-center gap-1">
          <AlertTriangle size={12} />
          Prioridad Alta
        </span>
      )}
    </div>
  );
};

export default StatusBadge;