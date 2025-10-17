import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import "./pages-styles/register_gerentes_y_trabajadores.css";
import ModalAlert from "../components/ModalAlert"; 

const RegisterGerentes = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    cargo: "",
    contrasena: "",
    confirmarContrasena: "",
    id_rol: "",
  });

    const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
    type: "info"
  });

    const showModal = (title, message, type = "info") => {
    setModal({ show: true, title, message, type });
  };

  const closeModal = () => setModal({ ...modal, show: false });

  const [correoError, setCorreoError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setCorreoError("");

  // Validaciones en orden correcto
  if (!formData.nombre || formData.nombre.trim().length < 3) {
    showModal("Nombre inválido", "El nombre debe tener al menos 3 caracteres.", "error");
    return;
  }

  // Validar correo (formato correcto)
  const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.correo || !correoRegex.test(formData.correo)) {
    showModal("Correo inválido", "Por favor, ingresa un correo electrónico válido.", "error");
    return;
  }

  // Validar que el correo no exista en la base de datos
  try {
    setSubmitting(true);
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

    // Validar selección de cargo
    if (!formData.cargo || formData.cargo.trim() === "") {
      showModal("Cargo inválido", "Por favor, selecciona un cargo.", "error");
      setSubmitting(false);
      return;
    }

    // Validar selección de rol
    if (!formData.id_rol || isNaN(formData.id_rol)) {
      showModal("Rol inválido", "Por favor, selecciona un rol válido.", "error");
      setSubmitting(false);
      return;
    }

    // Validar seguridad de contraseña
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
    if (!passwordRegex.test(formData.contrasena)) {
      showModal(
        "Contraseña débil",
        "Debe tener 8 caracteres, 1 mayúscula, 1 minúscula y 1 carácter especial.",
        "error"
      );
      setSubmitting(false);
      return;
    }

    // Validar coincidencia de contraseñas
    if (formData.contrasena !== formData.confirmarContrasena) {
      showModal("Contraseñas diferentes", "Las contraseñas no coinciden.", "error");
      setSubmitting(false);
      return;
    }

    // Si todo está bien → enviar los datos
    const payload = { ...formData, id_rol: Number(formData.id_rol) };
    await axios.post("http://127.0.0.1:8000/api/empleados", payload);

    showModal("Registro exitoso", "Empleado registrado correctamente.", "success");
    setTimeout(() => navigate("/administrar_empleados"), 1500);

  } catch (err) {
    console.error(err);
    showModal("Error", "Error al registrar empleado.", "error");
  } finally {
    setSubmitting(false);
  }
    };

  return (
    <><AnimatePresence>
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
            <h1>Nuevo empleado</h1>
            <p className="reg-subtitle">Completa los datos para darlo de alta</p>
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
                minLength={3} />
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
                autoComplete="email" />
            </label>
            {correoError && <p className="reg-error">{correoError}</p>}

            {/* Cargo + Rol (dos columnas en desktop) */}
            <div className="reg-two-cols">
              <div className="reg-select-wrap">
                <label className="reg-label">Cargo</label>
                <select
                  className="reg-select"
                  name="cargo"
                  value={formData.cargo}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona un cargo</option>
                  <option value="Reparación">Reparación</option>
                  <option value="Cotización">Cotización</option>
                </select>
              </div>

              <div className="reg-select-wrap">
                <label className="reg-label">Rol</label>
                <select
                  className="reg-select"
                  name="id_rol"
                  value={formData.id_rol}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona un rol</option>
                  <option value="1">Gerente</option>
                  <option value="2">Trabajador</option>
                </select>
              </div>
            </div>

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
                autoComplete="new-password" />
              <button
                type="button"
                className="eye"
                onClick={() => setShowPwd((s) => !s)}
                aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                <i className={`fa-solid ${showPwd ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </label>

            {/* Confirmar contraseña */}
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
                autoComplete="new-password" />
              <button
                type="button"
                className="eye"
                onClick={() => setShowConfirmPwd((s) => !s)}
                aria-label={showConfirmPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
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
    </AnimatePresence><ModalAlert
        show={modal.show}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onClose={closeModal} /></>
  );
};

export default RegisterGerentes;
