import React from "react";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";

const Graficas = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <Header />

      {/* Contenido principal */}
      <main className="flex-grow-1 d-flex justify-content-center align-items-center text-center">
        <div>
          <h2 className="fw-bold text-danger mb-3">En proceso...</h2>
          <p className="text-muted">Esta sección estará disponible próximamente.</p>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Graficas;
