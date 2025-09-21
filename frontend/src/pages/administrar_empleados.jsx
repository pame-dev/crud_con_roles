// src/pages/administrar_empleados.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Edit, Trash2, ArrowLeft } from "../iconos";
import { getCurrentUserRole } from "../hooks/auth";
import "./pages-styles/administrar_empleados.css";
import { motion, AnimatePresence } from "framer-motion";

export default function AdministrarEmpleados() {
  const navigate = useNavigate();
  const [empleados, setEmpleados] = useState([]);

  // ---- Guardas / sesión ----
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

  // ---- Cargar empleados ----
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
          cargo: (e.CARGO || "").toLowerCase(), // cotizacion | reparacion | general ...
          tipo: e.ID_ROL === 0 ? "Administrador" : e.ID_ROL === 1 ? "Gerente" : "Empleado",
          ID_ROL: e.ID_ROL,
        }));
        setEmpleados(empleadosNormalizados);
      })
      .catch(console.error);
  }, []);

  // ---- Helpers ----
  const editar = (id) => navigate(`/editar_empleado/${id}`);
  const eliminar = (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este empleado?")) return;
    fetch(`http://127.0.0.1:8000/api/empleados/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Error al eliminar");
        setEmpleados((prev) => prev.filter((emp) => emp.id !== id));
      })
      .catch(console.error);
  };
  const capital = (s = "") => s.charAt(0).toUpperCase() + s.slice(1);

  // ---- Visibilidad por rol ----
  let visibles = [];
  if (isSuper) {
    visibles = empleados.filter((e) => e.tipo !== "Administrador");
  } else if (role === "gerente") {
    // Un gerente solo ve empleados de su área
    visibles = empleados.filter((e) => e.ID_ROL === 2 && e.cargo === (storedEmpleado?.CARGO || "").toLowerCase());
  }

  // ---- Grupos para el layout por columnas ----
  const gerentes = isSuper ? visibles.filter((e) => e.tipo === "Gerente") : [];
  const cotizacion = visibles.filter((e) => e.tipo !== "Gerente" && e.cargo === "cotizacion");
  const reparacion = visibles.filter((e) => e.tipo !== "Gerente" && e.cargo === "reparacion");

  const gruposUI = isSuper
    ? [
        { key: "gerentes", title: "Gerentes", items: gerentes },
        { key: "cotizacion", title: "Cotización", items: cotizacion },
        { key: "reparacion", title: "Reparación", items: reparacion },
      ]
    : [
        { key: "area", title: `Área de ${capital(storedEmpleado?.CARGO || "")}`, items: visibles },
      ];

  return (
    <AnimatePresence>
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
              <button
                className="btn_volver hero-back"
                onClick={goBack}
                aria-label="Regresar"
                title="Regresar"
              >
                <ArrowLeft size={22} />
              </button>
              <div className="hero-copy text-center">
                <h3 className="display-3 fw-bold mb-1">Administración de Empleados</h3>
                  <p className="lead opacity-75">
                    Gestiona gerentes y trabajadores de manera rápida y sencilla.
                  </p>
                </div>

            {/* Spacer derecho para mantener el centrado simétrico */}
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

          {/* === LAYOUT: GERENTES + PANEL TRABAJADORES (con 2 subcolumnas) === */}
          <div className="grilla-grupos">

            {/* Columna: Gerentes */}
            <section className="grupo-col">
              <h3 className="grupo-title">Gerentes</h3>

              <div className="grupo-cards">
                {gerentes.length === 0 && <p className="grupo-empty">Cargando...</p>}

                {gerentes.map((emp) => (
                  <article className="card empleado-card" key={emp.id}>
                    <div className="card-body d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-bold">{emp.nombre}</div>
                        {/* Mostrar el ÁREA del gerente */}
                        <div className="text-muted small">{capital(emp.cargo)}</div>
                      </div>

                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-light btn-sm icon-btn icon-edit"
                          title="Editar"
                          onClick={() => editar(emp.id)}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="btn btn-light btn-sm icon-btn icon-delete"
                          title="Eliminar"
                          onClick={() => eliminar(emp.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Panel: Trabajadores (ocupa 2 columnas en desktop) */}
            <section className="grupo-col trabajadores-col">
              <h3 className="grupo-title">Trabajadores</h3>

              <div className="subgrilla">
                {/* Subcol: Cotización */}
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
                            <button
                              className="btn btn-light btn-sm icon-btn icon-edit"
                              title="Editar"
                              onClick={() => editar(emp.id)}
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              className="btn btn-light btn-sm icon-btn icon-delete"
                              title="Eliminar"
                              onClick={() => eliminar(emp.id)}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>

                {/* Subcol: Reparación */}
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
                            <button
                              className="btn btn-light btn-sm icon-btn icon-edit"
                              title="Editar"
                              onClick={() => editar(emp.id)}
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              className="btn btn-light btn-sm icon-btn icon-delete"
                              title="Eliminar"
                              onClick={() => eliminar(emp.id)}
                            >
                              <Trash2 size={18} />
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


          <div className="text-center mt-4">
            <Link to={registerPath} className="btn btn-danger fw-bold px-4 add-btn">
              Agregar Trabajador +
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

