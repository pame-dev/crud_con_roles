// src/pages/login.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./pages-styles/login.css";import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    user: "",
    pass: "",
    termsAccepted: false,
  });
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  // Validación: usuario >=6, pass >=8 y términos aceptados
  const isValid = useMemo(() => {
    return (
      form.user.trim().length >= 6 &&
      form.pass.trim().length >= 8 &&
      form.termsAccepted
    );
  }, [form]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.termsAccepted) {
      setError("Debes aceptar los términos y condiciones para continuar.");
      return;
    }

    if (!isValid || submitting) return;

    try {
      setSubmitting(true);

      // Simulación login (demo, 800ms)
      await new Promise((r) => setTimeout(r, 800));

      navigate("/dashboard");
    } catch {
      setError("No se pudo iniciar sesión. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="full-width-container"
        initial={{ opacity: 0, x: 50 }}     // entra desde derecha
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}       // sale hacia izquierda
        transition={{ duration: 0.5 }}
      >

        <div className="login-wrap">

      {/* ===== TARJETA CENTRAL ===== */}
      
      <main className="login-main">
        <section className="login-card">
          <div className="avatar"><i className="fa-regular fa-user"></i></div>
          <h1 className="title">Inicio de Sesión</h1>

          <form onSubmit={onSubmit} className="login-form" noValidate>

            {/* Usuario */}
            <label className="input-group"> 
              <span className="icon"><i className="fa-solid fa-user"></i></span>
              <input
                type="text"
                name="user"
                placeholder="Usuario"
                value={form.user}
                onChange={handleChange}
                required
                minLength={3}
                autoComplete="username"
              />
            </label>

            {/* Contraseña */}
            <label className="input-group">
              <span className="icon"><i className="fa-solid fa-lock"></i></span>
              <input
                type={showPwd ? "text" : "password"}
                name="pass"
                placeholder="Contraseña"
                value={form.pass}
                onChange={handleChange}
                required
                minLength={6}
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

            {/* Términos + link */}
            <div className="aux-line">
              <label className="check">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={form.termsAccepted}
                  onChange={handleChange}
                />
                <span>Acepto los términos y condiciones</span>
              </label>
              <a className="link" href="#">Olvidé mi contraseña</a>
            </div>

            <button
              className="btn-primary"
              type="submit"
              disabled={!isValid || submitting}
            >
              {submitting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Iniciando…
                </>
              ) : (
                <>
                  <i className="fa-solid fa-right-to-bracket"></i> Iniciar Sesión
                </>
              )}
            </button>

            {error && <p className="error-msg">{error}</p>}
          </form>
        </section>
      </main>
    </div>
      </motion.div>
    </AnimatePresence>  
  );
};

export default Login;
