// src/pages/administrar_empleados.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Edit, Trash2, ArrowLeft } from "../iconos";
import { getCurrentUserRole } from "../hooks/auth";
import "./pages-styles/administrar_empleados.css";

export default function AdministrarEmpleados() {
  const role = getCurrentUserRole();
  const isSuper = role === "superadmin";
  const navigate = useNavigate();
  const registerPath = isSuper
    ? "/register_gerentes_y_trabajadores"
    : "/register_trabajadores";
  const [empleados, setEmpleados] = useState([]);

  const empleado = JSON.parse(localStorage.getItem("empleado") || "null");
  const fallback = (empleado?.ROL || "").toLowerCase() === "superadmin"
    ? "/vista_superadministrador"
    : "/vista_gerente";

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate(fallback, { replace: true });
  };

  
  // Función para eliminar empleado
  const handleDelete = (id) => {
  if (!window.confirm("¿Seguro que quieres eliminar este empleado?")) return;

  fetch(`http://127.0.0.1:8000/api/empleados/${id}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (!res.ok) throw new Error("Error al eliminar");
      // actualizar el estado global
      setEmpleados((prev) => prev.filter((emp) => emp.id !== id));
    })
    .catch((err) => console.error("Error al eliminar empleado:", err));
};


  useEffect(() => {
  fetch("http://127.0.0.1:8000/api/empleados")
    .then((res) => {
      if (!res.ok) {
        throw new Error("Error al cargar empleados");
      }
      return res.json();
    })
    .then((data) => {
      // Mapear los datos según tu frontend (nombre, cargo, tipo, etc.)
      const empleadosNormalizados = data.map((e) => ({
        id: e.ID_EMPLEADO,
        ID_EMPLEADO: e.ID_EMPLEADO,
        nombre: e.NOMBRE,
        cargo: e.CARGO,
        tipo: e.ID_ROL === 0 ? "Administrador" : e.ID_ROL === 1 ? "Gerente" : "Empleado",
      }));
      setEmpleados(empleadosNormalizados);
    })
    .catch((err) => {
      console.error(err);
    });
}, []);

  // Si NO eres superadmin, no muestres gerentes
  const visible = isSuper ? empleados.filter(e => e.tipo !== "Administrador") : empleados.filter(e => e.tipo !== "Gerente" && e.tipo !== "Administrador");

  return (
    <div className="container py-5 administrar-page">
      <div className="header">
        <button className="btn_volver" onClick={goBack} title="Regresar" aria-label="Regresar">
          <ArrowLeft size={20} />
        </button>
        <h2 className="titulo">ADMINISTRACION DE EMPLEADOS</h2>
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
        {visible.map((emp) => (
          <div className="col" key={emp.id}>
            <div className="card empleado-card">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-bold">{emp.nombre}</div>
                  <div className="text-muted small">{emp.tipo === "Empleado" && emp.cargo === "General" ? "Empleado General" : `${emp.tipo} de ${emp.cargo}`}</div>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-light btn-sm icon-btn" title="Editar" onClick={() => navigate(`/editar_empleado/${emp.id}`)}>
                    <Edit size={18} />
                  </button>
                  <button className="btn btn-light btn-sm icon-btn" title="Eliminar" onClick={() => handleDelete(emp.id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botón de alta según rol */}
      <div className="text-center mt-4">
        <Link to={registerPath} className="btn btn-danger fw-bold px-4 add-btn">
          Agregar Trabajador +
        </Link>
      </div>
    </div>
  );
}
