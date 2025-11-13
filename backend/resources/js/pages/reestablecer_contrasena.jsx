// src/pages/reestablecer_contrasena.jsx
import React, { useState } from "react";
import axios from "axios";
import "./pages-styles/olvide_contraseña.css";
import { useNavigate } from "react-router-dom"; 
import ModalAlert from "../components/ModalAlert"; 

const ReestablecerContrasena = ({ email }) => {
  const [step, setStep] = useState("code"); // "code" o "passwords"
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const [modal, setModal] = useState({ show: false, title: "", message: "", type: "info" });
  const showModal = (title, message, type = "info") => setModal({ show: true, title, message, type });
  const closeModal = () => setModal({ ...modal, show: false });

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      setSubmitting(true);
      await axios.post("https://crudconroles-production.up.railway.app/api/verify-code", { email, code });
      setStep("passwords");
    } catch (err) {
      setError(err.response?.data?.error || "Código incorrecto");
    } finally { setSubmitting(false); }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      showModal("Contraseña inválida", "La contraseña debe tener mínimo 8 caracteres, incluir 1 mayúscula, 1 minúscula y 1 carácter especial.", "error");
      return;
    }
    if (!newPassword || newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden o están vacías");
      return;
    }

    try {
      setSubmitting(true);
      await axios.post("https://crudconroles-production.up.railway.app/api/reset-password", {
        email,
        code,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });
      setSuccess("Contraseña actualizada correctamente");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo actualizar la contraseña");
    } finally { setSubmitting(false); }
  };

  return (
    <>
      <div className="login-form">
        {step === "code" && (
          <form onSubmit={handleVerifyCode}>
            <div className="login-input-group">
              <span className="icon"><i className="fa-solid fa-key"></i></span>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Código de verificación"
                required
              />
            </div>
            <button type="submit" className="login-btn" disabled={submitting}>
              {submitting ? "Verificando…" : "Verificar código"}
            </button>
            {error && <p className="login-error">{error}</p>}
            {success && <p className="login-footer">{success}</p>}
          </form>
        )}

        {step === "passwords" && (
          <form onSubmit={handleResetPassword}>
            {/* Nueva contraseña */}
            <div className="login-input-group">
              <span className="icon"><i className="fa-solid fa-lock"></i></span>
              <input
                type={showPwd ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nueva contraseña"
                required
              />
              <button type="button" className="eye" onClick={() => setShowPwd(!showPwd)}>
                <i className={`fa-solid ${showPwd ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>

            {/* Confirmar contraseña */}
            <div className="login-input-group">
              <span className="icon"><i className="fa-solid fa-lock"></i></span>
              <input
                type={showConfirmPwd ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repetir contraseña"
                required
              />
              <button type="button" className="eye" onClick={() => setShowConfirmPwd(!showConfirmPwd)}>
                <i className={`fa-solid ${showConfirmPwd ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>

            <button type="submit" className="login-btn" disabled={submitting}>
              {submitting ? "Actualizando…" : "Actualizar contraseña"}
            </button>
            {error && <p className="login-error">{error}</p>}
            {success && <p className="login-footer">{success}</p>}
          </form>
        )}
      </div>

      <ModalAlert
        show={modal.show}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onClose={closeModal}
      />
    </>
  );
};

export default ReestablecerContrasena;
