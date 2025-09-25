import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TurnoEmpleadoInd = () => {
  const [turno, setTurno] = useState(null);
  const [empleado, setEmpleado] = useState(null);
  const [cargando, setCargando] = useState(true); // Estado de carga

  useEffect(() => {
    const emp = JSON.parse(localStorage.getItem("empleado"));
    if (!emp) {
      setCargando(false);
      return;
    }
    setEmpleado(emp);

    // Obtener el turno del empleado logueado
    axios
      .get(`http://127.0.0.1:8000/api/trabajadores/con-turno?cargo=${emp.CARGO}`)
      .then(res => {
        const miTurno = res.data.find(t => t.ID_EMPLEADO === emp.ID_EMPLEADO);
        setTurno(miTurno?.turnos[0] || null);
      })
      .catch(err => console.error("Error al obtener turno:", err))
      .finally(() => setCargando(false));
  }, []);

  const formatHora = (hora) => {
    if (!hora) return "—";
    const date = new Date(hora);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (cargando) return <p>Cargando turno...</p>;
  if (!empleado) return <p>No hay empleado logueado.</p>;
  if (!turno) return <p>No tienes turno en atención.</p>;

  return (
    <div className="current-turn-card mb-2 p-3 shadow-sm rounded text-center">
      <div className="turn-number-display" style={{ fontSize: '35px' }}>
        #{turno.ID_TURNO}
      </div>
      <div>Cliente: {turno.NOMBRE} {turno.APELLIDOS}</div>
      <div>Hora de atención: {formatHora(turno.ATENCION_EN)}</div>
      {empleado.ESTADO !== undefined && (
        <div>Estado: {empleado.ESTADO === 1 ? "Presente" : "Ausente"}</div>
      )}
    </div>
  );
};

export default TurnoEmpleadoInd;
