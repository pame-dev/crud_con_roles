
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
    id_rol: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:8000/api/empleados", formData)
      .then((res) => {
        alert("Empleado registrado correctamente");
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
        alert("Error al registrar empleado");
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
                  <label htmlFor="contrasena" className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    id="contrasena"
                    name="contrasena"
                    value={formData.contrasena}
                    onChange={handleChange}
                    required
                  />
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