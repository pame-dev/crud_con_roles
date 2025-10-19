// src/pages/editar_empleado.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCurrentUserRole } from "../hooks/auth";
import "./pages-styles/editar_empleado.css";

export default function EditarEmpleado() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [empleado, setEmpleado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [correoError, setCorreoError] = useState("");
  const [nombreError, setNombreError] = useState("");

  // Rol de la sesión (superadmin | gerente)
  const role = getCurrentUserRole();
  const isSuper = role === "superadmin";

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/empleados/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setEmpleado(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error al cargar los datos:", error);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmpleado((prev) => ({
      ...prev,
      [name]: name === "ID_ROL" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!empleado) return;

    setCorreoError("");

    if (!empleado.NOMBRE || empleado.NOMBRE.trim().length < 3) {
      setNombreError("El nombre debe tener al menos 3 caracteres.");
      return;
    }
    setNombreError("");

    // Validar si el correo ya existe antes de enviar
    fetch("http://127.0.0.1:8000/api/empleados/correo-existe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo: empleado.CORREO, id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.existe) {
          setCorreoError("El correo ya está registrado por otro empleado.");
          return;
        }

        // Payload: nombre y correo siempre; cargo/rol solo si es superadmin
        const datos = {
          nombre: empleado.NOMBRE,
          correo: empleado.CORREO,
        };
        if (isSuper) {
          datos.cargo = empleado.CARGO;
          datos.id_rol = Number(empleado.ID_ROL);
        }

        fetch(`http://127.0.0.1:8000/api/empleados/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("Actualización exitosa:", data);
            navigate("/administrar_empleados");
          })
          .catch((err) => console.error("Error al actualizar:", err));
      })
      .catch((err) => {
        setCorreoError("Error al validar el correo.");
        console.error("Error al validar correo:", err);
      });
  };

  const handleCancel = () => {
    navigate("/administrar_empleados");
  };

  // Mostrar estado de carga mientras se obtienen los datos
  if (loading) {
  return (
    <div className="editar-empleado-page">
      <div className="editar-empleado-card skeleton">
        <div className="skeleton-header">
          <div className="skeleton-box"></div>
          <div className="skeleton-line" style={{ width: "50%", margin: "10px auto" }}></div>
        </div>

        <div className="skeleton-body">
          <div className="skeleton-row">
            <div className="skeleton-input"></div>
            <div className="skeleton-input"></div>
          </div>

          <div className="skeleton-row">
            <div className="skeleton-input"></div>
            <div className="skeleton-input"></div>
          </div>
          
          <div className="skeleton-buttons">
            <div className="skeleton-button"></div>
            <div className="skeleton-button"></div>
          </div>
        </div>
      </div>
    </div>
    );
  }
  
    if (!empleado) 
    return 
    <p className="editar-empleado-error">Empleado no encontrado</p>;

  return (
    <div className="editar-empleado-page">
      <div className="editar-empleado-card">
        <div className="editar-empleado-header">
          <div className="header-compact-icon">
            <i className="fa-solid fa-user-gear"></i>
          </div>
          <h2>Editar empleado</h2>
        </div>

        <form onSubmit={handleSubmit} className="editar-empleado-form darkable">
          {/* Fila 1: Nombre + Correo */}
          <div className="editar-empleado-row">
            <div className="editar-empleado-group">
              <label className="editar-empleado-label">
                <i className="fa-solid fa-user"></i> Nombre *
              </label>
              <input
                type="text"
                name="NOMBRE"
                className="editar-empleado-control"
                value={empleado.NOMBRE || ""}
                onChange={handleChange}
                placeholder="Nombre"
                required
              />
              {nombreError && <div className="input-error">{nombreError}</div>}
            </div>

            <div className="editar-empleado-group">
              <label className="editar-empleado-label">
                <i className="fa-solid fa-envelope"></i> Correo *
              </label>
              <input
                type="email"
                name="CORREO"
                className="editar-empleado-control"
                value={empleado.CORREO || ""}
                onChange={handleChange}
                placeholder="correo@empresa.com"
                required
              />
              {correoError && <div className="input-error">{correoError}</div>}
            </div>
          </div>

          {/* Fila 2: Cargo + (Rol) — solo si superadmin */}
          {isSuper && (
            <div className="editar-empleado-row">
              <div className="editar-empleado-group">
                <label className="editar-empleado-label">
                  <i className="fa-solid fa-wrench"></i> Cargo *
                </label>
                <select
                  name="CARGO"
                  className="editar-empleado-select darkable"
                  value={empleado.CARGO || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Selecciona un cargo
                  </option>
                  <option value="Reparacion">Reparación</option>
                  <option value="Cotizacion">Cotización</option>
                </select>
              </div>

              <div className="editar-empleado-group">
                <label className="editar-empleado-label">
                  <i className="fa-solid fa-id-badge"></i> Rol *
                </label>
                <select
                  name="ID_ROL"
                  className="editar-empleado-select darkable"
                  value={empleado.ID_ROL ?? ""}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Selecciona un rol
                  </option>
                  <option value="0">Administrador</option>
                  <option value="1">Gerente</option>
                  <option value="2">Empleado</option>
                </select>
              </div>
            </div>
          )}

          <div className="editar-empleado-footer">
            <p className="editar-empleado-note">* Campos obligatorios</p>

            <div className="botones-editar-container">
              <button type="submit" className="submit-compact-button" disabled={loading}>
                {loading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> Guardando…
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-check-circle"></i> Guardar cambios
                  </>
                )}
              </button>

              <button
                type="button"
                className="cancel-compact-button darkable"
                onClick={handleCancel}
                disabled={loading}
              >
                <i className="fa-solid fa-times-circle"></i> Cancelar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
