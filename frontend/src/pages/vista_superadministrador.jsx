// src/pages/superadmin.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, ArrowLeft } from "../iconos";
import { List, Grid } from "lucide-react";
import WorkerTurnCard from "../components/WorkerTurnCard"; 
import StatusBadge from "../components/StatusBadge";
import "./pages-styles/superadmin.css";

const VistaSuperadministrador = () => {
  const navigate = useNavigate();

  const [historial, setHistorial] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [nombreEmpleado, setNombreEmpleado] = useState("");
  const [vistaLista, setVistaLista] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const empleado = JSON.parse(localStorage.getItem("empleado"));
    if (empleado) {
      setNombreEmpleado(empleado.NOMBRE);
      setFiltro(empleado.CARGO.toLowerCase());
    } else {
      navigate("/login");
    }
  }, []);

  const finalizarDia = () => {
    alert("Día finalizado, se limpiaron los turnos.");
    setHistorial([]);
  };

  return (
    <div className="full-width-container">
      <div className="hero-section">
        <div className="container text-center">
          <h2 className="display-4 fw-bold mb-1">Administración</h2>
          <h3 className="display-13 fw-bold mb-1">Área general</h3>
        </div>
      </div>

      <div className="container" style={{ marginTop: "-3rem" }}>
        <div className="row full-width-row g-4">
          <div className="col-md-12 mb-4">
            <div className="card shadow">
              <div className="card-body d-flex justify-content-between align-items-center">
                <h4 className="d-flex align-items-center card-title fw-bold text-dark mb-0">
                  <Zap size={20} className="text-danger me-2" /> Turnos en Atención
                </h4>

                {/* Contenedor buscador + botón */}
                <div className="d-flex align-items-center gap-2">
                  <input
                    type="text"
                    placeholder="Buscar empleado..."
                    className="form-control form-control-sm"
                    style={{ maxWidth: "200px" }}
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                  <button
                    className="btn btn-outline-secondary btn-sm py-1 px-2"
                    onClick={() => setVistaLista(!vistaLista)}
                    title={vistaLista ? "Vista mosaico" : "Vista lista"}
                  >
                    {vistaLista ? <Grid size={14} /> : <List size={14} />}
                  </button>
                </div>
              </div>

              {/* Contenedor dinámico */}
              <div
                className={vistaLista ? "turnos-list" : "turnos-grid"}
                style={{ padding: "1rem" }}
              >
                <WorkerTurnCard filtroBusqueda={busqueda} mostrarCargo={true} />

              </div>

              <div className="text-center mt-3 mb-5">
                <button className="btn btn-custom" onClick={finalizarDia}>
                  Finalizar Día
                </button>
                <button className="btn btn-custom" onClick={() => navigate("/historial")}>
                  Historial
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Historial
const HistorialTurnos = () => {
  const navigate = useNavigate();
  const [historial] = useState(JSON.parse(localStorage.getItem("historial")) || []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Historial de Turnos</h2>
      {historial.length > 0 ? (
        historial.map((t, idx) => (
          <div key={idx} className="card mb-2 p-2">
            #{t.turn_number} - {t.name} ({t.reason}) - <StatusBadge status={t.status} />
          </div>
        ))
      ) : (
        <p>No hay historial.</p>
      )}
      <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} className="me-1" /> Regresar
      </button>
    </div>
  );
};

export default VistaSuperadministrador;
