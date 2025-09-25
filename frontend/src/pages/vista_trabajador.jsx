import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wrench, Flag, Zap, Clock, ArrowLeft } from "../iconos";
import CurrentTurnCard from '../components/CurrentTurnCard';
import './pages-styles/admin.css';  
import axios from 'axios';
import { useEffect } from "react";


// Vista Administrador
const VistaTrabajador = () => {
  const navigate = useNavigate();

    const [turnos, setTurnos] = useState([]);
    const [turnoActual, setTurnoActual] = useState(null);
    const [filtro, setFiltro] = useState("");
    const [historial, setHistorial] = useState([]);
    const [nombreEmpleado, setNombreEmpleado] = useState("");

    // Obtener empleado y bloquear botón atrás
    useEffect(() => {
      const empleado = JSON.parse(localStorage.getItem("empleado"));
      if (!empleado) {
        navigate("/login", { replace: true });
      } else {
        setNombreEmpleado(empleado.NOMBRE);
        setFiltro(empleado.CARGO.toLowerCase());
      
        // Bloquear retroceso
        window.history.pushState(null, "", window.location.href);
        window.onpopstate = () => {
          window.history.go(1);
        };
      }
    }, [navigate]);

    useEffect(() => {
      if (!filtro) return; // Evitar consulta si no hay filtro todavía

      axios
        .get(`http://127.0.0.1:8000/api/empleados/cargo/${filtro}`)
        .then((res) => {
          const turnosAPI = res.data.map((emp) => ({
            id: emp.ID_EMPLEADO,
            name: emp.NOMBRE,
            reason: emp.CARGO.toLowerCase(),
            status: "waiting",
            priority: "baja",
            turn_number: emp.ID_EMPLEADO, // Ejemplo, deberías poner el número real
          }));
          setTurnos(turnosAPI);
        })
        .catch((err) => console.error("Error al obtener turnos:", err));
    }, [filtro]);



    const siguienteTurno = () => {
    const siguiente = turnos.find(
      (t) => t.status === "waiting" && t.reason === filtro && t.priority === "baja"
    );
    if (siguiente) {
      setTurnos(
        turnos.map((t) =>
          t.turn_number === siguiente.turn_number ? { ...t, status: "in_progress" } : t
        )
      );
      if (turnoActual) {
        setHistorial([...historial, { ...turnoActual, status: "completed" }]);
      }
      setTurnoActual(siguiente);
    } else {
      alert("No hay más turnos pendientes de baja prioridad en " + filtro);
    }
  };

    return (
      <div className="full-width-container"> {/* Contenedor de ancho completo */}

        <div className="hero-section">  {/* Sección Encabezado, Header */}
          <div className="container text-center mt-5">
            <h2 className="display-4 fw-bold mb-1">{nombreEmpleado} - {filtro === "reparacion" ? "Reparación" : "Cotización"}</h2>
            <p className="lead opacity-75">
              Tu taller mecánico de confianza en Manzanillo. Sistema de turnos rápido y eficiente.
            </p>
          </div>
        </div>

        <div className="row g-3 justify-content-center"> {/* Fila principal */}
          <div className="col-md-8 mb-4 text-align-center"> {/* Turno en Atención */}
            <div className="card shadow">
              <div className="card-body">
                <h4 className="d-flex align-items-center card-title fw-bold text-dark mb-4">
                  <Zap size={20} className="text-danger me-2" /> Turno en Atención
                </h4>

                {turnoActual ? (
                  <CurrentTurnCard turno={turnoActual} siguienteTurno={siguienteTurno} />
                ) : (
                  <p>No hay turno en atención.</p>
                )}
              </div>               
            </div>
          </div>
        </div>
      </div>
    );
  };

export default VistaTrabajador;

