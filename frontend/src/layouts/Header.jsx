import React from "react";
import { Link, useLocation } from "react-router-dom";
import { User, TrendingUp, Tv, ClipboardList } from "lucide-react";
import logo from "../assets/logo-rojo.png";

const Header = () => {
  const location = useLocation();

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

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
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
                
              </li>
            </ul>

            <Link
              to="/login"
              className="btn btn-danger d-flex align-items-center btn-login"
            >
              <User size={16} className="me-2" />
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
