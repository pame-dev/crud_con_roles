import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import "./pages-styles/register_gerentes_y_trabajadores.css";
import ModalAlert from "../components/ModalAlert"; 

const empleadoLogueado = JSON.parse(localStorage.getItem("empleado") || "null");

function normalizaCargo(c) {
  const s = (c || "").toLowerCase();
  if (s.includes("repar")) return "Reparacion";
  if (s.includes("cotiz")) return "Cotizacion";
  return c || "";
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
  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
    type: "info"
  });

  // Nuevos estados para verificación por código
  const [codigoEnviado, setCodigoEnviado] = useState(null);
  const [codigoIngresado, setCodigoIngresado] = useState("");
  const [esperandoCodigo, setEsperandoCodigo] = useState(false);

  const showModal = (title, message, type = "info") => {
    setModal({ show: true, title, message, type });
  };

  const closeModal = () => setModal({ ...modal, show: false });

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
      showModal("Nombre inválido", "El nombre debe tener al menos 3 caracteres.", "error");
      return;
    }

    // Validar correo (formato correcto)
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.correo || !correoRegex.test(formData.correo)) {
      showModal("Correo inválido", "Por favor, ingresa un correo electrónico válido.", "error");
      return;
    }

    try {
      setSubmitting(true);

      // 1. Verificar si el correo ya existe en la base de datos
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

      // 2. Si no estamos esperando código aún → enviarlo
      if (!esperandoCodigo) {
        // Validar contraseña (seguridad) - solo si no estamos en modo código
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
        if (!passwordRegex.test(formData.contrasena)) {
          showModal(
            "Contraseña inválida",
            "Debe tener mínimo 8 caracteres, incluir 1 mayúscula, 1 minúscula y 1 carácter especial.",
            "error"
          );
          setSubmitting(false);
          return;
        }

        // Validar que las contraseñas coincidan
        if (formData.contrasena !== formData.confirmarContrasena) {
          showModal("Contraseñas no coinciden", "Las contraseñas no coinciden.", "error");
          setSubmitting(false);
          return;
        }

        const codigo = Math.floor(100000 + Math.random() * 900000); // código 6 dígitos

        try {
          // Llamar al backend para enviar código
          await axios.post("http://127.0.0.1:8000/api/enviar-codigo", {
            correo: formData.correo,
            codigo,
          });

          // Si la respuesta es correcta, guardamos el código y mostramos el input
          setCodigoEnviado(codigo);
          setEsperandoCodigo(true);

          showModal(
            "Código enviado",
            "Se ha enviado un código de verificación a tu correo. Ingrésalo para continuar.",
            "info"
          );

        } catch (err) {
          console.error(err);
          showModal(
            "Error",
            "No se pudo enviar el código. Revisa tu correo o intenta nuevamente.",
            "error"
          );
        } finally {
          setSubmitting(false);
        }

        return;
      }

      // 3. Si ya estamos esperando código → validar
      if (!codigoIngresado || codigoIngresado.toString() !== codigoEnviado.toString()) {
        showModal("Código incorrecto", "El código ingresado no coincide. Revisa tu correo.", "error");
        setSubmitting(false);
        return;
      }

      // 4. Registro final - CORREGIDO: Asegurar que el cargo se envíe correctamente
      const cargoGerente = normalizaCargo(empleadoLogueado?.CARGO);
      
      // Verificar que el cargo no sea null o vacío
      if (!cargoGerente) {
        showModal("Error", "No se pudo determinar el cargo del gerente. Contacta al administrador.", "error");
        setSubmitting(false);
        return;
      }

      const payload = {
        nombre: formData.nombre,
        correo: formData.correo,
        contrasena: formData.contrasena,
        cargo: cargoGerente, // ← Este campo es requerido
        id_rol: 2,
        codigo: codigoIngresado
      };

      console.log("Payload a enviar:", payload); // Para debugging

      await axios.post("http://127.0.0.1:8000/api/empleados/registrar-con-codigo", payload);
      showModal("Registro exitoso", "Empleado registrado correctamente.", "success");
      setTimeout(() => navigate("/administrar_empleados"), 1500);

    } catch (err) {
      console.error("Error completo:", err);
      console.error("Datos de respuesta:", err.response?.data);
      
      const errorMessage = err.response?.data?.message || "Error al registrar empleado.";
      showModal("Error", errorMessage, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const areaUI = (empleadoLogueado?.CARGO || "")
    .toString()
    .replace(/^[a-z]/, (m) => m.toUpperCase());

  return (
    <><AnimatePresence>
      <motion.div
        className="reg-page one-column"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5 }}
      >
        <section className="reg-card glass darkable">
          <header className="reg-header">
            <div className="reg-avatar">
              <i className="fa-solid fa-user-plus"></i>
            </div>
            <h1>Nuevo trabajador</h1>
            <p className="reg-subtitle">El trabajador se registrará en tu área</p>
            {areaUI && (
              <div className="reg-badge darkable">
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
                disabled={esperandoCodigo} />
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
                disabled={esperandoCodigo} />
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
                disabled={esperandoCodigo} />
              <button
                type="button"
                className="eye"
                onClick={() => setShowPwd((s) => !s)}
                aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                disabled={esperandoCodigo}
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
                disabled={esperandoCodigo} />
              <button
                type="button"
                className="eye"
                onClick={() => setShowConfirmPwd((s) => !s)}
                aria-label={showConfirmPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                disabled={esperandoCodigo}
              >
                <i
                  className={`fa-solid ${showConfirmPwd ? "fa-eye-slash" : "fa-eye"}`}
                ></i>
              </button>
            </label>

            {/* Campo para código de verificación */}
            {submitting && !esperandoCodigo && (
              <p className="reg-info">Enviando código a tu correo…</p>
            )}
            
            {esperandoCodigo && (
              <label className="reg-group">
                <span className="icon"><i className="fa-solid fa-key"></i></span>
                <input
                  type="text"
                  name="codigo"
                  placeholder="Ingresa el código de verificación"
                  value={codigoIngresado}
                  onChange={(e) => setCodigoIngresado(e.target.value)}
                  required
                  maxLength={6}
                  pattern="[0-9]*"
                  inputMode="numeric"
                />
              </label>
            )}

            {/* Acciones */}
            <div className="reg-actions">
              <button className="reg-btn" type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> 
                    {esperandoCodigo ? "Registrando…" : "Enviando código…"}
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-user-check"></i> 
                    {esperandoCodigo ? "Confirmar registro" : "Registrar"}
                  </>
                )}
              </button>
              
              {!esperandoCodigo && (
                <button
                  type="button"
                  className="reg-btn outline darkable"
                  onClick={() => navigate(-1)}
                  disabled={submitting}
                >
                  <i className="fa-solid fa-arrow-left"></i> Cancelar
                </button>
              )}
              
              {esperandoCodigo && (
                <button
                  type="button"
                  className="reg-btn outline darkable"
                  onClick={() => {
                    setEsperandoCodigo(false);
                    setCodigoIngresado("");
                    setSubmitting(false);
                  }}
                  disabled={submitting}
                >
                  <i className="fa-solid fa-arrow-left"></i> Volver
                </button>
              )}
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

export default RegisterTrabajadores;