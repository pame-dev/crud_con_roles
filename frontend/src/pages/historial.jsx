import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, User, Car, Wrench, CheckCircle, AlertTriangle } from "../iconos";
import { fetchHistorialTurnos } from "./turnosApi.js";
import "./pages-styles/historial.css";

const ESTADO_BADGE = {
  completado: "success",
  cancelado: "danger",
  cotizacion: "secondary",
  en_proceso: "warning",
};

function EstadoBadge({ estado }) {
  const color = ESTADO_BADGE[estado] || "secondary";
  const text = (estado || "desconocido").replaceAll("_", " ");
  return <span className={`badge rounded-pill text-bg-${color}`}>{text}</span>;
}

function TurnoCard({ turno }) {
  // turno.{folio, cliente, servicio, fecha, hora, placa, estado}
  return (
    <div className="col">
      <div className="card h-100 shadow-sm historial-card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h6 className="mb-0 fw-bold">#{turno.folio}</h6>
            <EstadoBadge estado={turno.estado} />
          </div>

          <div className="small text-muted mb-2 d-flex align-items-center gap-2">
            <User size={16} /> <span className="text-dark fw-semibold">{turno.cliente}</span>
          </div>

          <div className="small mb-1 d-flex align-items-center gap-2">
            <Wrench size={16} /> <span>{turno.servicio || "—"}</span>
          </div>

          <div className="small text-muted mb-1 d-flex align-items-center gap-2">
            <Calendar size={16} /> <span>{turno.fecha} {turno.hora ? `· ${turno.hora}` : ""}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlaceholderCard() {
  return (
    <div className="col">
      <div className="card h-100 shadow-sm placeholder-glow historial-card">
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
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [page, setPage] = useState(1);

  const [data, setData] = useState({ data: [], page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Construye clave para cache simple (evita refetch innecesario)
  const key = useMemo(() => JSON.stringify({ q, estado, desde, hasta, page }), [q, estado, desde, hasta, page]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setErr("");

    fetchHistorialTurnos({ q, estado, desde, hasta, page, limit: 12 }, { signal: controller.signal })
      .then((res) => setData(res))
      .catch((e) => setErr(e.message || "Error al cargar historial"))
      .finally(() => setLoading(false));

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return (
    <div className="container py-4 historial-page">
      <h2 className="mb-3 text-center">Historial de turnos</h2>


      {/* Filtros */}
      <div className="card mb-3 shadow-sm">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-12 col-md-4">
              <label className="form-label">Buscar</label>
              <input
                className="form-control"
                placeholder="Folio, cliente…"
                value={q}
                onChange={(e) => { setQ(e.target.value); setPage(1); }}
              />
            </div>
            <div className="col-6 col-md-2">
              <label className="form-label">Estado</label>
              <select className="form-select" value={estado} onChange={(e) => { setEstado(e.target.value); setPage(1); }}>
                <option value="todos">Todos</option>
                <option value="completado">Completado</option>
                <option value="en_proceso">En proceso</option>
                <option value="cotizacion">Cotización</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
            <div className="col-6 col-md-2">
              <label className="form-label">Desde</label>
              <input type="date" className="form-control" value={desde} onChange={(e)=>{ setDesde(e.target.value); setPage(1); }} />
            </div>
            <div className="col-6 col-md-2">
              <label className="form-label">Hasta</label>
              <input type="date" className="form-control" value={hasta} onChange={(e)=>{ setHasta(e.target.value); setPage(1); }} />
            </div>
            <div className="col-6 col-md-2 d-grid">
              <button className="btn btn-outline-secondary" onClick={() => { setQ(""); setEstado("todos"); setDesde(""); setHasta(""); setPage(1); }}>
                Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista */}
      {err && (
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <AlertTriangle size={18} className="me-2" />
          {err}
        </div>
      )}

      {!err && (
        <>
          {loading ? (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
              {Array.from({ length: 6 }).map((_, i) => <PlaceholderCard key={i} />)}
            </div>
          ) : data?.data?.length ? (
            <>
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
                {data.data.map((t) => <TurnoCard key={t.id || `${t.folio}-${t.fecha}-${t.cliente}`} turno={t} />)}
              </div>

              {/* Paginación */}
              <div className="historial-pagination">
                <small>
                  Página {data.page} de {data.totalPages} · {data.total} resultados
                </small>
                <div className="btn-group">
                  <button
                    className="btn btn-outline-secondary"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Anterior
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    disabled={page >= data.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Siguiente
                  </button>
                </div>
              </div>

            </>
          ) : (
            <div className="card shadow-sm">
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
