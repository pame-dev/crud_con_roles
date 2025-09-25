import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wrench, Flag, Zap, Clock, ArrowLeft } from "../iconos";
import './pages-styles/admin.css';  
import axios from 'axios';
import { useEffect } from "react";
import TurnoEmpleadoInd from "../components/TurnoEmpleadoInd";


// Vista Administrador
const VistaTrabajador = () => {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState("");
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
                
                <TurnoEmpleadoInd/>
                
              </div>               
            </div>
          </div>
        </div>
      </div>
    );
};

export default VistaTrabajador;

