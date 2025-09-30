import React from "react";
import './QueueItem.css';
import StatusBadge from './StatusBadge';

// Componente para un ítem en la cola de turnos
const QueueItem = ({ turn }) => (
  <div className={`queue-item px-3 py-0 bg-light ${turn.priority === 'alta' ? 'priority-high' : 'priority-normal'}`}>
    <div className="d-flex justify-content-between align-items-start mb-2">
      <div>
        <h6 className="fw-bold text-dark mb-1">#{turn.turn_number} - {turn.name}</h6>
        <small className="text-muted">{turn.reason === 'cotizacion' ? 'Cotización' : 'Reparación'}</small>
      </div>
      <StatusBadge status={turn.status} priority={turn.priority} />
    </div>
  </div>
);

export default QueueItem;