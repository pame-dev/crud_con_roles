// src/pages/login.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  return (
    <AnimatePresence>
      <motion.div
        className="full-width-container"
        initial={{ opacity: 0, x: 50 }}     // entra desde derecha
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}       // sale hacia izquierda
        transition={{ duration: 0.5 }}
      >
        <div style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <h1>Login Funciona ✅</h1>
        </div>
      </motion.div>
    </AnimatePresence>  
  );
};

export default Login;
