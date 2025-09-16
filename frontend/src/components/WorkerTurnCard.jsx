import React, { useEffect, useState } from 'react';
import { Wrench, Clock } from '../iconos';
import { ArrowRightCircle } from "lucide-react"; 
import './CurrentTurnCard.css';
import { pasarTurno } from "../api/turnosApi"; // Importa la función pasarTurno


const WorkerTurnCard = ({ filtroBusqueda = "", mostrarCargo = false }) => {
  const [trabajadores, setTrabajadores] = useState([]);
  const [turnoEnProceso, setTurnoEnProceso] = useState(null); // ID del trabajador cuyo turno se está pasando

  // Función para traer trabajadores
  const fetchTrabajadores = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/trabajadores/con-turno');
      const data = await response.json();
      setTrabajadores(data);
    } catch (error) {
      console.error('Error al traer trabajadores:', error);
      setTrabajadores([]);
    }
  };

  // Refrescar cada 10 segundos
  useEffect(() => {
    fetchTrabajadores();
    const interval = setInterval(fetchTrabajadores, 10000);
    return () => clearInterval(interval);
  }, []);

  // Filtrado por nombre o cargo
  const trabajadoresFiltrados = trabajadores.filter(t =>
    t.NOMBRE.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
    (t.CARGO && t.CARGO.toLowerCase().includes(filtroBusqueda.toLowerCase()))
  );

  if (!trabajadoresFiltrados.length) return <p>No hay trabajadores que coincidan.</p>;


  
  // Función para pasar turno
  const handlePasarTurno = async (idEmpleado, cargo) => {
    setTurnoEnProceso(idEmpleado); // activar mensaje
    try {
      await pasarTurno(idEmpleado, cargo);
      await fetchTrabajadores(); // refrescar lista si quieres
    } catch (err) {
      console.error("Error al pasar turno:", err);
    } finally {
      setTurnoEnProceso(null); // quitar mensaje
    }
  };




  return (
    <>
      {trabajadoresFiltrados.map((t) => {
        const turno = t.turnos.length > 0 ? t.turnos[0] : null;

        return (
          <div key={t.ID_EMPLEADO} className="current-turn-card h-100 position-relative flex-fill mb-3">
            <div className="text-center">
              {/* Nombre del trabajador */}
              <div className="turn-number-display" style={{ fontSize: '28px' }}>
                {t.NOMBRE} {t.APELLIDOS}
              </div>

              {/* Mostrar cargo solo en superadministrador */}
              {mostrarCargo && (
                <div className="cargo-display" style={{ fontSize: '14px', color: '#fcfbfbff', marginBottom: '5px' }}>
                  Cargo: {t.CARGO}
                </div>
              )}

              {/* Información del turno */}
              {turno ? (
                <>
                  <div className="customer-name" style={{ fontSize: '18px' }}>
                    {turno.ID_AREA === 1 ? 'Reparación' : 'Cotización'}
                  </div>
                  <div className="customer-name" style={{ fontSize: '15px' }}>
                    Atendiendo turno: #{turno.ID_TURNO}
                  </div>
                  <div className="mb-3">
                    <span className="badge bg-light text-dark fs-6">
                      <Wrench size={14} className="me-1" />
                      <span style={{ fontSize: '12px' }}>
                        {turno.ID_AREA === 1 ? 'Reparación' : 'Cotización'}
                      </span>
                    </span>
                  </div>
                  <div className="turn-details">
                    <div className="detail-item">
                      <Clock size={18} className="detail-icon" />
                      <span style={{ fontSize: '12px' }}>Inició: {turno.HORA}</span>
                    </div>
                  </div>
                </>
              ) : (
                <p style={{ fontSize: '14px', color: '#d4c2c2ff' }}>
                  {turnoEnProceso === t.ID_EMPLEADO ? "Pasando de turno..." : "no está atendiendo"}
                </p>
              )}

              {/* Botón fijo */}
              <div className="worker-footer mt-3">
                <button
                  className="btn-pass-turn"
                  onClick={() => handlePasarTurno(t.ID_EMPLEADO, t.CARGO.toLowerCase())}
                >
                  Pasar turno
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default WorkerTurnCard;
