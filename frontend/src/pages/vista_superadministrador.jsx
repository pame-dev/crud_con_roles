// src/pages/superadmin.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, ArrowLeft } from "../iconos";
import { List, Grid } from "lucide-react";
import WorkerTurnCard from "../components/WorkerTurnCard"; 
import StatusBadge from "../components/StatusBadge";
import { useDiaFinalizado } from "../hooks/useDiaFinalizado";
import "./pages-styles/superadmin.css";

const VistaSuperadministrador = () => {
  const navigate = useNavigate();

  const [historial, setHistorial] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [nombreEmpleado, setNombreEmpleado] = useState("");
  const [vistaLista, setVistaLista] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [diaFinalizado, setDiaFinalizado] = useDiaFinalizado();

  useEffect(() => {
    const empleado = JSON.parse(localStorage.getItem("empleado"));
    if (!empleado) {
      navigate("/login", { replace: true });
    } else {
      setNombreEmpleado(empleado.NOMBRE);
      setFiltro(empleado.CARGO.toLowerCase());
      //  Esto borra todo el historial anterior
      window.history.pushState(null, "", window.location.href);
      window.onpopstate = () => {
        window.history.go(1); // Evita retroceder
      };
    }
  }, [navigate]);


  const toggleDia = () => {
    if (diaFinalizado) {
      // Iniciar nuevo día usando el mismo botón
      setDiaFinalizado(false);
      alert("Se inició un nuevo día. Ahora se pueden agendar turnos.");
    } else {
      // Finalizar día
      setShowModal(true);
    }
  };

  //función para finalizar el día
  const confirmarFinalizar = () => {
    setDiaFinalizado(true);
    //setHistorial([]);
    setShowModal(false);
    alert("Día finalizado");
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

              {/* Botones centrados */}
              <div className="acciones-centradas mx-auto mb-5">
                <button
                  className={`btn ${diaFinalizado ? "btn-success" : "btn-danger"} btn-compacto`}
                  onClick={toggleDia}
                >
                  {diaFinalizado ? "Iniciar Nuevo Día" : "Finalizar día"}
                </button>

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
                <WorkerTurnCard 
                  filtroBusqueda={busqueda}
                  mostrarCargo={true}
                  modoLista={true}   // 👈 esta prop
                />

              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showModal && !diaFinalizado && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar acción</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <div className="modal-body">
                <p>¿Seguro que deseas finalizar el día? </p>
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
    </div>
  );
};


export default VistaSuperadministrador;
