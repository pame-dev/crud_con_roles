// src/pages/superadmin.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Zap } from "../iconos";
import WorkerTurnCard from "../components/WorkerTurnCard";
import { useDiaFinalizado } from "../hooks/useDiaFinalizado";
import "./pages-styles/superadmin.css";

const VistaSuperadministrador = () => {
  const navigate = useNavigate();

  const [busqueda, setBusqueda] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [diaFinalizado, setDiaFinalizado] = useDiaFinalizado();

  useEffect(() => {
    const empleado = JSON.parse(localStorage.getItem("empleado"));
    if (!empleado) {
      navigate("/login", { replace: true });
      return;
    }
    // bloquear atrás
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => window.history.go(1);
  }, [navigate]);

  const toggleDia = () => {
    if (diaFinalizado) {
      setDiaFinalizado(false);
      alert("Se inició un nuevo día. Ahora se pueden agendar turnos.");
    } else {
      setShowModal(true);
    }
  };

  const confirmarFinalizar = () => {
    setDiaFinalizado(true);
    setShowModal(false);
    alert("Día finalizado");
  };

  const onFinalizarDia = toggleDia;

  return (
    <div className="full-width-container superadmin-page">
      {/* HERO */}
      <div className="hero-section">
        <div className="container text-center">
          <h2 className="display-4 fw-bold mb-1">Administración</h2>
          <h3 className="display-13 fw-bold mb-1">Área general</h3>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="container main-content">
        {/* Panel de filtros / acciones (estilo Historial) */}
        <div className="filtros-panel mb-4">
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

            {/* Acciones */}
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
            <div className="card shadow" style={{ backgroundColor: "rgba(255, 255, 255, 0.88)" }}>
              <div className="card-body">
                <h4 className="d-flex align-items-center card-title fw-bold text-dark mb-3">
                  <Zap size={20} className="text-danger me-2" />
                  Turnos en Atención
                </h4>

                {/* Listado */}
                <div className="turnos-grid" style={{ padding: "1rem" }}>
                  <WorkerTurnCard
                    filtroBusqueda={busqueda}
                    mostrarCargo={true}
                    modoLista={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> {/* /container main-content */}

      {/* MODAL Finalizar día */}
      {showModal && !diaFinalizado && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar acción</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>
              <div className="modal-body">
                <p>¿Seguro que deseas finalizar el día?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button className="btn btn-danger" onClick={confirmarFinalizar}>
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div> /* /full-width-container */
  );
};

export default VistaSuperadministrador;
