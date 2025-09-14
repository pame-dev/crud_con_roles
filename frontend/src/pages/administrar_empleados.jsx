import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Trash2 } from "../iconos";
import "./pages-styles/administrar_empleados.css";

export default function AdministrarEmpleados() {
  const [empleados, setEmpleados] = useState([]);

  useEffect(() => {
    // Aquí conectamos con el backend real

    // Por ahora, datos de prueba
    setEmpleados([
      { id: 1, nombre: "JUAN PEREZ", cargo: "COTIZACIÓN" },
      { id: 2, nombre: "ANA LÓPEZ", cargo: "COTIZACIÓN" },
      { id: 3, nombre: "CARLOS RAMOS", cargo: "COTIZACIÓN" },
      { id: 4, nombre: "LUCÍA MEJÍA", cargo: "REPARACIÓN" },
      { id: 5, nombre: "JORGE SOTO", cargo: "COTIZACIÓN" },
      { id: 6, nombre: "MARÍA NAVA", cargo: "REPARACIÓN" },
      { id: 7, nombre: "RAÚL REYES", cargo: "COTIZACIÓN" },
      { id: 8, nombre: "KARLA MENA", cargo: "REPARACIÓN" },
      { id: 9, nombre: "MARIO DÍAZ", cargo: "COTIZACIÓN" },
    ]);
  }, []);

  const handleDelete = (emp) => {
    if (confirm(`¿Eliminar a ${emp.nombre}?`)) {
      setEmpleados((prev) => prev.filter((e) => e.id !== emp.id));
    }
  };

  const handleEdit = (emp) => {
    alert(`Editar a ${emp.nombre}`);
  };

  return (
    <div className="container py-5 administrar-page">
      <h2 className="text-center administrar-title">Administración de gerentes</h2>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
        {empleados.map((emp) => (
          <div className="col" key={emp.id}>
            <div className="card empleado-card">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-bold">{emp.nombre}</div>
                  <div className="text-muted small">{emp.cargo}</div>
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-light btn-sm icon-btn"
                    onClick={() => handleEdit(emp)}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    className="btn btn-light btn-sm icon-btn"
                    onClick={() => handleDelete(emp)}
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
          to="/register_gerentes_y_trabajadores"
          className="btn btn-danger fw-bold px-4 add-btn"
        >
          Agregar Trabajador +
        </Link>
      </div>
    </div>
  );
}
