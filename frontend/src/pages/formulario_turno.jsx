// src/pages/formulario_turno.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import './formulario_turno.css'

const FormularioTurno = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // Evita recargar la página
    const link = document.createElement("a");
    link.href = "/docs/mi_turno.pdf"; // Ruta dentro de public/docs/mi_turno.pdf
    link.download = "mi_turno.pdf"; // Nombre con el que se descargará
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert("Turno solicitado con éxito. Se descargó tu comprobante.");
    
    // Redirigir después de la descarga
    navigate("/dashboard"); 
  };

  const handleCancel = () => {
    navigate("/"); // Redirige al inicio
  };

  return (
    <div className="formulario-container">
      <p style={{ marginBottom: "20px" }}>Por favor llena este formulario para otorgar un turno</p>

      <div className="formulario-card">

        <div className="form-header">
          <h2>Formulario de Turno</h2>
        </div>

        <form onSubmit={handleSubmit}> {/* <-- Llama a handleSubmit */}
          <div className="form-group">
            <label className="form-label">Nombre</label>
            <input type="text" className="form-control" placeholder="Ingresa tu nombre" />
          </div>

          <div className="form-group">
            <label className="form-label">Apellido</label>
            <input type="text" className="form-control" placeholder="Ingresa tu apellido" />
          </div>

          <div className="form-group">
            <label className="form-label">Telefono</label>
            <input type="tel" className="form-control" placeholder="Ingresa tu telefono" />
          </div>

          <div className="form-group">
            <label className="form-label">Area</label>
            <select className="form-select">
              <option value="">Selecciona un área</option>
              <option value="rep">Reparacion</option>
              <option value="cot">Cotizacion</option>
            </select>
          </div>
          
          <div className="botones-container">
            <button type="submit" className="submit-button" >Solicitar Turno</button>
            <button type="button" className="cancel-button" onClick={handleCancel}>Cancelar</button>
          </div>
          
        </form>
      </div>
                  
      

    </div>
  );
};

export default FormularioTurno;
