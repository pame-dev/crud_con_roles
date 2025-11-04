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

      // Detectar cuando el gerente asigna un turno
      const turnoAnterior = turnoPrevio.current;
      const turnoNuevo = miTurno;
      
      // Caso 1: De no tener turno a tener turno (primer asignación)
      const casoPrimerTurno = !turnoPrevio.current && miTurno;
      
      // Caso 2: Cambio de turno (de un turno a otro diferente)
      const casoCambioTurno = turnoPrevio.current && miTurno && turnoPrevio.current.ID_TURNO !== miTurno.ID_TURNO;

      // Mostrar mensaje solo si cambió el turno y NO fue por acción del trabajador
      if ((casoPrimerTurno || casoCambioTurno) && !pasandoPorTrabajador.current) {
        setMensajeGerente("El gerente te ha asignado un nuevo turno");
      }

      turnoPrevio.current = miTurno;
      setTurno(miTurno);
    } catch (err) {
      console.error("Error al obtener turno:", err);
    } finally {
      setCargando(false);
    }
  };

  const formatHora = (hora) => {
    if (!hora) return "—";
    const date = new Date(hora);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuracion = (duracion) => {
    if (!duracion) return "—";
    
    // Si ya viene en formato HH:MM desde la base de datos
    if (duracion.includes(':')) {
        const [horas, minutos] = duracion.split(':').map(Number);
        if (horas > 0) {
            return `${horas}h ${minutos}m`;
        } else {
            return `${minutos}m`;
        }
    }
    
    return duracion;
  };

  // Pasar turno
  const pasarTurno = async () => {
    if (!empleado) return;
    try {
      // IMPORTANTE: Marcar ANTES de hacer la llamada
      pasandoPorTrabajador.current = true;
      setPasando(true);

      //Guarda el turno anterior para mostrarlo durante la transicion
      const turnoAnterior = turno;
      
      //Llamada a la api
      await apiPasarTurno(empleado.ID_EMPLEADO, empleado.CARGO.toLowerCase());
      
      // Buscar inmediatamente el nuevo turno
      const res = await axios.get(
        `http://127.0.0.1:8000/api/trabajadores/con-turno?cargo=${empleado.CARGO}`
      );
      
      const miNuevoTurno = res.data.find(t => t.ID_EMPLEADO === empleado.ID_EMPLEADO)?.turnos[0] || null;
      
      // Actualizar con el nuevo turno
      setTurno(miNuevoTurno);
      turnoPrevio.current = miNuevoTurno;
    
    } catch (err) {
      console.error("Error al pasar turno:", err);
      
    } finally {
      setPasando(false);
      // Resetear la flag después de un tiempo para futuras detecciones
      setTimeout(() => {
        pasandoPorTrabajador.current = false;
      }, 6000);
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
        </div>
      ) : (
        <p className="text-muted text-center">
          No tienes turno en atención.
        </p> 
      )}

      <div className="text-center">
        <button
          className="btn btn-danger btn-sm mt-2 d-flex align-items-center justify-content-center mx-auto"
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
        
      

    </div>
    
  );
};

export default TurnoEmpleadoInd;