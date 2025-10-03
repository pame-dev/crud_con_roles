// src/components/CurrentTurnCard.jsx
import React, { useEffect, useState } from 'react';
import { Wrench, Clock } from '../iconos';
import { useTranslation } from 'react-i18next';
import './CurrentTurnCard.css';

const CurrentTurnCard = ({ variant, onPasarTurno }) => {
  const [turno, setTurno] = useState(null);
  const { t } = useTranslation(); //  Hook para traducciones

  const loadTurnoEnAtencion = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/turnos/en_atencion');
      const data = await response.json();

      if (response.ok && data.turno) {
        const mappedTurno = {
          turn_number: data.turno.ID_TURNO,
          reason: data.turno.ID_AREA === 1 
            ? t('reparacion') 
            : t('pasarAlModulo', { modulo: data.turno.ID_EMPLEADO }),
          name: data.turno.cliente || "Cliente",
          empleado_nombre: data.turno.empleado_nombre || null,
          priority: data.turno.PRIORIDAD || "baja",
          started_at: data.turno.ATENCION_EN 
            ? new Date(data.turno.ATENCION_EN).toLocaleString() 
            : "---",
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
    loadTurnoEnAtencion();
    const interval = setInterval(loadTurnoEnAtencion, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!turno) {
    return (
      <div className="current-turn-card h-100 d-flex justify-content-center align-items-center text-center">
        <p>{t('turnoEnAtencion')}</p> {/*  traducido */}
      </div>
    );
  }

  const isSuperadmin = variant === 'superadmin';

  return (
    <div className="current-turn-card h-100 position-relative flex-fill">
      <div className="text-center">
        <div className="turn-number-display fs-1">#{turno.turn_number}</div>

        <div className="turn-reason fs-5">{turno.reason}</div>

        {turno.empleado_nombre && (
          <div className="turn-employee" style={{ fontSize: '14px', color: '#fff' }}>
            {t('atendidoPor')}: {turno.empleado_nombre} {/* 👈 traducido */}
          </div>
        )}

        <div className="mb-3">
          <span className="badge bg-light text-dark fs-6">
            <Wrench size={14} className="me-1" />
            <span className="fs-7">
              {turno.isReparacion ? t('reparacion') : t('cotizacion')}
            </span>
          </span>
        </div>
      </div>

      <div className="turn-details">
        <div className="detail-item">
          <Clock size={18} className="detail-icon" />
          <span className="fs-7">{t('iniciado')}: {turno.started_at}</span> {/*  traducido */}
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
