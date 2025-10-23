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

  const [codigoEnviado, setCodigoEnviado] = useState(null);
  const [codigoIngresado, setCodigoIngresado] = useState("");
  const [esperandoCodigo, setEsperandoCodigo] = useState(false);


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
  // Validar cargo seleccionado
  if (!formData.cargo) {
    showModal("Cargo no seleccionado", "Por favor, selecciona un cargo.", "error");
    return;
  }
  // Validar rol seleccionado
  if (!formData.id_rol) {
    showModal("Rol no seleccionado", "Por favor, selecciona un rol.", "error");
    return;
  }

  
  //  AGREGAR: Validar que las contraseñas coincidan
  if (formData.contrasena !== formData.confirmarContrasena) {
    showModal("Contraseñas no coinciden", "Las contraseñas deben ser idénticas.", "error");
    return;
  }

  //  AGREGAR: Validar longitud de contraseña
  if (formData.contrasena.length < 8) {
    showModal("Contraseña muy corta", "La contraseña debe tener al menos 8 caracteres.", "error");
    return;
  }

  // Validar que el correo no exista en la base de datos
  try {
      setSubmitting(true);

      // 1. Validar que el correo no exista
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
        const codigo = Math.floor(100000 + Math.random() * 900000); // código 6 dígitos

        try {
          setSubmitting(true);

          // Llamar al backend
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
      if (codigoIngresado.toString() !== codigoEnviado.toString()) {
        showModal("Código incorrecto", "El código ingresado no coincide. Revisa tu correo.", "error");
        setSubmitting(false);
        return;
      }

      // 4. Registro final
      const payload = { ...formData, codigo: codigoIngresado, id_rol: Number(formData.id_rol) };
      await axios.post("http://127.0.0.1:8000/api/empleados/registrar-con-codigo", payload);

      showModal("Registro exitoso", "Empleado registrado correctamente.", "success");
      setTimeout(() => navigate("/administrar_empleados"), 1500);

    } catch (err) {
      console.error(err);
      showModal("Error", "Ocurrió un error.", "error");
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
        <section className="reg-card glass darkable">
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
                  className="reg-select darkable"
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
                  className="reg-select darkable"
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


              {submitting && !esperandoCodigo && (
                <p className="reg-info">Enviando código a tu correo…</p>
              )}
                {esperandoCodigo && (
                <label className="reg-group">
                  <span className="icon"><i className="fa-solid fa-key"></i></span>
                  <input
                    type="text"
                    name="codigo"
                    placeholder="Ingresa el código"
                    value={codigoIngresado}
                    onChange={(e) => setCodigoIngresado(e.target.value)}
                    required
                  />
                </label>
                )}

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
                className="reg-btn outline darkable"
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
