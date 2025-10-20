import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  User, TrendingUp, Tv, Pencil, Globe, Save, X, Eye, EyeOff, Sun, Moon,
  Volume2, VolumeX
} from "lucide-react";
import logo from "../assets/logo-rojo.png";
import "./header.css";
import { EmpleadoContext } from "./EmpleadoContext";
import { actualizarEmpleado } from "../api/empleadosApi";
import { useTranslation } from "react-i18next";
import ModalAlert from "../components/ModalAlert";
import { useDarkMode } from "./DarkModeContext";
import { useAudio } from "../components/AudioContext";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useDarkMode();
  const { empleado, setEmpleado, logout } = useContext(EmpleadoContext);
  const [correoError, setCorreoError] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    NOMBRE: "",
    CORREO: "",
    CARGO: "",
    CONTRASENA: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
    type: "info",
  });

  const showModal = (title, message, type = "info") => {
    setModal({ show: true, title, message, type });
  };
  const closeModal = () => setModal({ ...modal, show: false });

  const soloUsuario = [
    "/vista_gerente",
    "/vista_trabajador",
    "/vista_superadministrador",
    "/historial",
    "/administrar_empleados",
    "/register_gerentes_y_trabajadores",
    "/register_trabajadores",
  ];
  const mostrarSoloUsuario =
    soloUsuario.includes(location.pathname) ||
    location.pathname.startsWith("/editar_empleado");

  const { t } = useTranslation(); // si luego usas i18n lingüístico interno

  // Cargar datos del empleado al formulario
  useEffect(() => {
    if (empleado) {
      setFormData({
        NOMBRE: empleado.NOMBRE || "",
        CORREO: empleado.CORREO || "",
        CARGO: empleado.CARGO || "",
        CONTRASENA: "",
      });
    }
  }, [empleado]);

  // Dark mode en <body>
  useEffect(() => {
    if (darkMode) document.body.classList.add("dark-mode");
    else document.body.classList.remove("dark-mode");
  }, [darkMode]);

  // === GOOGLE TRANSLATE: carga, toggle con clase 'show' y click-afuera ===
  useEffect(() => {
    // callback global antes de cargar script
    window.googleTranslateElementInit = () => {
      /* global google */
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          { pageLanguage: "es" },
          "google_translate_element"
        );
      }
    };

    // inyecta el script
    const existingScript = document.querySelector(
      "script[src*='translate.google.com/translate_a/element.js']"
    );
    if (!existingScript) {
      const script = document.createElement("script");
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }

    const toggleBtn = document.getElementById("translate-toggle");
    const element = document.getElementById("google_translate_element");

    const handleToggle = (e) => {
      e.stopPropagation();
      if (!element) return;
      element.classList.toggle("show");
    };

    const handleClickOutside = (e) => {
      if (!element) return;
      const insideIcon = e.target.closest(".translate-icon-container");
      const insideBox = e.target.closest("#google_translate_element");
      if (!insideIcon && !insideBox && element.classList.contains("show")) {
        element.classList.remove("show");
      }
    };

    toggleBtn?.addEventListener("click", handleToggle);
    document.addEventListener("click", handleClickOutside);

    return () => {
      toggleBtn?.removeEventListener("click", handleToggle);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);



  // Cierra menú colapsable de Bootstrap al navegar
  useEffect(() => {
    const navbar = document.getElementById("navbarNav");
    if (navbar && navbar.classList.contains("show") && window.bootstrap) {
      const collapse = new window.bootstrap.Collapse(navbar, { toggle: false });
      collapse.hide();
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const datosActualizados = {
      nombre: formData.NOMBRE.trim(),
      correo: formData.CORREO.trim(),
      cargo: formData.CARGO.trim(),
      ...(formData.CONTRASENA ? { contrasena: formData.CONTRASENA } : {}),
    };

    if (datosActualizados.nombre.length < 3) {
      showModal(
        "Nombre inválido",
        "El nombre debe tener al menos 3 caracteres.",
        "error"
      );
      return;
    }

    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoRegex.test(datosActualizados.correo)) {
      showModal(
        "Correo inválido",
        "Por favor, ingresa un correo electrónico válido.",
        "error"
      );
      return;
    }

    fetch("http://127.0.0.1:8000/api/empleados/correo-existe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        correo: datosActualizados.correo,
        id: empleado.ID_EMPLEADO,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.existe) {
          setCorreoError("El correo ya está registrado por otro empleado.");
          throw new Error("Correo ya registrado");
        }

        if (datosActualizados.contrasena) {
          const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
          if (!passwordRegex.test(datosActualizados.contrasena)) {
            showModal(
              "Contraseña inválida",
              "La contraseña debe tener mínimo 8 caracteres, incluir 1 mayúscula, 1 minúscula y 1 carácter especial.",
              "error"
            );
            throw new Error("Contraseña inválida");
          }
        }

        if (
          !datosActualizados.nombre ||
          !datosActualizados.correo ||
          !datosActualizados.cargo
        ) {
          showModal(
            "Campos incompletos",
            "Por favor, completa todos los campos obligatorios.",
            "error"
          );
          throw new Error("Campos incompletos");
        }
      })
      .then(() => {
        return actualizarEmpleado(empleado.ID_EMPLEADO, datosActualizados);
      })
      .then((res) => {
        showModal("Éxito", "Perfil actualizado correctamente", "success");
        setIsEditing(false);
        setShowProfileModal(false);
        setEmpleado(res.empleado);
        localStorage.setItem("empleado", JSON.stringify(res.empleado));
      })
      .catch((err) => {
        if (err.message === "Correo ya registrado") return;
        if (err.errors) {
          const mensajes = Object.values(err.errors).flat().join("\n");
          showModal("Error al actualizar perfil", mensajes);
        } else if (err.message && !/Correo ya registrado/.test(err.message)) {
          showModal("Error al actualizar perfil", err.message);
        } else if (err.error) {
          showModal("Error al actualizar perfil", err.error);
        } else if (!modal.show) {
          showModal("Error al actualizar perfil", "Error desconocido");
        }
        console.error(err);
      });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      NOMBRE: empleado?.NOMBRE || "",
      CORREO: empleado?.CORREO || "",
      CARGO: empleado?.CARGO || "",
      CONTRASENA: "",
    });
  };

  const { audioEnabled, toggleAudio } = useAudio();

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark navbar-custom fixed-top full-width-container">
        <div className="container-fluid">
          <Link to="#" className="navbar-brand d-flex align-items-center">
            <img src={logo} alt="PitLine Logo" className="logo-image" />
            <div>
              <h4 className="mb-0 fw-bold">PitLine</h4>
              <small className="text-light opacity-75">
                Acelera tu servicio
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
            {!mostrarSoloUsuario && (
              <ul className="navbar-nav mx-auto">
                <li className="nav-item">
                  <Link
                    to="/"
                    className={`nav-link d-flex align-items-center ${
                      location.pathname === "/" ? "active" : ""
                    }`}
                  >
                    <TrendingUp size={20} className="me-2" /> Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/pantalla_completa"
                    className={`nav-link d-flex align-items-center ${
                      location.pathname === "/pantalla_completa" ? "active" : ""
                    }`}
                  >
                    <Tv size={20} className="me-2" /> Pantalla Completa
                  </Link>
                </li>
              </ul>
            )}

            <div className="ms-auto d-flex align-items-center gap-2">
              <button
                    id="translate-toggle"
                    aria-label="Traducir"
                    title="Idioma"
                    className="btn btn-outline-light d-flex align-items-center"
                    type="button"
                  >
                    <Globe size={18} />
                  </button>
              <button
                className="btn btn-danger d-flex align-items-center btn-login"
                onClick={() => {
                  if (location.pathname === "/" || location.pathname === "/login")
                    navigate("/login");
                  else setShowProfileModal(true);
                }}
              >
                <User size={16} className="me-2" />{" "}
                {!mostrarSoloUsuario && "Iniciar Sesión"}
              </button>

              {empleado && (
                <>
                  <button
                    className={`btn d-flex align-items-center ${
                      audioEnabled ? "btn-success" : "btn-secondary"
                    }`}
                    onClick={toggleAudio}
                    title={audioEnabled ? "Desactivar sonido" : "Activar sonido"}
                  >
                    {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  </button>

                  <button
                    className={`btn d-flex align-items-center ${
                      darkMode ? "btn-light" : "btn-dark"
                    }`}
                    onClick={() => setDarkMode(!darkMode)}
                    title={
                      darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
                    }
                  >
                    {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Caja flotante del traductor*/}
      <div id="google_translate_element"></div>

      {showProfileModal && empleado && (
        <div
          className="custom-modal-overlay"
          onClick={() => {
            if (!modal.show) setShowProfileModal(false);
          }}
          style={{ pointerEvents: modal.show ? "none" : "auto" }}
        >
          <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-profile">
              <div>
                <h5 className="profile-name">{empleado.NOMBRE}</h5>
                <p className="profile-email">{empleado.CORREO}</p>
              </div>

              {!isEditing ? (
                <button
                  className="edit-btn"
                  onClick={() => {
                    setIsEditing(true);
                    setCorreoError("");
                  }}
                >
                  <Pencil size={16} />
                </button>
              ) : (
                <div className="d-flex gap-2">
                  <button className="edit-btn" onClick={handleSave}>
                    <Save size={16} />
                  </button>
                  <button className="edit-btn" onClick={handleCancel}>
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            <div className="modal-options darkable">
              <span className="profile-label">Nombre</span>
              <div className="content-profile-row">
                {isEditing ? (
                  <input
                    type="text"
                    name="NOMBRE"
                    value={formData.NOMBRE}
                    onChange={handleChange}
                    className="profile-input"
                  />
                ) : (
                  <div className="profile-row darkable">{empleado.NOMBRE}</div>
                )}
              </div>

              <span className="profile-label">Correo</span>
              <div className="content-profile-row">
                {isEditing ? (
                  <>
                    <input
                      type="email"
                      name="CORREO"
                      value={formData.CORREO}
                      onChange={handleChange}
                      className="profile-input"
                    />
                    {correoError && (
                      <div className="text-danger mt-1">{correoError}</div>
                    )}
                  </>
                ) : (
                  <div className="profile-row darkable">{empleado.CORREO}</div>
                )}
              </div>

              <span className="profile-label">Contraseña</span>
              <div className="content-profile-row d-flex align-items-center">
                {isEditing ? (
                  <>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="CONTRASENA"
                      value={formData.CONTRASENA}
                      onChange={handleChange}
                      className="profile-input me-2"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="eye-btn"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </>
                ) : (
                  <div className="profile-row darkable">********</div>
                )}
              </div>

              <span className="profile-label">Área</span>
              <div className="content-profile-row">
                <div className="profile-row darkable">{empleado.CARGO}</div>
              </div>
            </div>

            <div className="modal-footer-profile darkable">
              <button
                className="logout-btn"
                onClick={() => {
                  logout();
                  setShowProfileModal(false);
                  navigate("/");
                }}
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}

      <ModalAlert
        show={modal.show}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onClose={closeModal}
      />
    </>
  );
};

export default Header;
