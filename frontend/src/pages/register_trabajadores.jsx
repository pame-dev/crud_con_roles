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

    const [correoError, setCorreoError] = useState(""); // ← aquí faltaba

  // ← esta función faltaba
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "correo") {
      setCorreoError(""); // limpiar error al escribir de nuevo
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setCorreoError("");

        // Validar nombre y apellidos
    if (formData.nombre.length < 3) {
      alert("El nombre debe tener al menos 3 caracteres.");
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

        // Si no existe, registramos al empleado
        const payload = {
          ...formData,
          cargo: empleadoLogueado?.CARGO,
          id_rol: 2,
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