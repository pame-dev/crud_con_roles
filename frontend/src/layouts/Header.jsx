import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, TrendingUp, Tv, Pencil, Globe } from "lucide-react";
import logo from "../assets/logo-rojo.png";
import './header.css';
import { EmpleadoContext } from "./EmpleadoContext";
import { useTranslation } from "react-i18next";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const { empleado, setEmpleado, logout } = useContext(EmpleadoContext);
  const [showModal, setShowModal] = useState(false);
  const soloUsuario = [
    "/vista_gerente",
    "/vista_trabajador",
    "/vista_superadministrador",
    "/historial",
    "/administrar_empleados"
  ];
  const mostrarSoloUsuario = soloUsuario.includes(location.pathname);
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "es" ? "en" : "es");
  };

  // Obtener empleado del localStorage al cargar el componente
  useEffect(() => {
  // Cierra el menú al cambiar de página
    const navbar = document.getElementById("navbarNav");
    if (navbar && navbar.classList.contains("show")) {
      // Usa la API de Bootstrap para cerrar
      const collapse = new window.bootstrap.Collapse(navbar, { toggle: false });
      collapse.hide();
    }
  }, [location]);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark navbar-custom fixed-top full-width-container">
        <div className="container-fluid">

          {/* Logo */}
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <img src={logo} alt="PitLine Logo" className="logo-image" />
            <div>
              <h4 className="mb-0 fw-bold">PitLine</h4>
              <small className="text-light opacity-75">
                Taller Mecánico Profesional
              </small>
            </div>
          </Link>

          {/* Botón hamburguesa */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Menú colapsable */}
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
                <li className="nav-item">
                  <Link
                    to="#"
                    className="nav-link d-flex align-items-center"
                    onClick={(e) => {
                      e.preventDefault(); // evita que navegue
                      toggleLanguage();
                    }}
                  >
                    <Globe size={20} className="me-2" />
                    {t("traducir")}
                  </Link>
                </li>
              </ul>
            )}

            {/* Botón usuario */}
            <div className="ms-auto">
              <button
                className="btn btn-danger d-flex align-items-center btn-login"
                onClick={() => {
                  if (location.pathname === "/" || location.pathname === "/login") {
                    navigate("/login");
                  } else {
                    setShowModal(true);
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
      {showModal && empleado &&(
        <div
          className="custom-modal-overlay"
          onClick={() => setShowModal(false)} // Cierra al hacer click fuera
        >
          <div
            className="custom-modal"
            onClick={(e) => e.stopPropagation()} // Evita que el click dentro cierre el modal
          >
            {/* Encabezado con imagen y nombre */}
            <div className="modal-header-profile">
              <div>
                <h5 className="profile-name">{empleado.NOMBRE}</h5>
                <p className="profile-email">{empleado.CORREO}</p>
              </div>
            </div>

            {/* Opciones */}
            <div className="modal-options">
              
              <span className="profile-label">Nombre</span>
              <div className="content-profile-row">
                <div className="profile-row">
                  <span className="profile-data">{empleado.NOMBRE}</span>
                </div>
                <button className="edit-btn">
                  <Pencil size={16} />
                </button>
              </div>

              <span className="profile-label">Correo</span>
              <div className="content-profile-row">
                <div className="profile-row">
                  <span className="profile-data">{empleado.CORREO}</span>
                </div>
                <button className="edit-btn">
                  <Pencil size={16} />
                </button>
              </div>

              <span className="profile-label">Contraseña</span>
              <div className="content-profile-row">
                <div className="profile-row">
                  <span className="profile-data">{empleado.CONTRASENA}</span>
                </div>
                <button className="edit-btn">
                  <Pencil size={16} />
                </button>
              </div>

              <span className="profile-label">Area</span>
              <div className="content-profile-row">
                <div className="profile-row">
                  <span className="profile-data">{empleado.CARGO}</span>
                </div>
                <button className="edit-btn">
                  <Pencil size={16} />
                </button>
              </div>

              
            </div>

            {/* Footer */}
            <div className="modal-footer-profile">
              <button
                className="logout-btn" 
                onClick={() => {
                  logout(); 
                  setShowModal(false);
                  navigate("/");
                }}
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}


    </>

  );
};

export default Header; 