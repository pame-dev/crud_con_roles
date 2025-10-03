import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import "./pages-styles/register_gerentes_y_trabajadores.css";

const empleadoLogueado = JSON.parse(localStorage.getItem("empleado") || "null");

function normalizaCargo(c) {
  const s = (c || "").toLowerCase();
  if (s.includes("repar")) return "Reparacion";
  if (s.includes("cotiz")) return "Cotizacion";
  return c || ""; // por si ya viene correcto
}

const RegisterTrabajadores = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
    confirmarContrasena: "",
  });

  const [correoError, setCorreoError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
    if (name === "correo") setCorreoError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    // Validaciones básicas
    if (!formData.nombre || formData.nombre.trim().length < 3) {
      alert("El nombre debe tener al menos 3 caracteres.");
      return;
    }
    if (formData.contrasena !== formData.confirmarContrasena) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
    if (!passwordRegex.test(formData.contrasena)) {
      alert(
        "La contraseña debe tener mínimo 8 caracteres, incluir 1 mayúscula, 1 minúscula y 1 carácter especial."
      );
      return;
    }

    try {
      setSubmitting(true);

      // Verificar correo único
      const v = await fetch("http://127.0.0.1:8000/api/empleados/correo-existe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: formData.correo }),
      }).then((r) => r.json());

      if (v.existe) {
        setCorreoError("El correo ya está registrado por otro empleado.");
        setSubmitting(false);
        return;
      }

      // Construir payload: cargo heredado del gerente e id_rol = 2
      const cargoGerente = normalizaCargo(empleadoLogueado?.CARGO);
      const payload = {
        nombre: formData.nombre,
        correo: formData.correo,
        contrasena: formData.contrasena,
        cargo: cargoGerente,
        id_rol: 2,
      };

      await axios.post("http://127.0.0.1:8000/api/empleados", payload);
      alert("Empleado registrado correctamente");
      navigate("/administrar_empleados");
    } catch (err) {
      console.error(err);
      alert("Error al registrar empleado");
    } finally {
      setSubmitting(false);
    }
  };

  const areaUI =
    (empleadoLogueado?.CARGO || "")
      .toString()
      .replace(/^[a-z]/, (m) => m.toUpperCase());

  return (
    <AnimatePresence>
      <motion.div
        className="reg-page one-column"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5 }}
      >
        <section className="reg-card glass">
          <header className="reg-header">
            <div className="reg-avatar">
              <i className="fa-solid fa-user-plus"></i>
            </div>
            <h1>Nuevo trabajador</h1>
            <p className="reg-subtitle">El trabajador se registrará en tu área</p>
            {areaUI && (
              <div className="reg-badge">
                <i className="fa-solid fa-wrench"></i> Área: {areaUI}
              </div>
            )}
          </header>

          <form className="reg-form" onSubmit={handleSubmit} noValidate>
            {/* Nombre */}
            <label className="reg-group">
              <span className="icon">
                <i className="fa-solid fa-user"></i>
              </span>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                minLength={3}
              />
            </label>

            {/* Correo */}
            <label className="reg-group">
              <span className="icon">
                <i className="fa-solid fa-envelope"></i>
              </span>
              <input
                type="email"
                name="correo"
                placeholder="Correo electrónico"
                value={formData.correo}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </label>
            {correoError && <p className="reg-error">{correoError}</p>}

            {/* Contraseña */}
            <label className="reg-group">
              <span className="icon">
                <i className="fa-solid fa-lock"></i>
              </span>
              <input
                type={showPwd ? "text" : "password"}
                name="contrasena"
                placeholder="Contraseña"
                value={formData.contrasena}
                onChange={handleChange}
                required
                minLength={8}
                autoComplete="new-password"
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

            {/* Confirmación */}
            <label className="reg-group">
              <span className="icon">
                <i className="fa-solid fa-lock"></i>
              </span>
              <input
                type={showConfirmPwd ? "text" : "password"}
                name="confirmarContrasena"
                placeholder="Confirmar contraseña"
                value={formData.confirmarContrasena}
                onChange={handleChange}
                required
                minLength={8}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="eye"
                onClick={() => setShowConfirmPwd((s) => !s)}
                aria-label={
                  showConfirmPwd ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                <i
                  className={`fa-solid ${showConfirmPwd ? "fa-eye-slash" : "fa-eye"}`}
                ></i>
              </button>
            </label>

            {/* Acciones */}
            <div className="reg-actions">
              <button className="reg-btn" type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> Registrando…
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-user-check"></i> Registrar
                  </>
                )}
              </button>
              <button
                type="button"
                className="reg-btn outline"
                onClick={() => navigate(-1)}
                disabled={submitting}
              >
                <i className="fa-solid fa-arrow-left"></i> Cancelar
              </button>
            </div>
          </form>
        </section>
      </motion.div>
    </AnimatePresence>
  );
};

export default RegisterTrabajadores;
