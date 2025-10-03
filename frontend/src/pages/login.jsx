import React, { useState, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { EmpleadoContext } from "../layouts/EmpleadoContext";
import "./pages-styles/login.css";

const Login = () => {
  const { setEmpleado } = useContext(EmpleadoContext);
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
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        user: form.user,
        pass: form.pass,
      });

      localStorage.setItem("empleado", JSON.stringify(response.data));
      setEmpleado(response.data);

      const { ID_ROL } = response.data;
      switch (ID_ROL) {
        case 0:
          navigate("/vista_superadministrador");
          break;
        case 1:
          navigate("/vista_gerente");
          break;
        case 2:
          navigate("/vista_trabajador");
          break;
        default:
          navigate("/");
          break;
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError("El correo no existe en el sistema.");
      } else if (err.response?.status === 401) {
        setError("Contraseña incorrecta.");
      } else {
        setError("No se pudo iniciar sesión. Intenta de nuevo.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="login-page one-column"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.35 }}
      >
        {/* Solo la tarjeta del formulario (una columna) */}
        <main className="login-card glass">
          <div className="login-card-header">
            <div className="login-avatar">
              <i className="fa-regular fa-user"></i>
            </div>
            <h1>Inicio de sesión</h1>
            <p className="login-subtitle">Ingresa tus datos para continuar</p>
          </div>

          <form onSubmit={onSubmit} className="login-form" noValidate>
            {/* Usuario */}
            <label className="login-input-group">
              <span className="icon"><i className="fa-solid fa-envelope"></i></span>
              <input
                type="text"
                name="user"
                placeholder="Correo"
                value={form.user}
                onChange={handleChange}
                required
                minLength={6}
                autoComplete="email"
              />
            </label>

            {/* Contraseña */}
            <label className="login-input-group">
              <span className="icon"><i className="fa-solid fa-lock"></i></span>
              <input
                type={showPwd ? "text" : "password"}
                name="pass"
                placeholder="Contraseña"
                value={form.pass}
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
                title={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                <i className={`fa-solid ${showPwd ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </label>

            {/* Términos + link */}
            <div className="login-aux">
              <label className="login-check">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={form.termsAccepted}
                  onChange={handleChange}
                />
                <span>
                  Acepto los{" "}
                  <a className="login-link-terms" href="/terminos_y_condiciones">
                    Términos y Condiciones
                  </a>
                </span>
              </label>
              <a className="login-link" href="/olvide_mi_contrasena">
                Olvidé mi contraseña
              </a>
            </div>

            <button
              className="login-btn"
              type="submit"
              disabled={!isValid || submitting}
            >
              {submitting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Iniciando…
                </>
              ) : (
                <>
                  <i className="fa-solid fa-right-to-bracket"></i> Iniciar sesión
                </>
              )}
            </button>

            <AnimatePresence>
              {error && (
                <motion.p
                  className="login-error"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </form>

          <footer className="login-footer">
            <small>© {new Date().getFullYear()} – PitLine</small>
          </footer>
        </main>
      </motion.div>
    </AnimatePresence>
  );
};

export default Login;
