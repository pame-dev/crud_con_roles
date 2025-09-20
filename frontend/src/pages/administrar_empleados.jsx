// src/pages/administrar_empleados.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Edit, Trash2, ArrowLeft } from "../iconos";
import { getCurrentUserRole } from "../hooks/auth";
import "./pages-styles/administrar_empleados.css";
import { motion, AnimatePresence } from "framer-motion";

export default function AdministrarEmpleados() {
  const navigate = useNavigate();
  const [nombreEmpleado, setNombreEmpleado] = useState("");
  const [filtro, setFiltro] = useState("");
  const [empleados, setEmpleados] = useState([]);

  // Protegemos la vista y bloqueamos retroceso
  useEffect(() => {
    const storedEmpleado = JSON.parse(localStorage.getItem("empleado"));

    if (!storedEmpleado) {
      navigate("/login", { replace: true });
      return;
    }

    setNombreEmpleado(storedEmpleado.NOMBRE);
    setFiltro(storedEmpleado.CARGO.toLowerCase());

    // Bloquear solo retroceso del navegador
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };

    // Agregar un estado extra para que el historial tenga "bloqueo"
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  const role = getCurrentUserRole(); // "superadmin" o "gerente"
  const isSuper = role === "superadmin";
  const storedEmpleado = JSON.parse(localStorage.getItem("empleado") || "null");

  const registerPath = isSuper
    ? "/register_gerentes_y_trabajadores"
    : "/register_trabajadores";

  const fallback =
    (storedEmpleado?.ROL || "").toLowerCase() === "superadmin"
      ? "/vista_superadministrador"
      : "/vista_gerente";

  // Botón de regresar dentro de la página
  const goBack = () => {
    const storedEmpleado = JSON.parse(localStorage.getItem("empleado") || "null");
    if (!storedEmpleado) return navigate("/login", { replace: true });
    
    const fallback =
      storedEmpleado.ID_ROL === 0
        ? "/vista_superadministrador"
        : "/vista_gerente";
    
    navigate(fallback, { replace: true });
  };



  // Cargar empleados
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
          cargo: e.CARGO,
          tipo:
            e.ID_ROL === 0
              ? "Administrador"
              : e.ID_ROL === 1
              ? "Gerente"
              : "Empleado",
          ID_ROL: e.ID_ROL,
        }));
        setEmpleados(empleadosNormalizados);
      })
      .catch((err) => console.error(err));
  }, []);

  // Eliminar empleado
  const handleDelete = (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este empleado?")) return;

    fetch(`http://127.0.0.1:8000/api/empleados/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Error al eliminar");
        setEmpleados((prev) => prev.filter((emp) => emp.id !== id));
      })
      .catch((err) => console.error(err));
  };

  // Filtrar empleados según rol
  let visible = [];
  if (isSuper) {
    visible = empleados.filter((e) => e.tipo !== "Administrador");
  } else if (role === "gerente") {
    visible = empleados.filter(
      (e) => e.ID_ROL === 2 && e.cargo === storedEmpleado?.CARGO
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        className="full-width-container"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5 }}
      >
        {/* HERO SECTION */}
        <div className="hero-section">
          <div className="text-center mt-2">
            <button
              className="btn_volver me-2"
              onClick={goBack}
              title="Regresar"
              aria-label="Regresar"
            >
              <ArrowLeft size={20} />
            </button>
            <h3 className="display-3 fw-bold mb-1">Administración de Empleados</h3>
            <p className="lead opacity-75">
              Gestiona gerentes y trabajadores de manera rápida y sencilla.
            </p>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="container" style={{ marginTop: "-5rem", paddingBottom: "1rem" }}>
          <div className="header d-flex align-items-center mb-4">
            <button
              className="btn_volver me-3"
              onClick={goBack}
              title="Regresar"
              aria-label="Regresar"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="titulo mb-0">Lista de Empleados</h2>
            {!isSuper && storedEmpleado?.CARGO && (
              <p className="text-muted ms-3 mb-0">(Gerente de {storedEmpleado.CARGO})</p>
            )}
          </div>

          <div className="row row-cols-1 row-cols-md-2 g-3 col-lg-100">
            {visible.map((emp) => (
              <div className="col" key={emp.id}>
                <div className="card empleado-card">
                  <div className="card-body d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-bold">{emp.nombre}</div>
                      <div className="text-muted small">
                        {emp.tipo === "Empleado" && emp.cargo === "General"
                          ? "Empleado General"
                          : `${emp.tipo} de ${emp.cargo}`}
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-light btn-sm icon-btn"
                        title="Editar"
                        onClick={() => navigate(`/editar_empleado/${emp.id}`)}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="btn btn-light btn-sm icon-btn"
                        title="Eliminar"
                        onClick={() => handleDelete(emp.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-4">
            <Link
              to={registerPath}
              className="btn btn-danger fw-bold px-4 add-btn"
            >
              Agregar Trabajador +
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
