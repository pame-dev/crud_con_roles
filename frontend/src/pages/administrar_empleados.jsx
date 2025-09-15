// src/pages/administrar_empleados.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Trash2 } from "../iconos";
import { getCurrentUserRole } from "../hooks/auth";
import "./pages-styles/administrar_empleados.css";

export default function AdministrarEmpleados() {
  const role = getCurrentUserRole();
  const isSuper = role === "superadmin";
  const registerPath = isSuper
    ? "/register_gerentes_y_trabajadores"
    : "/register_trabajadores";

  const [empleados, setEmpleados] = useState([]);

  useEffect(() => {
    // TODO: fetch real a /api/empleados cuando esté listo
    setEmpleados([
      { id: 1, nombre: "JUAN PEREZ", cargo: "COTIZACIÓN", tipo: "empleado" },
      { id: 2, nombre: "GERENTE DEMO", cargo: "GERENTE", tipo: "gerente" },
      { id: 3, nombre: "ANA LÓPEZ", cargo: "COTIZACIÓN", tipo: "empleado" },
    ]);
  }, []);

  // Si NO eres superadmin, no muestres gerentes
  const visible = isSuper ? empleados : empleados.filter(e => e.tipo !== "gerente");

  return (
    <div className="container py-5 administrar-page">
      <h2 className="text-center administrar-title">Administración de empleados</h2>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
        {visible.map((emp) => (
          <div className="col" key={emp.id}>
            <div className="card empleado-card">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-bold">{emp.nombre}</div>
                  <div className="text-muted small">{emp.cargo}</div>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-light btn-sm icon-btn" title="Editar">
                    <Edit size={18} />
                  </button>
                  <button className="btn btn-light btn-sm icon-btn" title="Eliminar">
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
