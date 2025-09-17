// src/pages/admin.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Flag, Zap, ArrowLeft } from "../iconos";
import QueueItem from "../components/QueueItem";
import StatusBadge from "../components/StatusBadge";
import "./pages-styles/admin.css";
import { List, Grid } from "lucide-react";
import WorkerTurnCard from "../components/WorkerTurnCard";

const VistaGerente = () => {
  const navigate = useNavigate();

  const [turnos, setTurnos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [historial, setHistorial] = useState([]);
  const [nombreEmpleado, setNombreEmpleado] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [busqueda, setBusqueda] = useState(""); // 🔍 búsqueda
  const [vistaLista, setVistaLista] = useState(false);

  //  Protegemos la vista y bloqueamos retroceso
  useEffect(() => {
    const empleado = JSON.parse(localStorage.getItem("empleado"));
    if (!empleado) {
      navigate("/login", { replace: true });
    } else {
      setNombreEmpleado(empleado.NOMBRE);
      setFiltro(empleado.CARGO.toLowerCase()); // "reparacion" o "cotizacion"

      //  Bloquear retroceso
      window.history.pushState(null, "", window.location.href);
      window.onpopstate = () => {
        window.history.go(1);
      };
    }
  }, [navigate]);

  // Consultar turnos según el cargo
  useEffect(() => {
    if (!filtro) return;

    setLoading(true);
    setErr("");

    axios
      .get(`http://127.0.0.1:8000/api/turnos/fila?cargo=${filtro}`)
      .then((res) => {
        setTurnos(res.data);
      })
      .catch((e) => setErr(e.message || "Error al obtener turnos"))
      .finally(() => setLoading(false));
  }, [filtro]);

  const finalizarDia = () => {
    setTurnos([]);
    setHistorial([]);
    alert("Día finalizado, se limpiaron los turnos.");
  };

  return (
    <div className="full-width-container">
      {/* Encabezado */}
      <div className="hero-section">
        <div className="container text-center">
          <h2 className="display-4 fw-bold mb-1">
            {nombreEmpleado} - Área de{" "}
            {filtro === "reparacion" ? "Reparación" : "Cotización"}
          </h2>
          <p className="lead opacity-75">
            Área de gestión de turnos para{" "}
            {filtro === "reparacion" ? "reparaciones" : "cotizaciones"}.
          </p>
        </div>
      </div>

      {/* Contenido */}
      <div className="container" style={{ marginTop: "-3rem" }}>
        <div className="row full-width-row g-4">
          {/* Turnos en atención */}
          <div className="col-md-8 mb-4">
            <div className="card shadow">
              <div className="card-body d-flex justify-content-between align-items-center">
                <h4 className="d-flex align-items-center card-title fw-bold text-dark mb-0">
                  <Zap size={20} className="text-danger me-2" /> Turnos en
                  Atención
                </h4>

                {/* Buscador + toggle vista */}
                <div className="d-flex align-items-center gap-2">                  
                  <button
                    className="btn btn-outline-secondary btn-sm py-1 px-2"
                    onClick={() => setVistaLista(!vistaLista)}
                    title={vistaLista ? "Vista mosaico" : "Vista lista"}
                  >
                    {vistaLista ? <Grid size={14} /> : <List size={14} />}
                  </button>
                </div>
              </div>

              {/*Solo estos dos botones, centrados y compactos */}
              <div className="d-flex justify-content-center gap-3 mb-4">
                <button
                  className="btn btn-danger btn-compacto"
                  onClick={() => navigate("/historial")}
                >
                  Historial
                </button>
                <button
                  className="btn btn-danger btn-compacto"
                  onClick={() => navigate("/administrar_empleados")}
                >
                  Administrar
                </button>
              </div>

              {/* Contenedor dinámico */}
              <div
                className={vistaLista ? "turnos-list" : "turnos-grid"}
                style={{ padding: "1rem" }}
              >
                {/* 🔍 Pasamos la búsqueda a WorkerTurnCard */}
                <WorkerTurnCard
                  filtroBusqueda={filtro}
                  mostrarCargo={false}
                  busqueda={busqueda}
                />
              </div>
            </div>
          </div>

          {/* Cola de turnos */}
          <div className="col-lg-4">
            <div className="card shadow-lg full-width-card">
              <div className="card-body p-4">
                <h4 className="d-flex align-items-center card-title fw-bold text-dark mb-4">
                  <Flag size={20} className="text-danger me-2" /> Fila Actual (
                  {filtro})
                </h4>
                <div className="d-flex flex-column gap-3">
                  {loading && <p className="text-muted">Cargando...</p>}
                  {err && <p className="text-danger">{err}</p>}
                  {!loading && !err && turnos.length === 0 && (
                    <p className="text-muted">No hay turnos pendientes</p>
                  )}

                  {/* ✅ Aquí ya NO aplicamos el filtro de búsqueda */}
                  {turnos.map((turn) => (
                    <QueueItem key={turn.turn_number} turn={turn} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Historial
export const HistorialTurnos = () => {
  const navigate = useNavigate();
  const [historial] = useState(
    JSON.parse(localStorage.getItem("historial")) || []
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Historial de Turnos</h2>
      {historial.length > 0 ? (
        historial.map((t) => (
          <div key={t.turn_number} className="card mb-2 p-2">
            #{t.turn_number} - {t.name} ({t.reason}) -{" "}
            <StatusBadge status={t.status} />
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

export default VistaGerente;
