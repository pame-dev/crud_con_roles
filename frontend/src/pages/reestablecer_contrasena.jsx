    import React, { useState } from "react";
    import axios from "axios";

    const ReestablecerContrasena = () => {
    const [form, setForm] = useState({
        email: "",
        code: "",
        new_password: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); setSuccess("");

        try {
        const response = await axios.post("http://127.0.0.1:8000/api/verify-code", form);
        setSuccess(response.data.message);
        } catch (err) {
        setError(err.response?.data?.error || "Error al reestablecer la contraseña");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Correo" value={form.email} onChange={handleChange} required />
        <input type="text" name="code" placeholder="Código" value={form.code} onChange={handleChange} required />
        <input type="password" name="new_password" placeholder="Nueva contraseña" value={form.new_password} onChange={handleChange} required />
        <button type="submit">Reestablecer contraseña</button>
        {error && <p style={{color:'red'}}>{error}</p>}
        {success && <p style={{color:'green'}}>{success}</p>}
        </form>
    );
    };

    export default ReestablecerContrasena;
