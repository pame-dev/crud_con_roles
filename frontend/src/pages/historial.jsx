import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "../iconos";

const Historial = () => {
  const navigate = useNavigate(); // Hook para navegación
  const [historial, setHistorial] = useState([]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Historial de Turnos</h2>
      
        <p>No hay historial.</p>

      <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} className="me-1" /> Regresar
      </button>
    </div>
  );
};

export default Historial;
