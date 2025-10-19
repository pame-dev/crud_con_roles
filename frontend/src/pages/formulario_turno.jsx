// src/pages/formulario_turno.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './pages-styles/formulario_turno.css';
import { jsPDF } from "jspdf";
import logoImg from "../assets/logo-fondo-negro.png";
import ModalAlert from "../components/ModalAlert"; 

const FormularioTurno = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // estado de carga
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    telefono: '',
    area: ''
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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

  if (!formData.nombre || !formData.apellidos || !formData.telefono || !formData.area) {
    showModal("Campos incompletos", "Por favor, complete todos los campos.", "error");
    return;
  }

  if (formData.nombre.length < 3) {
    showModal("Nombre inválido", "El nombre debe tener al menos 3 caracteres.", "error");
    return;
  }

  if (formData.apellidos.length < 3) {
    showModal("Apellido inválido", "El apellido debe tener al menos 3 caracteres.", "error");
    return;
  }

  if (formData.telefono.length < 10) {
    showModal("Número de teléfono inválido", "El número de teléfono debe tener exactamente 10 dígitos.", "error");
    return;
  }

    try {
      setLoading(true); // activar animación

      const areaMap = { rep: 1, cot: 2 };
      const ahora = new Date();
      const opciones = { timeZone: 'America/Mexico_City' };
      const fecha = ahora.toLocaleDateString('en-CA', opciones);
      const hora = ahora.toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'America/Mexico_City'
      });

      const response = await fetch("http://127.0.0.1:8000/api/turnos", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          ID_AREA: areaMap[formData.area],
          NOMBRE: formData.nombre,
          APELLIDOS: formData.apellidos,
          TELEFONO: formData.telefono,
          FECHA: fecha,
          HORA: hora
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Crear PDF tipo boleto
        const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: [250, 400] });

        doc.setDrawColor(0);
        doc.setLineWidth(1.5);
        doc.roundedRect(10, 10, 230, 380, 10, 10, 'S');

        doc.setFillColor(30, 30, 30);
        doc.roundedRect(10, 10, 230, 60, 10, 10, 'F'); 

        const img = new Image();
        img.src = logoImg;
        img.onload = function() {
          doc.addImage(img, 'PNG', 20, 15, 40, 40);

          doc.setFontSize(14);
          doc.setTextColor(255, 255, 255);
          doc.setFont("helvetica", "bold");
          doc.text("Comprobante de Turno", 140, 55, { align: "center" });

          doc.setFontSize(12);
          doc.setTextColor(0);
          doc.setFont("helvetica", "normal");
          const startY = 120;
          const lineHeight = 20;
          doc.text(`Turno: ${data.turno}`, 20, startY);
          doc.text(`Nombre: ${formData.nombre} ${formData.apellidos}`, 20, startY + lineHeight);
          doc.text(`Teléfono: ${formData.telefono}`, 20, startY + 2*lineHeight);
          doc.text(`Área: ${formData.area === "rep" ? "Reparación" : "Cotización"}`, 20, startY + 3*lineHeight);
          doc.text(`Fecha: ${fecha}`, 20, startY + 4*lineHeight);
          doc.text(`Hora: ${hora}`, 20, startY + 5*lineHeight);

          doc.setLineWidth(0.5);
          doc.setDrawColor(150);
          doc.setLineDash([2, 2], 0);
          doc.line(20, startY + 6*lineHeight, 230, startY + 6*lineHeight);

          doc.setLineDash([], 0);
          doc.setFontSize(10);
          doc.text("Gracias por confiar en nosotros", 125, 360, { align: "center" });

          doc.save(`Turno_${data.turno}.pdf`);

      setLoading(false);
      showModal("Turno Solicitado", `Tu turno es el #${data.turno}. Se ha descargado un comprobante en PDF.`, "success");

      setTimeout(() => navigate("/"), 1200); // redirige después de mostrar modal
    };

    } else {
      setLoading(false);
      showModal("Error al solicitar turno", data.message || "Intenta de nuevo.", "error");
    }

        } catch (error) {
          setLoading(false);
          console.error("Error:", error);
          showModal("Error al solicitar turno", "Ocurrió un error. Intenta de nuevo.", "error");
        }
      };

  const handleCancel = () => navigate("/");

  return (
    <><div className="formulario-compact-container mb-4">
      {/* Overlay de carga */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Solicitando turno...</p>
        </div>
      )}

      <div className="formulario-compact-card">
        <div className="form-compact-header">
          <div className="header-compact-icon">
            <i className="fas fa-calendar-alt"></i>
          </div>
          <h2>Solicitud de Turno</h2>
          <p>Complete los campos para solicitar su turno</p>
        </div>

        <form onSubmit={handleSubmit} className="compact-form darkable">
          <div className="form-compact-row">
            <div className="form-compact-group">
              <label className="form-compact-label"><i className="fas fa-user"></i> Nombre *</label>
              <input
                type="text"
                className="form-compact-control"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Nombre"
                required />
            </div>

            <div className="form-compact-group">
              <label className="form-compact-label"><i className="fas fa-id-card"></i> Apellido *</label>
              <input
                type="text"
                className="form-compact-control"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                placeholder="Apellidos"
                required />
            </div>
          </div>

          <div className="form-compact-row">
            <div className="form-compact-group">
              <label className="form-compact-label"><i className="fas fa-phone"></i> Teléfono *</label>
              <input
                type="tel"
                className="form-compact-control"
                name="telefono"
                value={formData.telefono}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 10) {
                    setFormData(prev => ({ ...prev, telefono: value }));
                  }
                } }
                placeholder="Número de teléfono"
                required />
            </div>

            <div className="form-compact-group">
              <label className="form-compact-label"><i className="fas fa-wrench"></i> Área *</label>
              <select
                className="form-compact-select darkable"
                name="area"
                value={formData.area}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione área</option>
                <option value="rep">Reparación</option>
                <option value="cot">Cotización</option>
              </select>
            </div>
          </div>

          <div className="form-compact-footer">
            <p className="required-compact-note">* Campos obligatorios</p>
            <div className="botones-compact-container">
              <button type="submit" className="submit-compact-button" disabled={loading}>
                {loading ? (
                  <><i className="fas fa-spinner fa-spin"></i> Solicitando...</>
                ) : (
                  <><i className="fas fa-check-circle"></i> Solicitar Turno</>
                )}
              </button>
              <button type="button" className="cancel-compact-button darkable" onClick={handleCancel} disabled={loading}>
                <i className="fas fa-times-circle"></i> Cancelar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div><ModalAlert
        show={modal.show}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onClose={closeModal} /></>

  );
};

export default FormularioTurno;
