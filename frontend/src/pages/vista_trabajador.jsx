import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Zap } from "../iconos";
import './pages-styles/admin.css';  
import TurnoEmpleadoInd from "../components/TurnoEmpleadoInd";

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

      window.history.pushState(null, "", window.location.href);
      window.onpopstate = () => window.history.go(1);
    }
  }, [navigate]);

  // 👇 función para pasar turno
  const pasarTurno = async () => {
    const empleado = JSON.parse(localStorage.getItem("empleado"));
    if (!empleado) return;

    try {
      await fetch("http://127.0.0.1:8000/api/turnos/pasar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empleado_id: empleado.ID_EMPLEADO,
          cargo: empleado.CARGO.toLowerCase(),
        }),
      });

      window.location.reload(); // refresca vista
    } catch (error) {
      console.error("Error al pasar turno:", error);
    }
  };

  return (
    <div className="full-width-container">
      <div className="hero-section">
        <div className="container text-center mt-5">
          <h2 className="display-4 fw-bold mb-1">
            {nombreEmpleado} - {filtro === "reparacion" ? "Reparación" : "Cotización"}
          </h2>
          <p className="lead opacity-75">
            Tu taller mecánico de confianza en Manzanillo. Sistema de turnos rápido y eficiente.
          </p>
        </div>
      </div>

      <div className="row g-3 justify-content-center">
        <div className="col-md-8 mb-4 text-align-center">
          <div className="card shadow">
            <div className="card-body">
              <h4 className="d-flex align-items-center card-title fw-bold text-dark mb-4">
                <Zap size={20} className="text-danger me-2" /> Turno en Atención
              </h4>
              
              <TurnoEmpleadoInd />

              {/* 👇 Botón de pasar turno */}
              <div className="d-flex justify-content-end mt-3">
                <button className="btn btn-danger" onClick={pasarTurno}>
                  Pasar Turno
                </button>
              </div>

            </div>               
          </div>
        </div>
      </div>
    </div>
  );
};

export default VistaTrabajador;
