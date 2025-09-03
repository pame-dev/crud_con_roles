import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, TrendingUp, Tv, Pencil } from "lucide-react";
import logo from "../assets/logo-rojo.png";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const [showModal, setShowModal] = useState(false);

  const soloUsuario = [
    "/vista_administrador",
    "/vista_administrador2",
    "/vista_superadministrador",
  ];

  const mostrarSoloUsuario = soloUsuario.includes(location.pathname);

  return (
    <>
      <style>
        {`
          .navbar-nav .nav-link {
            border-radius: 0.5rem;
            margin: 0 0.25rem;
            transition: all 0.2s ease;
            color: rgba(255, 255, 255, 0.8) !important;
            text-decoration: none;
            display: flex;
            align-items: center;
            padding: 0.5rem 1rem;
          }
          
          .navbar-nav .nav-link.active {
            background-color: #dc3545;
            color: white !important;
          }
          
          .navbar-nav .nav-link:hover {
            background-color: rgba(220, 53, 69, 0.3);
            color: white !important;
          }
          
          .navbar-brand {
            text-decoration: none !important;
          }
          
          .btn-login {
            white-space: nowrap;
          }
          
          .logo-image {
            width: 100px;
            height: 70px;
            object-fit: contain;
            margin-right: 0.75rem;
          }
        `}
      </style>

      <nav className="navbar navbar-expand-lg navbar-dark navbar-custom fixed-top full-width-container">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <img
              src={logo}
              alt="PitLine Logo"
              className="logo-image"
            />
            <div>
              <h4 className="mb-0 fw-bold">PitLine</h4>
              <small className="text-light opacity-75">
                Taller Mecánico Profesional
              </small>
            </div>
          </Link>

          <div className="collapse navbar-collapse" id="navbarNav">
            {!mostrarSoloUsuario && (
              <ul className="navbar-nav mx-auto">
                <li className="nav-item">
                  <Link
                    to="/"
                    className={`nav-link d-flex align-items-center ${
                      location.pathname === "/" ? "active" : ""
                    }`}
                  >
                    <TrendingUp size={20} className="me-2" />
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/pantalla_completa"
                    className={`nav-link d-flex align-items-center ${
                      location.pathname === "/pantalla_completa" ? "active" : ""
                    }`}
                  >
                    <Tv size={20} className="me-2" />
                    Pantalla Completa
                  </Link>
                </li>
              </ul>
            )}

            {/* Botón usuario que abre modal */}
            <div className="ms-auto">
              <button
                className="btn btn-danger d-flex align-items-center btn-login"
                onClick={() => {
                  if (location.pathname === "/" || location.pathname === "/login") {
                      // Si estamos en dashboard o login, no abrir modal
                      navigate("/login"); // Esto solo redirige si estamos en "/"
                  } else {
                      setShowModal(true); // En cualquier otra vista, abrir modal
                  }
                }}
              >
                <User size={16} className="me-2" />
                {!mostrarSoloUsuario && "Iniciar Sesión"}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Perfil de Usuario</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3 d-flex justify-content-between align-items-center">
                  <span><strong>Nombre:</strong> Juan Pérez</span>
                  <button className="btn btn-sm btn-outline-primary">
                    <Pencil size={16} />
                  </button>
                </div>
                <div className="mb-3 d-flex justify-content-between align-items-center">
                  <span><strong>Contraseña:</strong> ********</span>
                  <button className="btn btn-sm btn-outline-primary">
                    <Pencil size={16} />
                  </button>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    navigate("/");
                  }}
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header; 