
import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import './pages-styles/register_gerentes_y_trabajadores.css';
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const RegisterGerentes = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    cargo: '',
    contrasena: '',
    confirmarContrasena: '',
    id_rol: ''
  });

  const [correoError, setCorreoError] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCorreoError("");

      // Validar nombre y apellidos
  if (formData.nombre.length < 3) {
    alert("El nombre debe tener al menos 3 caracteres.");
    return;
  }

      // Validar contraseñas coincidan
    if (formData.contrasena !== formData.confirmarContrasena) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    // Expresión regular para validar contraseña segura
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;

    if (!passwordRegex.test(formData.contrasena)) {
      alert("La contraseña debe tener mínimo 8 caracteres, incluir 1 mayúscula, 1 minúscula y 1 carácter especial.");
      return;
    }

    // Validar si el correo ya existe antes de enviar
    fetch("http://127.0.0.1:8000/api/empleados/correo-existe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo: formData.correo }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.existe) {
          setCorreoError("El correo ya está registrado por otro empleado.");
          return;
        }

        // Si no existe, registramos
        const payload = {
          ...formData,
          id_rol: Number(formData.id_rol) // asegurar que va como número
        };

        axios
          .post("http://127.0.0.1:8000/api/empleados", payload)
          .then((res) => {
            alert("Empleado registrado correctamente");
            console.log(res.data);
            navigate("/administrar_empleados");
          })
          .catch((err) => {
            console.error(err);
            alert("Error al registrar empleado");
          });
      })
      .catch((err) => {
        setCorreoError("Error al validar el correo.");
        console.error("Error al validar correo:", err);
      });
  };


  return (
    <motion.div
      className="container mt-4"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
    >
      <div className="row justify-content-center align-items-center min-vh-100 formulario-container">
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-body p-4">
              <h2 className="card-title fw-bold text-dark mb-4 text-center">
                Registro de Usuario
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="correo" className="form-label">Correo Electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    id="correo"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    required
                  />
                    {correoError && (
                    <p className="text-danger mt-1">{correoError}</p>
                    )}
                </div>
                
                <div className="mb-3">
                  <label htmlFor="cargo" className="form-label">Cargo</label>
                  <select
                    className="form-control"
                    id="cargo"
                    name="cargo"
                    value={formData.cargo}
                    onChange={handleChange}
                    required
                  >
                    <option value=""> Selecciona un cargo </option>
                    <option value="Reparación">Reparación</option>
                    <option value="Cotización">Cotización</option>
                  </select>
                </div>

                
                 <div className="mb-3">
                  <label className="input-group">
                    <span className="icon"><i className="fa-solid fa-lock"></i></span>
                    <input
                      type={showPwd ? "text" : "password"}
                      name="contrasena"
                      placeholder="Contraseña"
                      value={formData.contrasena}
                      onChange={handleChange}
                      required
                      minLength={8}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="eye"
                      onClick={() => setShowPwd((s) => !s)}
                      aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      <i className={`fa-solid ${showPwd ? "fa-eye-slash" : "fa-eye"}`}></i>
                    </button>
                  </label>
                </div>

                <div className="mb-3">
                  <label className="input-group">
                    <span className="icon"><i className="fa-solid fa-lock"></i></span>
                    <input
                      type={showConfirmPwd ? "text" : "password"}
                      name="confirmarContrasena"
                      placeholder="Confirmar Contraseña"
                      value={formData.confirmarContrasena}
                      onChange={handleChange}
                      required
                      minLength={8}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="eye"
                      onClick={() => setShowConfirmPwd((s) => !s)}
                      aria-label={showConfirmPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      <i className={`fa-solid ${showConfirmPwd ? "fa-eye-slash" : "fa-eye"}`}></i>
                    </button>
                  </label>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="id_rol" className="form-label">Rol</label>
                  <select
                    className="form-select"
                    id="id_rol"
                    name="id_rol"
                    value={formData.id_rol}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione un rol</option>
                    <option value="1">Gerente</option>
                    <option value="2">Trabajador</option>
                  </select>
                </div>
                
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">
                    Registrar
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={() => navigate(-1)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RegisterGerentes;