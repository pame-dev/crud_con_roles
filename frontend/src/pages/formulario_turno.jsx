// src/pages/formulario_turno.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './formulario_turno.css'
<link 
  rel="stylesheet" 
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
></link>

const FormularioTurno = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.nombre || !formData.apellido || !formData.telefono || !formData.area) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    // Simular descarga del comprobante
    const link = document.createElement("a");
    link.href = "/docs/mi_turno.pdf";
    link.download = "mi_turno.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert("Turno solicitado con éxito. Se descargó tu comprobante.");
    
    // Redirigir después de la descarga
    navigate("/dashboard"); 
  };

  const handleCancel = () => {
    navigate("/");
  };

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
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Apellido" 
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