// src/pages/superadmin.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Zap } from "../iconos";
import WorkerTurnCard from "../components/WorkerTurnCard";
import { useDiaFinalizado } from "../hooks/useDiaFinalizado";
import { List, Grid } from "lucide-react";
import "./pages-styles/superadmin.css";
import ModalAlert from "../components/ModalAlert"; 

const VistaSuperadministrador = () => {
  const navigate = useNavigate();

  const [busqueda, setBusqueda] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [diaFinalizado, setDiaFinalizado] = useDiaFinalizado();
  const [vistaLista, setVistaLista] = useState(true);
  const [trabajadores, setTrabajadores] = useState([]);
  
  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
    type: "info"
  });

  const showAlert = (title, message, type = "info") => {
    setModal({ show: true, title, message, type });
  };

  const closeModal = () => {
    setModal(prev => ({ ...prev, show: false }));
  };

  const cargarTrabajadores = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/trabajadores/con-turno`);
      const data = await res.json();
      setTrabajadores(data);
      return data;
    } catch (error) {
      console.error("Error al obtener trabajadores:", error);
      setTrabajadores([]);
      return [];
    }
  };

  useEffect(() => {
    const empleado = JSON.parse(localStorage.getItem("empleado"));
    if (!empleado) {
      navigate("/login", { replace: true });
      return;
    }

    // bloquear atrás
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => window.history.go(1);

    // Primer fetch inmediato
    cargarTrabajadores();

    // Polling cada 5 segundos
    const interval = setInterval(cargarTrabajadores, 5000);
    return () => clearInterval(interval);
  }, [navigate]);

  const toggleDia = () => {
    if (diaFinalizado) {
      setDiaFinalizado(false);
      showAlert("Día iniciado", "Se inició un nuevo día. Ahora se pueden agendar turnos.", "info");
    } else {
      setShowConfirmModal(true);
    }
  };

  const confirmarFinalizar = () => {
    setDiaFinalizado(true);
    setShowConfirmModal(false);
    showAlert("Día finalizado", "El día ha sido finalizado. No se pueden agendar nuevos turnos.", "info");
  };

  const onFinalizarDia = toggleDia;

  const handleRefresh = async () => {
    // Recargar los datos de trabajadores desde la API
    const nuevosDatos = await cargarTrabajadores();
    setTrabajadores(nuevosDatos);
  };

  return (
    <>
    <div className="full-width-container superadmin-page">
      {/* HERO */}
      <div className="hero-section">
        <div className="container text-center mt-3">
          <h2 className="display-4 fw-bold mb-1">Administración</h2>
          <h3 className="display-13 fw-bold mb-1">Área general</h3>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="container main-content">
        {/* Panel de filtros / acciones */}
        <div className="filtros-panel mb-4 darkable">
          <div className="filtros-grid">
            {/* Buscar empleado */}
            <div>
              <label className="filtro-label">Buscar empleado</label>
              <input
                className="form-control filtro-input"
                placeholder="Buscar empleado…"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <button className="filtro-btn" onClick={onFinalizarDia}>
              {diaFinalizado ? "Iniciar día" : "Finalizar día"}
            </button>

            <button className="filtro-btn" onClick={() => navigate("/historial")}>
              Historial
            </button>

            <button className="filtro-btn" onClick={() => navigate("/administrar_empleados")}>
              Administrar
            </button>
          </div>
        </div>

        {/* Card de Turnos */}
        <div className="row g-4">
          <div className="col-12 mb-4">
            <div className="card shadow darkable" style={{ backgroundColor: "rgba(255, 255, 255, 0.88)" }}>
              <div className="card-body d-flex justify-content-between align-items-center">
                <h4 className="d-flex align-items-center card-title fw-bold text-dark mb-0">
                  <Zap size={20} className="text-danger me-2" />
                  Turnos en Atención
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

              {/* Listado dinámico */}
              <div
                className={vistaLista ? "turnos-list" : "turnos-grid"}
                style={{ padding: "1rem" }}
              >
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
        </div>
      </div>

      {/* MODAL Finalizar día */}
      {showConfirmModal && !diaFinalizado && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header flex-column text-center border-0 pb-0 darkable">
                <div className="d-flex align-items-center justify-content-center gap-2">
                  <i className="bi bi-exclamation-triangle-fill text-warning fs-3"></i>
                  <h5 className="modal-title mb-0 fw-bold">Confirmar acción</h5>
                </div>
                <button
                  type="button"
                  className="btn-close position-absolute top-0 end-0 m-3"
                  onClick={() => setShowConfirmModal(false)}
                />
              </div>

              <div className="modal-body text-center darkable">
                <div className="d-flex justify-content-center align-items-center gap-2">
                  <i className="bi bi-question-circle-fill text-primary fs-4"></i>
                  <p className="mb-0 fs-5 fw-medium">¿Seguro que deseas finalizar el día?</p>
                </div>
              </div>

              <div className="modal-footer darkable">
                <button className="btn btn-secondary" onClick={() => setShowConfirmModal(false)}>
                  <i className="bi bi-x-circle me-1"></i>
                  Cancelar
                </button>
                <button className="btn btn-danger" onClick={confirmarFinalizar}>
                  <i className="bi bi-check-circle me-1"></i>
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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

export default VistaSuperadministrador;
