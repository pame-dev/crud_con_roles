import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "../iconos";
import { motion, AnimatePresence } from "framer-motion";
import "./pages-styles/terminos.css";

const TerminosYCondiciones = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate("/login", { replace: true });
  };

  return (
    <AnimatePresence>
      <motion.div
        className="full-width-container terminos-page"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container py-5">
          
          {/* TÍTULO */}
          <h2 className="fw-bold mb-4 terminos-title">
            Términos y Condiciones
          </h2>

          {/* CONTENIDO */}
          <div className="terminos-content p-4 shadow-card darkable">
            <p>
              Bienvenido a nuestra plataforma. Al utilizar nuestros servicios, aceptas cumplir con los siguientes términos y condiciones:
            </p>

            <ol>
              <li>El usuario se compromete a proporcionar información veraz y actualizada.</li>
              <li>No se permite el uso de la plataforma con fines ilegales o fraudulentos.</li>
              <li>La empresa no se hace responsable por pérdidas o daños derivados del uso del sistema.</li>
              <li>Se prohíbe el intento de acceso no autorizado a otras cuentas o secciones de la plataforma.</li>
              <li>Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán notificados en la plataforma.</li>
            </ol>

            <p>
              Al continuar usando la plataforma, aceptas todos los términos descritos aquí.
            </p>
          </div>

          {/* BOTÓN FINAL DE REGRESAR */}
          <div className="text-center mt-4">
            <button
              className="btn btn-danger fw-bold px-4"
              onClick={goBack}
            >
              Regresar al Login
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TerminosYCondiciones;
