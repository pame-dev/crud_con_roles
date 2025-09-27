import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { pasarTurno as apiPasarTurno } from "../api/turnosApi";

const TurnoEmpleadoInd = () => {
  const [turno, setTurno] = useState(null);
  const [empleado, setEmpleado] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [mensajeGerente, setMensajeGerente] = useState("");
  const [pasando, setPasando] = useState(false);
  const turnoPrevio = useRef(null);
  const pasandoPorTrabajador = useRef(false);
  const esPrimeraCarga = useRef(true);

  // Limpiar mensaje del gerente después de 4s
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
      const timer = setTimeout(() => setMensajeGerente(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [mensajeGerente]);

  const fetchTurno = async (emp) => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/trabajadores/con-turno?cargo=${emp.CARGO}`
      );
      const miTurno = res.data.find(t => t.ID_EMPLEADO === emp.ID_EMPLEADO)?.turnos[0] || null;

      // Evitar mostrar mensaje en la primera carga
      if (esPrimeraCarga.current) {
        esPrimeraCarga.current = false;
        turnoPrevio.current = miTurno;
        setTurno(miTurno);
        return;
      }

      // Mostrar mensaje solo si cambió turno y NO fue por trabajador
      if (
        turnoPrevio.current &&
        miTurno?.ID_TURNO !== turnoPrevio.current?.ID_TURNO &&
        !pasandoPorTrabajador.current
      ) {
        setMensajeGerente("El gerente te ha asignado un nuevo turno");
      }

      turnoPrevio.current = miTurno;
      setTurno(miTurno);
    } catch (err) {
      console.error("Error al obtener turno:", err);
    } finally {
      setCargando(false);
      setPasando(false);
    }
  };

  // Formatear hora
  const formatHora = (hora) => {
    if (!hora) return "—";
    const date = new Date(hora);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Pasar turno
  const pasarTurno = async () => {
    if (!empleado) return;
    try {
      // IMPORTANTE: Marcar ANTES de hacer la llamada
      pasandoPorTrabajador.current = true;
      setPasando(true);
      
      await apiPasarTurno(empleado.ID_EMPLEADO, empleado.CARGO.toLowerCase());
      
      // Forzar un pequeño delay para asegurar que la flag esté activa
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await fetchTurno(empleado);
    } catch (err) {
      console.error("Error al pasar turno:", err);
      // En caso de error, resetear la flag
      pasandoPorTrabajador.current = false;
    } finally {
      setPasando(false);
      // Resetear la flag después de un tiempo para futuras detecciones
      setTimeout(() => {
        pasandoPorTrabajador.current = false;
      }, 2000);
    }
  };

  if (cargando) return <p>Cargando turno...</p>;
  if (!empleado) return <p>No hay empleado logueado.</p>;

  const estaAusente = empleado?.ESTADO === 0;

  return (
    <div className="turno-empleado-ind">
      {mensajeGerente && (
        <div className="alert alert-info text-center mb-2">
          {mensajeGerente}
        </div>
      )}
      
      {turno ? (
        <div className="current-turn-card mb-2 p-3 shadow-sm rounded text-center">
          <div className="turn-number-display" style={{ fontSize: '35px' }}>
            #{turno.ID_TURNO}
          </div>
          <div>Cliente: {turno.NOMBRE} {turno.APELLIDOS}</div>
          <div>Hora de atención: {formatHora(turno.ATENCION_EN)}</div>
          {empleado.ESTADO !== undefined && (
            <div>Estado: {empleado.ESTADO === 1 ? "Presente" : "Ausente"}</div>
          )}

          
          <button
            className="btn btn-danger btn-sm mt-3 d-flex align-items-center justify-content-center"
            onClick={pasarTurno}
            disabled={pasando || estaAusente}
          >
            {pasando ? (
              <>
                <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                Procesando...
              </>
            ) : (
              <>
                <i className="bi bi-arrow-right-circle me-1"></i>
                  {estaAusente ? "Ausente" : "Pasar"}
              </>
            )}
          </button>
        </div>
      ) : (
        <p className="text-muted text-center">
          No tienes turno en atención.
        </p>
      )}
    </div>
  );
};

export default TurnoEmpleadoInd;