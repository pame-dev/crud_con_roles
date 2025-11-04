import React, { useEffect, useState } from "react";
import "./DiagnosticoModal.css";
import Portal from "./Portal"; // Ajusta la ruta según donde crees el Portal

const DiagnosticoModal = ({ show, onClose, onSubmit, trabajadorNombre, showModal }) => {
  const [descripcion, setDescripcion] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [tipoServicio, setTipoServicio] = useState("");
  const hoy = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const body = document.body;

    if (show) {
        // BLOQUEAR SCROLL cuando el modal está abierto
        const scrollY = window.scrollY;
        body.style.position = "fixed";
        body.style.top = `-${scrollY}px`;
        body.style.left = "0";
        body.style.right = "0";
        body.style.overflow = "hidden";
        body.dataset.scrollY = scrollY; // Guardar posición para restaurar después
        body.classList.add('modal-open'); 
    } else {
        // RESTAURAR SCROLL cuando el modal se cierra
        const scrollY = parseInt(body.dataset.scrollY || "0", 10);
        body.style.position = "";
        body.style.top = "";
        body.style.left = "";
        body.style.right = "";
        body.style.overflow = "";
        body.classList.remove('modal-open'); 
        window.scrollTo(0, scrollY);
    }

    return () => {
        body.style.position = "";
        body.style.top = "";
        body.style.left = "";
        body.style.right = "";
        body.style.overflow = "";
        body.classList.remove('modal-open');
    };
  }, [show]);

  const handleSubmit = () => {
        if (!descripcion || !fechaEntrega || !tipoServicio)
        return showModal("Error", "Por favor, completa todos los campos", "error");

        onSubmit({ descripcion, fechaEntrega, tipoServicio });
        setDescripcion("");
        setFechaEntrega("");
        setTipoServicio("");
  };

  if (!show) return null;

  // RENDERIZADO CON PORTAL - Esto se teletransporta al document.body
  return (
    <Portal> 
        {/*
        TODO ESTE CONTENIDO SE RENDERIZA DIRECTAMENTE EN EL BODY
        No importa dónde esté el componente DiagnosticoModal en tu árbol de React,
        siempre aparecerá al final del document.body en el DOM real
        */}
        <div className="modal-overlayy" onClick={onClose}>
            <div className="modal-diagnostico darkable" onClick={(e) => e.stopPropagation()}>
                <h4 className="modal-title">
                    <i className="bi bi-tools me-2"></i> Diagnóstico {trabajadorNombre}
                </h4>

                <div className="modal-body">
                    <label>Descripción del problema</label>
                    <textarea
                    className="darkable"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Describe el problema..."
                    />

                    <label>Tiempo estimado de entrega</label>
                    <input
                    type="date"
                    value={fechaEntrega}
                    onChange={(e) => setFechaEntrega(e.target.value)}
                    min={hoy}
                    />

                    <label>Tipo de servicio</label>
                    <input
                    type="text"
                    value={tipoServicio}
                    onChange={(e) => setTipoServicio(e.target.value)}
                    placeholder="Ej. Reparación, mantenimiento, revisión..."
                    />
                </div>

                <div className="modal-actions">
                    <button className="btn-cancel darkable" onClick={onClose}>
                    <i className="bi bi-x-circle me-1"></i> Cancelar
                    </button>
                    <button className="btn-save" onClick={handleSubmit}>
                    <i className="bi bi-check-circle me-1"></i> Guardar
                    </button>
                </div>
            </div>
        </div>
    </Portal>
  );
};

export default DiagnosticoModal;