    // src/pages/reestablecer_contrasena.jsx
    import React, { useState } from "react";
    import axios from "axios";
    import "./pages-styles/login.css";
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

    // Paso 1: verificar código
    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
        setSubmitting(true);

        const res = await axios.post("http://127.0.0.1:8000/api/verify-code", {
            email,
            code,
            // ❌ NO mandamos contraseña aquí
        });

        // Si el código es correcto → paso 2
        setStep("passwords");
        } catch (err) {
        setError(err.response?.data?.error || "Código incorrecto");
        } finally {
        setSubmitting(false);
        }
    };

    // Paso 2: actualizar contraseña
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
                  // Expresión regular para validar contraseña segura
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

        await axios.post("http://127.0.0.1:8000/api/reset-password", {
            email,
            code,
            new_password: newPassword,
            new_password_confirmation: confirmPassword, // Laravel necesita esto con `confirmed`
        });

        setSuccess("Contraseña actualizada correctamente");

        // pequeño delay para mostrar el mensaje antes de redirigir
        setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
        setError(err.response?.data?.error || "No se pudo actualizar la contraseña");
        } finally {
        setSubmitting(false);
        }
    };

    return (
        <><div className="login-form">
            {step === "code" && (
                <form onSubmit={handleVerifyCode}>
                    <label className="input-group">
                        <span className="icon"><i className="fa-solid fa-key"></i></span>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Código de verificación"
                            required />
                    </label>
                    <button type="submit" className="btn-primary" disabled={submitting}>
                        {submitting ? "Verificando…" : "Verificar código"}
                    </button>
                    {error && <p className="error-msg">{error}</p>}
                </form>
            )}

            {step === "passwords" && (
                <form onSubmit={handleResetPassword}>
                    {/* Nueva contraseña */}
                    <div className="mb-3">
                        <label className="input-group">
                            <span className="icon"><i className="fa-solid fa-lock"></i></span>
                            <input
                                type={showPwd ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Nueva contraseña"
                                required />
                            <button
                                type="button"
                                className="eye"
                                onClick={() => setShowPwd((s) => !s)}
                            >
                                <i className={`fa-solid ${showPwd ? "fa-eye-slash" : "fa-eye"}`}></i>
                            </button>
                        </label>
                    </div>

                    {/* Confirmar contraseña */}
                    <div className="mb-3">
                        <label className="input-group">
                            <span className="icon"><i className="fa-solid fa-lock"></i></span>
                            <input
                                type={showConfirmPwd ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Repetir contraseña"
                                required />
                            <button
                                type="button"
                                className="eye"
                                onClick={() => setShowConfirmPwd((s) => !s)}
                            >
                                <i className={`fa-solid ${showConfirmPwd ? "fa-eye-slash" : "fa-eye"}`}></i>
                            </button>
                        </label>
                    </div>

                    <button type="submit" className="btn-primary" disabled={submitting}>
                        {submitting ? "Actualizando…" : "Actualizar contraseña"}
                    </button>
                    {error && <p className="error-msg">{error}</p>}
                    {success && <p className="success-msg">{success}</p>}
                </form>
            )}
        </div><ModalAlert
                show={modal.show}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                onClose={closeModal} /></>
    
    );
    };

    export default ReestablecerContrasena;
