import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Flag, Zap, List, Grid } from "lucide-react";
import WorkerTurnCard from "../components/WorkerTurnCard";
import QueueItem from "../components/QueueItem";
import "./pages-styles/admin.css";

const VistaGerente = () => {
  const navigate = useNavigate();

  const [turnos, setTurnos] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [nombreEmpleado, setNombreEmpleado] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [vistaLista, setVistaLista] = useState(false);
  const [cargo, setCargo] = useState(""); // cargo del gerente
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Protege la vista y bloquea retroceso
  useEffect(() => {
    const empleado = JSON.parse(localStorage.getItem("empleado"));
    if (!empleado) {
      navigate("/login", { replace: true });
      return;
    }

    setNombreEmpleado(empleado.NOMBRE);
    setCargo(empleado.CARGO.toLowerCase());

    const blockBack = () => window.history.go(1);
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", blockBack);
    return () => window.removeEventListener("popstate", blockBack);
  }, [navigate]);

  // Función para traer trabajadores
  const fetchTrabajadores = async () => {
    if (!cargo) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/trabajadores/con-turno?cargo=${cargo}`);
      const data = await res.json();
      setTrabajadores(data);
    } catch (err) {
      console.error(err);
      setTrabajadores([]);
    }
  };

  // Polling rápido (opcional, pero se puede reducir el tiempo a 5s)
  useEffect(() => {
    fetchTrabajadores();
    const interval = setInterval(fetchTrabajadores, 5000);
    return () => clearInterval(interval);
  }, [cargo]);

  // Traer turnos según cargo del gerente
  const fetchTurnos = async () => {
    if (!cargo) return;
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/turnos/fila?cargo=${cargo}`);
      const data = await res.json();
      setTurnos(data);
    } catch (e) {
      setErr(e.message || "Error al obtener turnos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTurnos();
  }, [cargo]);

  const finalizarDia = () => {
    setTurnos([]);
    alert("Día finalizado, se limpiaron los turnos.");
  };

  return (
    <div className="full-width-container gerente-page">
      {/* HERO */}
      <div className="hero-section">
        <div className="container text-center mt-4">
          <h2 className="display-4 fw-bold mb-1">
            {nombreEmpleado} - Área de {cargo === "reparacion" ? "Reparación" : "Cotización"}
          </h2>
          <p className="lead opacity-75">
            Área de gestión de turnos para {cargo === "reparacion" ? "reparaciones" : "cotizaciones"}.
          </p>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="container main-content">
        {/* Panel de filtros */}
        <div className="filtros-panel mb-4">
          <div className="filtros-grid">
            <div>
              <label className="filtro-label">Buscar empleado</label>
              <input
                className="form-control filtro-input"
                placeholder="Buscar empleado…"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <button className="filtro-btn" onClick={() => navigate("/historial")}>
              Historial
            </button>

            <button className="filtro-btn" onClick={() => navigate("/administrar_empleados")}>
              Administrar
            </button>

            
          </div>
        </div>

        <div className="row g-4 full-width-row">
          {/* Turnos en atención */}
          <div className="col-md-8 mb-4">
            <div className="card shadow turnos-card">
              <div className="card-body d-flex justify-content-between align-items-center">
                <h4 className="d-flex align-items-center card-title fw-bold text-dark mb-0">
                  <Zap size={20} className="text-danger me-2" /> Turnos en Atención
                </h4>

                {/* Toggle vista */}
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

              {/* Contenedor dinámico */}
              <div className={vistaLista ? "turnos-list" : "turnos-grid"} style={{ padding: "1rem" }}>
                <WorkerTurnCard
                  trabajadores={trabajadores}
                  filtroBusqueda={busqueda}
                  mostrarCargo={true}
                  modoLista={vistaLista}
                  onRefresh={fetchTrabajadores} // ✅ pasar función de refresh
                />
              </div>
            </div>
          </div>

          {/* Cola de turnos */}
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
    </div>
  );
};

export default VistaGerente;
