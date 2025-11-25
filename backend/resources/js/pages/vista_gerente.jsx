import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";
import WorkerTurnCard from "../components/WorkerTurnCard";
import FilaTurnos from "../components/FilaTurnos";
import { List, Grid } from "lucide-react";
import "./pages-styles/admin.css";
import ModalAlert from "../components/ModalAlert";

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

  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
    type: "info"
  });

  const closeModal = () => {
    setModal(prev => ({ ...prev, show: false }));
  };

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
      const res = await fetch(`https://crudconroles-production.up.railway.app/api/trabajadores/con-turno?cargo=${cargo}`);
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
      const res = await fetch(`https://crudconroles-production.up.railway.app/api/turnos/fila?cargo=${cargo}`);
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

  const handleRefresh = async () => {
    // Recargar los datos de trabajadores desde la API
    const nuevosDatos = await cargarTrabajadores();
    setTrabajadores(nuevosDatos);
  };

  return (
    <>
      <div className="full-width-container gerente-page">
        {/* HERO */}
        <div className="hero-section darkable">
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
          <div className="filtros-panel mb-4 darkable">
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
              <div className="card shadow turnos-card darkable">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <h4 className="d-flex align-items-center card-title fw-bold text-dark mb-0">
                    <Zap size={20} className="text-danger me-2" /> Turnos en Atención
                  </h4>

                  {/* Toggle vista (lista / mosaico) */}
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
                <div className={vistaLista ? "turnos-grid" : "turnos-list"} style={{ padding: "1rem" }}>
                  <WorkerTurnCard
                    trabajadores={trabajadores} 
                    onRefresh={handleRefresh}
                    filtroBusqueda={busqueda}
                    mostrarCargo={true}
                    modoLista={vistaLista}
                  />
                </div>
              </div>
            </div>

            {/* Cola de turnos */}
            {cargo && <FilaTurnos cargo={cargo} />}
          </div>
        </div>
      </div>
      <ModalAlert
        show={modal.show}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onClose={closeModal}
      />
    </>
  );
};

export default VistaGerente;
