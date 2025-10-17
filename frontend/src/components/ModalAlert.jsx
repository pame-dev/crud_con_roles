    import React from "react";
    import { motion, AnimatePresence } from "framer-motion";
    import "./ModalAlert.css";

    const ModalAlert = ({ show, title, message, onClose, type = "info" }) => {
    return (
        <AnimatePresence>
        {show && (
            <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            >
            <motion.div
                className={`modal-card ${type}`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
                <h2 className="modal-title">{title}</h2>
                <p className="modal-message">{message}</p>
                <button className="modal-btn" onClick={onClose}>
                Aceptar
                </button>
            </motion.div>
            </motion.div>
        )}
        </AnimatePresence>
    );
    };

    export default ModalAlert;
