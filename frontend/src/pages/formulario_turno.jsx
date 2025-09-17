// src/pages/formulario_turno.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './pages-styles/formulario_turno.css';
import { jsPDF } from "jspdf";
import logoImg from "../assets/logo-fondo-negro.png";

const FormularioTurno = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    telefono: '',
    area: ''
  });

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
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    try {
      // Mapear área a ID
      const areaMap = { rep: 1, cot: 2 };

      // Obtener fecha y hora actuales ajustadas a Ciudad de México
      const ahora = new Date();
      const opciones = { timeZone: 'America/Mexico_City' };
      
      // Formatear fecha como YYYY-MM-DD
      const fecha = ahora.toLocaleDateString('en-CA', opciones); // Formato ISO (YYYY-MM-DD)
      
      // Formatear hora como HH:MM:SS
      const hora = ahora.toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'America/Mexico_City'
      });

      console.log("Fecha:", fecha, "Hora:", hora);

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

        // Borde tipo boleto
        doc.setDrawColor(0);
        doc.setLineWidth(1.5);
        doc.roundedRect(10, 10, 230, 380, 10, 10, 'S');

        // Encabezado oscuro con borde redondeado
        doc.setFillColor(30, 30, 30);
        doc.roundedRect(10, 10, 230, 60, 10, 10, 'F'); 

        // Logo
        const img = new Image();
        img.src = logoImg;
        img.onload = function() {
          doc.addImage(img, 'PNG', 20, 15, 40, 40);

          // Texto encabezado separado del logo
          doc.setFontSize(14);
          doc.setTextColor(255, 255, 255);
          doc.setFont("helvetica", "bold");
          doc.text("Comprobante de Turno", 140, 55, { align: "center" });

          // Datos del turno más abajo
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

          // Línea punteada tipo perforación
          doc.setLineWidth(0.5);
          doc.setDrawColor(150);
          doc.setLineDash([2, 2], 0);
          doc.line(20, startY + 6*lineHeight, 230, startY + 6*lineHeight);

          // Pie de página
          doc.setLineDash([], 0);
          doc.setFontSize(10);
          doc.text("Gracias por confiar en nosotros", 125, 360, { align: "center" });

          // Guardar PDF
          doc.save(`Turno_${data.turno}.pdf`);
        };

        alert(`Turno solicitado con éxito. Tu turno es: ${data.turno}`);
        navigate("/");
      } else {
        alert("Error al solicitar turno: " + (data.message || "Intenta de nuevo."));
      }

    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error de conexión con el servidor.");
    }
  };

  const handleCancel = () => navigate("/");

  return (
    <div className="formulario-compact-container">
      <div className="formulario-compact-card">
        <div className="form-compact-header">
          <div className="header-compact-icon">
            <i className="fas fa-calendar-alt"></i>
          </div>
          <h2>Solicitud de Turno</h2>
          <p>Complete los campos para solicitar su turno</p>
        </div>

        <form onSubmit={handleSubmit} className="compact-form">
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
                required
              />
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
                required
              />
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
                onChange={handleChange}
                placeholder="Número de teléfono" 
                required
              />
            </div>

            <div className="form-compact-group">
              <label className="form-compact-label"><i className="fas fa-wrench"></i> Área *</label>
              <select 
                className="form-compact-select" 
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
              <button type="submit" className="submit-compact-button">
                <i className="fas fa-check-circle"></i>
                Solicitar Turno
              </button>
              <button type="button" className="cancel-compact-button" onClick={handleCancel}>
                <i className="fas fa-times-circle"></i>
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioTurno;
