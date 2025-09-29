// src/pages/administrar_empleados.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Edit, Trash2, ArrowLeft } from "../iconos";
import { getCurrentUserRole } from "../hooks/auth";
import "./pages-styles/administrar_empleados.css";
import { motion, AnimatePresence } from "framer-motion";
import { useEmpleados } from "../layouts/EmpleadoContext";

export default function AdministrarEmpleados() {
  const navigate = useNavigate();

  // =========================
  // Estados principales
  // =========================
  const [empleados, setEmpleados] = useState([]);
  const [openTrash, setOpenTrash] = useState(false);

  const [trashData, setTrashData] = useState({
    items: [],
    page: 1,
    totalPages: 1,
    total: 0,
  });

  // Persistencia papelera
  const TRASH_LS_KEY = "pitline_papelera_v1";
  const TRASH_RETENTION_DAYS = 30;
  const [trashHydrated, setTrashHydrated] = useState(false); // 👈 clave

  // Tabs/paginación del drawer
  const [trashTab, setTrashTab] = useState("empleados"); // 'empleados' | 'gerentes'
  const [trashPage, setTrashPage] = useState(1);
  const PAGE_SIZE = 5;

  // Contexto de empleados
  const { marcarAusente, quitarAusente, cargarAusentes } = useEmpleados();

  // =========================
  // Guardas / sesión
  // =========================
  useEffect(() => {
    const storedEmpleado = JSON.parse(localStorage.getItem("empleado"));
    if (!storedEmpleado) {
      navigate("/login", { replace: true });
      return;
    }
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate]);

  const role = getCurrentUserRole(); // "superadmin" | "gerente"
  const isSuper = role === "superadmin";
  const storedEmpleado = JSON.parse(localStorage.getItem("empleado") || "null");

  const registerPath = isSuper
    ? "/register_gerentes_y_trabajadores"
    : "/register_trabajadores";

  const goBack = () => {
    const stored = JSON.parse(localStorage.getItem("empleado") || "null");
    if (!stored) return navigate("/login", { replace: true });
    const fallback = stored.ID_ROL === 0 ? "/vista_superadministrador" : "/vista_gerente";
    navigate(fallback, { replace: true });
  };

  // =========================
  // Hidratar papelera desde localStorage (y purgar antiguos)
  // =========================
  useEffect(() => {
    try {
      const raw = localStorage.getItem(TRASH_LS_KEY);
      if (!raw) {
        setTrashHydrated(true);
        return;
      }
      const parsed = JSON.parse(raw);
      const now = Date.now();
      const keep = Array.isArray(parsed?.items)
        ? parsed.items.filter((it) => {
            if (!it?.FECHA_ELIMINADO) return true;
            const ageDays = (now - new Date(it.FECHA_ELIMINADO).getTime()) / 86400000;
            return ageDays <= TRASH_RETENTION_DAYS;
          })
        : [];

      setTrashData((s) => ({
        ...s,
        items: keep,
        total: keep.length,
        page: 1,
      }));
    } catch (e) {
      console.error("Error leyendo papelera local:", e);
    } finally {
      // MUY IMPORTANTE: marcar hidratado para no pisar el storage con []
      setTrashHydrated(true);
    }
  }, []);

  // Guardar en localStorage cuando cambie, SOLO tras hidratar
  useEffect(() => {
    if (!trashHydrated) return;
    try {
      localStorage.setItem(TRASH_LS_KEY, JSON.stringify({ items: trashData.items }));
    } catch (e) {
      console.error("Error guardando papelera local:", e);
    }
  }, [trashData.items, trashHydrated]);

  // =========================
  // Cargar empleados y ausentes
  // =========================
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/empleados")
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar empleados");
        return res.json();
      })
      .then((data) => {
        const empleadosNormalizados = data.map((e) => ({
          id: e.ID_EMPLEADO,
          ID_EMPLEADO: e.ID_EMPLEADO,
          nombre: e.NOMBRE,
          cargo: (e.CARGO || "").toLowerCase(),
          tipo: e.ID_ROL === 0 ? "Administrador" : e.ID_ROL === 1 ? "Gerente" : "Empleado",
          ID_ROL: e.ID_ROL,
          estado: typeof e.ESTADO !== "undefined" ? Number(e.ESTADO) : 1,
        }));
        setEmpleados(empleadosNormalizados);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    cargarAusentes();
  }, [cargarAusentes]);

  // Bloquear scroll y cerrar con ESC cuando el drawer está abierto
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpenTrash(false);
    if (openTrash) {
      document.body.style.overflowY = "hidden";
      window.addEventListener("keydown", onKey);
    }
    return () => {
      document.body.style.overflowY = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [openTrash]);

  // =========================
  // Helpers
  // =========================
  const capital = (s = "") => s.charAt(0).toUpperCase() + s.slice(1);
  const editar = (id) => navigate(`/editar_empleado/${id}`);

  const eliminar = (emp) => {
    if (!window.confirm("¿Seguro que quieres eliminar este empleado?")) return;

    fetch(`http://127.0.0.1:8000/api/empleados/${emp.id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Error al eliminar");
        // quitar de activos
        setEmpleados((prev) => prev.filter((e) => e.id !== emp.id));
        // push a papelera (evitar duplicados)
        setTrashData((s) => {
          const exists = s.items.some((i) => i.ID_EMPLEADO === emp.id);
          const entry = {
            ID_EMPLEADO: emp.id,
            NOMBRE: emp.nombre,
            CARGO: emp.cargo,    // "cotizacion" | "reparacion"
            ID_ROL: emp.ID_ROL,  // 1=Gerente, 2=Empleado
            FECHA_ELIMINADO: new Date().toISOString(),
          };
          const items = exists ? s.items : [entry, ...s.items];
          return { ...s, items, total: items.length };
        });

        // UX: abrir papelera en la pestaña correcta y a la página 1
        setOpenTrash(true);
        setTrashTab(emp.ID_ROL === 1 ? "gerentes" : "empleados");
        setTrashPage(1);
      })
      .catch(console.error);
  };

  // Recuperar (intenta backend / fallback local)
  const recuperar = async (id) => {
  const item = trashData.items.find((i) => i.ID_EMPLEADO === id);

  try {
    // Llamada al backend para recuperar el empleado (restaurar)
    const res = await fetch(`http://127.0.0.1:8000/api/empleados/${id}/recuperar`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      // Aquí no es necesario enviar el estado si se está trabajando con el campo ACTIVO
    });

    if (!res.ok) throw new Error("No se pudo restaurar el empleado");

    // Si todo va bien, recargamos los empleados
    const r2 = await fetch("http://127.0.0.1:8000/api/empleados");
    if (!r2.ok) throw new Error("No se pudo recargar empleados");

    const data = await r2.json();
    const normalizados = data.map((e) => ({
      id: e.ID_EMPLEADO,
      ID_EMPLEADO: e.ID_EMPLEADO,
      nombre: e.NOMBRE,
      cargo: (e.CARGO || "").toLowerCase(),
      tipo: e.ID_ROL === 0 ? "Administrador" : e.ID_ROL === 1 ? "Gerente" : "Empleado",
      ID_ROL: e.ID_ROL,
      estado: typeof e.ESTADO !== "undefined" ? Number(e.ESTADO) : 1,  // Si es necesario, se puede actualizar aquí
    }));
    setEmpleados(normalizados);

    // Eliminamos el empleado de la papelera local
    setTrashData((s) => ({
      ...s,
      items: s.items.filter((i) => i.ID_EMPLEADO !== id),
      total: Math.max(0, s.total - 1),
    }));
  } catch (err) {
    console.warn("Error al restaurar el empleado:", err);

    if (item) {
      // Fallback local en caso de que el backend falle
      setEmpleados((prev) => [
        {
          id: item.ID_EMPLEADO,
          ID_EMPLEADO: item.ID_EMPLEADO,
          nombre: item.NOMBRE,
          cargo: (item.CARGO || "").toLowerCase(),
          tipo: item.ID_ROL === 1 ? "Gerente" : "Empleado",
          ID_ROL: item.ID_ROL,
          estado: 1,  // Restauramos al estado activo
        },
        ...prev,
      ]);

      setTrashData((s) => ({
        ...s,
        items: s.items.filter((i) => i.ID_EMPLEADO !== id),
        total: Math.max(0, s.total - 1),
      }));
    } else {
      console.error("No se encontró el item en papelera para restaurar localmente");
    }
  }
};


  // Toggle ausente/presente
  const toggleAusente = (emp) => {
    setEmpleados((prev) =>
      prev.map((e) => (e.id === emp.id ? { ...e, estado: e.estado === 0 ? 1 : 0 } : e))
    );
    if (emp.estado === 0) quitarAusente(emp.id).catch(console.error);
    else marcarAusente(emp.id).catch(console.error);
  };

  // =========================
  // Visibilidad y grupos
  // =========================
  let visibles = [];
  if (isSuper) {
    visibles = empleados.filter((e) => e.tipo !== "Administrador");
  } else if (role === "gerente") {
    visibles = empleados.filter(
      (e) => e.ID_ROL === 2 && e.cargo === (storedEmpleado?.CARGO || "").toLowerCase()
    );
  }

  const gerentes = isSuper ? visibles.filter((e) => e.tipo === "Gerente") : [];
  const cotizacion = visibles.filter((e) => e.tipo !== "Gerente" && e.cargo === "cotizacion");
  const reparacion = visibles.filter((e) => e.tipo !== "Gerente" && e.cargo === "reparacion");

  const gerenteCargo = storedEmpleado?.CARGO?.toLowerCase();
  const isGerente = role === "gerente";
  const gerenteArea = (storedEmpleado?.CARGO || "").toLowerCase();

  // =========================
  // Filtro + paginación de papelera
  // =========================
  const filteredTrash = trashData.items.filter((it) => {
    if (isSuper) {
      return trashTab === "empleados" ? it.ID_ROL === 2 : it.ID_ROL === 1;
    }
    return it.ID_ROL === 2 && (it.CARGO || "").toLowerCase() === gerenteArea;
  });

  const totalPagesTrash = Math.max(1, Math.ceil(filteredTrash.length / PAGE_SIZE));
  const safePage = Math.min(trashPage, totalPagesTrash);
  const start = (safePage - 1) * PAGE_SIZE;
  const pagedTrash = filteredTrash.slice(start, start + PAGE_SIZE);

  useEffect(() => {
    setTrashPage((p) => Math.min(p, totalPagesTrash));
  }, [filteredTrash.length, totalPagesTrash]);

  const changeTrashTab = (tab) => {
    if (trashTab === tab) return;
    setTrashTab(tab);
    setTrashPage(1);
  };
  const prevTrashPage = () => setTrashPage((p) => Math.max(1, p - 1));
  const nextTrashPage = () => setTrashPage((p) => Math.min(totalPagesTrash, p + 1));

  // =========================
  // Render
  // =========================
  return (
    <AnimatePresence>
      {/* Drawer Papelera */}
      <AnimatePresence>
        {openTrash && (
          <>
            {/* Overlay */}
            <motion.div
              className="trash-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenTrash(false)}
            />
            {/* Panel */}
            <motion.aside
              className="trash-drawer"
              initial={{ x: "110%" }}
              animate={{ x: 0 }}
              exit={{ x: "110%" }}
              transition={{ type: "tween", duration: 0.25 }}
              role="dialog"
              aria-modal="true"
            >
              <header className="trash-header">
                <h3 className="trash-title">Papelera</h3>
                <p className="trash-subtitle">
                  {isSuper ? "Empleados y gerentes eliminados" : "Empleados eliminados de tu área"}
                </p>
                <button className="trash-close" onClick={() => setOpenTrash(false)} aria-label="Cerrar">
                  ✕
                </button>

                {isSuper && (
                  <div className="trash-tabs">
                    <button
                      className={`trash-tab ${trashTab === "empleados" ? "active" : ""}`}
                      onClick={() => changeTrashTab("empleados")}
                    >
                      Empleados
                    </button>
                    <button
                      className={`trash-tab ${trashTab === "gerentes" ? "active" : ""}`}
                      onClick={() => changeTrashTab("gerentes")}
                    >
                      Gerentes
                    </button>
                  </div>
                )}
              </header>

              <div className="trash-list">
                {pagedTrash.length === 0 ? (
                  <p className="trash-empty">No hay elementos eliminados.</p>
                ) : (
                  pagedTrash.map((it) => (
                    <article key={it.ID_EMPLEADO} className="trash-item">
                      <div className="trash-avatar">{(it.NOMBRE || "?").charAt(0)}</div>
                      <div className="trash-info">
                        <div className="trash-name">{it.NOMBRE}</div>
                        <div className="trash-meta">
                          <span className={`chip ${it.ID_ROL === 1 ? "chip--gerente" : "chip--empleado"}`}>
                            {it.ID_ROL === 1 ? "Gerente" : "Empleado"}
                          </span>
                          {it.CARGO && <span className="chip chip--cargo">{it.CARGO}</span>}
                          {it.FECHA_ELIMINADO && (
                            <span className="chip chip--fecha">
                              {new Date(it.FECHA_ELIMINADO).toLocaleDateString("es-MX", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        className="trash-restore"
                        onClick={() => recuperar(it.ID_EMPLEADO)}
                        title="Recuperar"
                      >
                        ↺
                      </button>
                    </article>
                  ))
                )}
              </div>

              <footer className="trash-footer">
                <div className="trash-page-info">
                  Página {safePage} de {totalPagesTrash} • {filteredTrash.length} resultados
                </div>
                <div className="trash-pager">
                  <button className="pager-btn" onClick={prevTrashPage} disabled={safePage <= 1}>
                    ←
                  </button>
                  <button
                    className="pager-btn"
                    onClick={nextTrashPage}
                    disabled={safePage >= totalPagesTrash}
                  >
                    →
                  </button>
                </div>
              </footer>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Página principal */}
      <motion.div
        className="full-width-container administrar-page"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5 }}
      >
        {/* HERO */}
        <div className="hero-section">
          <div className="hero-seccion">
            <div className="hero-row">
              <button className="btn_volver hero-back" onClick={goBack} title="Regresar">
                <ArrowLeft size={22} />
              </button>
              <div className="hero-copy text-center">
                <h3 className="display-3 fw-bold mb-1">Administración de Empleados</h3>
                <p className="lead opacity-75">Gestiona gerentes y trabajadores de manera rápida y sencilla.</p>
              </div>
              <div aria-hidden="true" className="hero-right-spacer" />
            </div>
          </div>
        </div>

        {/* CONTENIDO */}
        <div className="container" style={{ marginTop: "0", paddingBottom: "1rem" }}>
          <div className="header d-flex align-items-center mb-4">
            {!isSuper && storedEmpleado?.CARGO && (
              <p className="text-muted ms-3 mb-0">(Gerente de {capital(storedEmpleado.CARGO)})</p>
            )}
          </div>

          {/* Panel: para el superadmin */}
          {isSuper ? (
            <div className="grilla-grupos">
              {/* Gerentes */}
              <section className="grupo-col">
                <h3 className="grupo-title">Gerentes</h3>
                <div className="grupo-cards">
                  {gerentes.length === 0 && <p className="grupo-empty">Cargando...</p>}
                  {gerentes.map((emp) => (
                    <article className="card empleado-card" key={emp.id}>
                      <div className="card-body d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-bold">{emp.nombre}</div>
                          <div className="text-muted small">{capital(emp.cargo)}</div>
                        </div>
                        <div className="d-flex gap-2">
                          <button className="btn btn-light btn-sm" onClick={() => editar(emp.id)}>
                            <Edit size={18} />
                          </button>
                          <button className="btn btn-light btn-sm" onClick={() => eliminar(emp)}>
                            <Trash2 size={18} />
                          </button>
                          <button
                            className={`btn btn-sm ${emp.estado === 1 ? "btn-warning" : "btn-success"}`}
                            onClick={() => toggleAusente(emp)}
                          >
                            {emp.estado === 1 ? "Ausente" : "Presente"}
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              {/* Trabajadores */}
              <section className="grupo-col trabajadores-col">
                <h3 className="grupo-title">{isSuper ? "Trabajadores" : `Área de ${capital(gerenteCargo)}`}</h3>
                <div className="subgrilla">
                  <div className="subcol">
                    <h4 className="sub-title">Cotización</h4>
                    <div className="grupo-cards">
                      {cotizacion.length === 0 && <p className="grupo-empty">Cargando...</p>}
                      {cotizacion.map((emp) => (
                        <article className="card empleado-card" key={emp.id}>
                          <div className="card-body d-flex justify-content-between align-items-center">
                            <div>
                              <div className="fw-bold">{emp.nombre}</div>
                              <div className="text-muted small">Empleado de Cotización</div>
                            </div>
                            <div className="d-flex gap-2">
                              <button className="btn btn-light btn-sm" onClick={() => editar(emp.id)}>
                                <Edit size={18} />
                              </button>
                              <button className="btn btn-light btn-sm" onClick={() => eliminar(emp)}>
                                <Trash2 size={18} />
                              </button>
                              <button
                                className={`btn btn-sm ${emp.estado === 1 ? "btn-warning" : "btn-success"}`}
                                onClick={() => toggleAusente(emp)}
                              >
                                {emp.estado === 1 ? "Ausente" : "Presente"}
                              </button>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>

                  <div className="subcol">
                    <h4 className="sub-title">Reparación</h4>
                    <div className="grupo-cards">
                      {reparacion.length === 0 && <p className="grupo-empty">Cargando...</p>}
                      {reparacion.map((emp) => (
                        <article className="card empleado-card" key={emp.id}>
                          <div className="card-body d-flex justify-content-between align-items-center">
                            <div>
                              <div className="fw-bold">{emp.nombre}</div>
                              <div className="text-muted small">Empleado de Reparación</div>
                            </div>
                            <div className="d-flex gap-2">
                              <button className="btn btn-light btn-sm" onClick={() => editar(emp.id)}>
                                <Edit size={18} />
                              </button>
                              <button className="btn btn-light btn-sm" onClick={() => eliminar(emp)}>
                                <Trash2 size={18} />
                              </button>
                              <button
                                className={`btn btn-sm ${emp.estado === 1 ? "btn-warning" : "btn-success"}`}
                                onClick={() => toggleAusente(emp)}
                              >
                                {emp.estado === 1 ? "Ausente" : "Presente"}
                              </button>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          ) : (
            // Panel: para el gerente
            <div className="grilla-grupos-para-gerente">
              <section className="grupo-col trabajadores-col">
                <h3 className="grupo-title">{isSuper ? "Trabajadores" : `Área de ${capital(gerenteCargo)}`}</h3>
                <div className="subcol">
                  <h4 className="sub-title">{capital(gerenteCargo)}</h4>
                  <div className="grupo-cards">
                    {(gerenteCargo === "cotizacion" ? cotizacion : reparacion).length === 0 && (
                      <p className="grupo-empty">Cargando...</p>
                    )}
                    {(gerenteCargo === "cotizacion" ? cotizacion : reparacion).map((emp) => (
                      <article className="card empleado-card" key={emp.id}>
                        <div className="card-body d-flex justify-content-between align-items-center">
                          <div>
                            <div className="fw-bold">{emp.nombre}</div>
                            <div className="text-muted small">Empleado de {capital(gerenteCargo)}</div>
                          </div>
                          <div className="d-flex gap-2">
                            <button className="btn btn-light btn-sm" onClick={() => editar(emp.id)}>
                              <Edit size={18} />
                            </button>
                            <button className="btn btn-light btn-sm" onClick={() => eliminar(emp)}>
                              <Trash2 size={18} />
                            </button>
                            <button
                              className={`btn btn-sm ${emp.estado === 1 ? "btn-warning" : "btn-success"}`}
                              onClick={() => toggleAusente(emp)}
                            >
                              {emp.estado === 1 ? "Ausente" : "Presente"}
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          )}

          <div className="acciones-footer">
            <Link to={registerPath} className="btn btn-danger fw-bold px-4 add-btn">
              Agregar Trabajador +
            </Link>
            <button
              type="button"
              className="btn-trash"
              title="Papelera"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpenTrash(true);
              }}
            >
              🗑️ Papelera
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
