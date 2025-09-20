import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./pages-styles/editar_empleado.css";

export default function EditarEmpleado() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [empleado, setEmpleado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [correoError, setCorreoError] = useState("");

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/empleados/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setEmpleado(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
  const { name, value } = e.target;
  setEmpleado({
    ...empleado,
    [name]: name === "ID_ROL" ? Number(value) : value
  });
};

  const handleSubmit = (e) => {
  e.preventDefault();
  setCorreoError("");

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
      // Preparar los datos con los nombres que espera Laravel
      const datos = {
        nombre: empleado.NOMBRE,
        correo: empleado.CORREO,
        cargo: empleado.CARGO,
        id_rol: Number(empleado.ID_ROL)
      };
      fetch(`http://127.0.0.1:8000/api/empleados/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Actualización exitosa:", data); // para debug
          navigate("/administrar_empleados"); // redirige solo si todo salió bien
        })
        .catch((err) => console.error("Error al actualizar:", err));
    })
    .catch((err) => {
      setCorreoError("Error al validar el correo.");
      console.error("Error al validar correo:", err);
    });
};



  // Manejo de estados de carga y error
  if (loading) return <p className="editar-empleado-loading">Cargando...</p>;
  if (!empleado) return <p className="editar-empleado-error">Empleado no encontrado</p>;

  return (
  <div className="editar-empleado container py-5">
      <h2 className="editar-empleado-title text-center mb-4">
        Editar Empleado
      </h2>

      <form
        onSubmit={handleSubmit}
        className="editar-empleado-form shadow p-4 rounded"
      >
        <div className="form-group mb-3">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            name="NOMBRE"
            value={empleado.NOMBRE || ""}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-group mb-3">
          <label className="form-label">Correo</label>
          <input
            type="email"
            name="CORREO"
            value={empleado.CORREO || ""}
            onChange={handleChange}
            className="form-control"
          />
          {correoError && (
            <div className="text-danger mt-2">{correoError}</div>
          )}
        </div>

        <div className="form-group mb-3">
          <label className="form-label">Cargo</label>
          <select
                        name="CARGO"
                        value={empleado.CARGO || ""}
                        onChange={handleChange}
                        className="form-control"
                        >
                        <option disabled value="">Selecciona un cargo</option>
                        <option value="Reparacion">Reparación</option>
                        <option value="Cotizacion">Cotizacion</option>
                </select>
        </div>

        <div className="form-group mb-3">
            <label className="form-label">Rol</label>
                <select
                        name="ID_ROL"
                        value={empleado.ID_ROL || ""}
                        onChange={handleChange}
                        className="form-control"
                        >
                        <option disabled value="">Selecciona un rol</option>
                        <option value="0">Administrador</option>
                        <option value="1">Gerente</option>
                        <option value="2">Empleado</option>
                </select>
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-success px-4" >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}
