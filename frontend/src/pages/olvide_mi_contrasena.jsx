// src/pages/OlvideMiContrasena.jsx
import React, { useState, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "./pages-styles/olvide_contraseña.css";
import ReestablecerContrasena from "./reestablecer_contrasena";

const OlvideMiContrasena = () => {
  const [form, setForm] = useState({ user: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState("email");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isValid = useMemo(() => form.user.trim().length >= 6, [form]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isValid || submitting) return;

    try {
      setSubmitting(true);
      const response = await axios.post("http://127.0.0.1:8000/api/forgot-password", {
        email: form.user,
      });

      setSuccess(response.data.message || "Se envió un código a tu correo.");
      setStep("code");
    } catch (err) {
      if (err.response?.status === 422) {
        const emailErrors = err.response?.data?.errors?.email;
        setError(emailErrors?.[0] || err.response?.data?.message || "Error de validación.");
      } else if (err.response?.status === 404) {
        setError("El correo no está registrado en el sistema.");
      } else {
        setError(err.response?.data?.error || "No se pudo enviar el correo.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="login-page one-column"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5 }}
      >
        <div className="login-wrap">
          <main className="login-main">
            <section className="login-card glass">
              <div className="login-avatar">
                <i className="fa-regular fa-envelope"></i>
              </div>
              <h1 className="login-card-header">Recuperar contraseña</h1>

              {step === "email" && (
                <form onSubmit={onSubmit} className="login-form" noValidate>
                  <div className="login-input-group">
                    <span className="icon">
                      <i className="fa-solid fa-envelope"></i>
                    </span>
                    <input
                      type="email"
                      name="user"
                      placeholder="Correo"
                      value={form.user}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                    />
                  </div>

                  <button
                    className="login-btn"
                    type="submit"
                    disabled={!isValid || submitting}
                  >
                    {submitting ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin"></i> Enviando…
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-paper-plane"></i> Enviar código
                      </>
                    )}
                  </button>

                  {error && <p className="login-error">{error}</p>}
                  {success && <p className="login-footer">{success}</p>}
                </form>
              )}

              {step === "code" && <ReestablecerContrasena email={form.user} />}
            </section>
          </main>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OlvideMiContrasena;
