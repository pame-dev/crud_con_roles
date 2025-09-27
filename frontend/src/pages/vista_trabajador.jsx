import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { Flag, Zap } from "../iconos";
import './pages-styles/admin.css';  
import TurnoEmpleadoInd from "../components/TurnoEmpleadoInd";
import QueueItem from "../components/QueueItem";


// Vista Administrador
const VistaTrabajador = () => {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState("");
  const [nombreEmpleado, setNombreEmpleado] = useState("");
  const [turnos, setTurnos] = useState([]);
  const [cargo, setCargo] = useState("");
  const [fila, setFila] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

    // Traer turnos según cargo del trabajador
    useEffect(() => {
      if (!cargo) return;
    
      setLoading(true);
      setErr("");
    
      fetch(`http://127.0.0.1:8000/api/turnos/fila?cargo=${cargo}`)
        .then(res => res.json())
        .then(data => setTurnos(data))
        .catch(e => setErr(e.message || "Error al obtener turnos"))
        .finally(() => setLoading(false));
    }, [cargo]);


    // Obtener empleado y bloquear botón atrás
    useEffect(() => {
      const empleado = JSON.parse(localStorage.getItem("empleado"));
      if (!empleado) {
        navigate("/login", { replace: true });
      } else {
        setNombreEmpleado(empleado.NOMBRE);
        setFiltro(empleado.CARGO.toLowerCase());
        setCargo(empleado.CARGO.toLowerCase());
      
        // Bloquear retroceso
        window.history.pushState(null, "", window.location.href);
        window.onpopstate = () => {
          window.history.go(1);
        };
      }
    }, [navigate]);

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

        <div className="row g-3 justify-content-center px-4 mb-4"> {/* Fila principal */}
          {/* Turno en Atención */}
          <div className="col-md-8 mb-4 text-align-center"> 
            <div className="card shadow">
              <div className="card-body">
                <h4 className="d-flex align-items-center card-title fw-bold text-dark mb-4">
                  <Zap size={20} className="text-danger me-2" /> Turno en Atención
                </h4>
                
                <TurnoEmpleadoInd/>
                
              </div>               
            </div>
          </div>
          {/* Fila Actual */}
          <div className="col-lg-4">
            <div className="card shadow-lg full-width-card" style={{ backgroundColor: "rgba(255, 255, 255, 0.88)" }}>
              <div className="card-body p-4">
                <h4 className="d-flex align-items-center card-title fw-bold text-dark mb-4">
                  <Flag size={20} className="text-danger me-2" /> Fila Actual ({cargo})
                </h4>
                <div className="d-flex flex-column gap-3">
                  {loading && <p className="text-muted">Cargando...</p>}
                  {err && <p className="text-danger">{err}</p>}
                  {!loading && !err && turnos.length === 0 && <p className="text-muted">No hay turnos pendientes</p>}

                  {turnos.map((turn) => (
                    <QueueItem key={turn.turn_number} turn={turn} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default VistaTrabajador;

