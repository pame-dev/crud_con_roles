import { useNavigate } from 'react-router-dom';
import './pages-styles/register_gerentes_y_trabajadores.css';
import { motion } from "framer-motion";
import axios from "axios";
import React, { useState } from "react";


const empleadoLogueado = JSON.parse(localStorage.getItem("empleado"));

const RegisterTrabajadores = () => {
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

    // antes de mandar, reforzamos que cargo e id_rol vayan correctos
    const payload = {
      ...formData,
      cargo: empleadoLogueado?.CARGO,
      id_rol: 2
    };
    
    axios
      .post("http://127.0.0.1:8000/api/empleados", payload)
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

export default RegisterTrabajadores;