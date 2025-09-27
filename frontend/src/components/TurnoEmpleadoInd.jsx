import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion";

const TurnoEmpleadoInd = () => {
  const [turno, setTurno] = useState(null);
  const [empleado, setEmpleado] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [pasando, setPasando] = useState(false);
  const [mensajeGerente, setMensajeGerente] = useState(null);
  const turnoPrevio = useRef(null); // 👈 guardamos el turno anterior

  useEffect(() => {
    const emp = JSON.parse(localStorage.getItem("empleado"));
    if (!emp) {
      setCargando(false);
      return;
    }
    setEmpleado(emp);
    fetchTurno(emp);

    const interval = setInterval(() => fetchTurno(emp), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (mensajeGerente) {
      const timer = setTimeout(() => setMensajeGerente(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [mensajeGerente]);

  const fetchTurno = async (emp) => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/trabajadores/con-turno?cargo=${emp.CARGO}`
      );
      const miTurno = res.data.find(t => t.ID_EMPLEADO === emp.ID_EMPLEADO)?.turnos[0] || null;

      // Si el turno cambió, mostrar mensaje
      if (turnoPrevio.current && miTurno?.ID_TURNO !== turnoPrevio.current?.ID_TURNO) {
        setMensajeGerente("El gerente te ha asignado un nuevo turno");
      }

      turnoPrevio.current = miTurno; // actualizar referencia
      setTurno(miTurno);
    } catch (err) {
      console.error("Error al obtener turno:", err);
    } finally {
      setCargando(false);
      setPasando(false);
    }
  };

  const pasarTurno = async () => {
    if (!turno) return;
    try {
      setPasando(true);
      await axios.put(`http://127.0.0.1:8000/api/turnos/pasar/${turno.ID_TURNO}`);
      setTurno(null);
      setTimeout(() => fetchTurno(empleado), 500);
    } catch (err) {
      console.error("Error al pasar turno:", err);
      setPasando(false);
    }
  };

  const formatHora = (hora) => {
    if (!hora) return "—";
    const date = new Date(hora);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (cargando) return <p>Cargando turno...</p>;
  if (!empleado) return <p>No hay empleado logueado.</p>;

  return (
    <div className="turno-empleado-ind">
      <AnimatePresence>
        {mensajeGerente && (
          <motion.div
            key="mensaje-gerente"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="alert alert-info text-center mb-2"
          >
            {mensajeGerente}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {turno ? (
          <motion.div
            key={turno.ID_TURNO}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
            className="current-turn-card mb-2 p-3 shadow-sm rounded text-center"
          >
            <div className="turn-number-display" style={{ fontSize: '35px' }}>
              #{turno.ID_TURNO}
            </div>
            <div>Cliente: {turno.NOMBRE} {turno.APELLIDOS}</div>
            <div>Hora de atención: {formatHora(turno.ATENCION_EN)}</div>
            {empleado.ESTADO !== undefined && (
              <div>Estado: {empleado.ESTADO === 1 ? "Presente" : "Ausente"}</div>
            )}

          </motion.div>
        ) : (
          <motion.p
            key="no-turno"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-muted text-center"
          >
            No tienes turno en atención.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TurnoEmpleadoInd;
