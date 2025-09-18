import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, User, Wrench, CheckCircle, AlertTriangle } from "../iconos";
import { fetchHistorialTurnos } from "../api/turnosApi.js";
import "react-datepicker/dist/react-datepicker.css";
import "./pages-styles/historial.css";

const ESTADO_BADGE = {
  pendiente: "warning",
  en_atencion: "primary",
  completado: "success",
};

function EstadoBadge({ estado }) {
  const color = ESTADO_BADGE[estado] || "secondary";
  const text = (estado || "desconocido").replaceAll("_", " ");
  return (
    <span
      className={`badge rounded-pill text-bg-${color} fw-semibold`}
      style={{ fontSize: "0.8rem", padding: "0.35em 0.6em" }}
    >
      {text}
    </span>
  );
}

function TurnoCard({ turno }) {
  return (
    <div className="col">
      <div
        className="card shadow-sm historial-card position-relative"
        style={{ borderRadius: "15px", transition: "transform 0.2s", cursor: "pointer" }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
      >
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <h6 className="mb-0 fw-bold text-danger">#{turno.folio}</h6>
            <EstadoBadge estado={turno.estado} />
          </div>

          <div className="d-flex align-items-center mb-2 gap-2">
            <User size={16} className="text-dark" />
            <span className="fw-semibold">{turno.cliente}</span>
          </div>

          <div className="d-flex align-items-center mb-2 gap-2">
            <Wrench size={16} className="text-muted" />
            <span>{turno.servicio || "—"}</span>
          </div>

          <div className="d-flex align-items-center gap-2 text-muted">
            <Calendar size={16} />
            <span>{turno.fecha} {turno.hora ? `· ${turno.hora}` : ""}</span>
          </div>
        </div>

        {/* Tooltip para turnos completados */}
        {turno.estado?.toLowerCase() === "completado" && turno.NOMBRE_EMPLEADO && (
          <div className="tooltip-empleado">
            <strong>Atendido por:</strong> {turno.NOMBRE_EMPLEADO} <br />
            <strong>ID:</strong> {turno.ID_EMPLEADO} <br />
            <strong>Correo:</strong> {turno.CORREO_EMPLEADO || "—"}
          </div>
        )}
      </div>
    </div>
  );
}

function PlaceholderCard() {
  return (
    <div className="col">
      <div className="card shadow-sm placeholder-glow" style={{ borderRadius: "15px" }}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <span className="placeholder col-3"></span>
            <span className="placeholder col-2 rounded-pill"></span>
          </div>
          <p className="placeholder col-6 mb-2"></p>
          <p className="placeholder col-8 mb-2"></p>
          <p className="placeholder col-5 mb-0"></p>
        </div>
      </div>
    </div>
  );
}

const Historial = () => {
  const navigate = useNavigate();

  const [q, setQ] = useState("");
  const [estado, setEstado] = useState("todos");
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ data: [], page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const key = useMemo(() => JSON.stringify({ q, estado, page }), [q, estado, page]);

  const empleado = JSON.parse(localStorage.getItem("empleado") || "null");
  const fallback = (empleado?.ROL || "").toLowerCase() === "superadmin"
    ? "/vista_superadministrador"
    : "/vista_gerente";

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate(fallback, { replace: true });
  };

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setErr("");

    fetchHistorialTurnos({ q, estado, page, limit: 6 }, { signal: controller.signal })
      .then((res) => setData(res))
      .catch((e) => {
        if (e.name !== "AbortError") setErr(e.message || "Error al cargar historial");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [key]);

  const resetFilters = () => {
    setQ("");
    setEstado("todos");
    setPage(1);
  };

  const turnosFiltrados = useMemo(() => {
    if (!data?.data) return [];

    return data.data.filter((t) => {
      if (empleado?.ID_ROL === 1 && empleado?.CARGO) {
        const cargo = empleado.CARGO.toLowerCase().trim();
        if (cargo === "reparacion" && t.folio.startsWith("C")) return false;
        if (cargo === "cotizacion" && t.folio.startsWith("R")) return false;
      }

      if (estado !== "todos" && t.estado.toLowerCase() !== estado.toLowerCase()) return false;

      if (q && !t.folio.toString().includes(q) && !t.cliente.toLowerCase().includes(q.toLowerCase())) return false;

      return true;
    });
  }, [data, empleado, estado, q]);

  const totalPages = Math.ceil(turnosFiltrados.length / 6);
  const turnosPaginados = turnosFiltrados.slice((page - 1) * 6, page * 6);

  return (
    <div className="container py-5" style={{ marginTop: "4rem", paddingBottom: "3rem" }}>
      <div className="header-with-back">
        <button className="btn btn-danger back-btn" onClick={goBack} title="Regresar" aria-label="Regresar">
          <ArrowLeft size={18} />
        </button>
        <h2 className="titulo-seccion">Historial de turnos</h2>
        <div className="back-btn-spacer" />
      </div>

      <div className="card shadow mb-4" style={{ borderRadius: "12px", backgroundColor: "rgba(255,255,255,0.85)" }}>
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold text-dark">Buscar</label>
              <input
                className="form-control"
                placeholder="Folio, cliente…"
                value={q}
                onChange={(e) => { setQ(e.target.value); setPage(1); }}
                style={{ borderRadius: "10px" }}
              />
            </div>
            <div className="col-6 col-md-2">
              <label className="form-label fw-semibold text-dark">Estado</label>
              <select
                className="form-select"
                value={estado}
                onChange={(e) => { setEstado(e.target.value); setPage(1); }}
                style={{ borderRadius: "10px" }}
              >
                <option value="todos">Todos</option>
                <option value="pendiente">Pendiente</option>
                <option value="en_atencion">En atención</option>
                <option value="completado">Completado</option>
              </select>
            </div>
            <div className="col-6 col-md-2 d-grid">
              <button className="btn btn-danger fw-bold" onClick={resetFilters} style={{ borderRadius: "10px" }}>
                Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>

      {err && (
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <AlertTriangle size={18} className="me-2" />
          {err}
        </div>
      )}

      {!err && (
        <>
          {loading ? (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {Array.from({ length: 6 }).map((_, i) => <PlaceholderCard key={i} />)}
            </div>
          ) : turnosPaginados.length ? (
            <>
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {turnosPaginados.map((t) => (
                  <TurnoCard key={t.id || `${t.folio}-${t.fecha}-${t.cliente}`} turno={t} />
                ))}
              </div>

              <div className="d-flex justify-content-between align-items-center mt-4">
                <small style={{ color: "#fff" }}>
                  Página {page} de {totalPages} · {turnosFiltrados.length} resultados
                </small>
                <div className="btn-group">
                  <button className="btn btn-outline-light fw-bold" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                    Anterior
                  </button>
                  <button className="btn btn-outline-light fw-bold" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                    Siguiente
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="card shadow-sm mt-4" style={{ borderRadius: "12px" }}>
              <div className="card-body text-center py-5">
                <CheckCircle size={32} className="text-muted mb-2" />
                <h5 className="mb-1">Sin turnos coincidentes</h5>
                <p className="text-muted mb-0">Intenta cambiar los filtros o el texto de búsqueda.</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Historial;
