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
  const [currentPassword, setCurrentPassword] = useState("");
  const [passwordVerified, setPasswordVerified] = useState(false);

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

  useEffect(() => {
    const existingScript = document.querySelector("script[src*='translate.google.com']");
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: "es", layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE },
        "google_translate_element"
      );
    };

    if (window.google && window.google.translate) {
      window.googleTranslateElementInit();
    }

    const toggle = document.getElementById("translate-toggle");
    const element = document.getElementById("google_translate_element");

    const handleToggle = (e) => {
      e.stopPropagation();
      element?.classList.toggle("show");
    };

    const handleClickOutside = (e) => {
      if (!e.target.closest(".translate-icon-container")) {
        element?.classList.remove("show");
      }
    };

    toggle?.addEventListener("click", handleToggle);
    document.addEventListener("click", handleClickOutside);

    return () => {
      toggle?.removeEventListener("click", handleToggle);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

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

  useEffect(() => {
    if (darkMode) document.body.classList.add("dark-mode");
    else document.body.classList.remove("dark-mode");
  }, [darkMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCurrentPasswordCheck = () => {
    if (!currentPassword) return showModal("Error", "Ingresa tu contraseña actual.", "error");

    fetch(`http://127.0.0.1:8000/api/empleados/${empleado.ID_EMPLEADO}/verificar-contrasena`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contrasena: currentPassword }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.igual) {
          setPasswordVerified(true);
          showModal("Éxito", "Contraseña verificada. Ahora puedes cambiar la contraseña.", "success");
        } else {
          showModal("Error", "Contraseña actual incorrecta.", "error");
        }
      })
      .catch((err) => {
        console.error(err);
        showModal("Error", "Error al verificar la contraseña.", "error");
      });
  };

  const handleSave = () => {
    const datosActualizados = {
      nombre: formData.NOMBRE.trim(),
      correo: formData.CORREO.trim(),
      cargo: formData.CARGO.trim(),
      ...(passwordVerified && formData.CONTRASENA ? { contrasena: formData.CONTRASENA } : {}),
    };

    if (datosActualizados.nombre.length < 3)
      return showModal("Nombre inválido", "El nombre debe tener al menos 3 caracteres.", "error");

    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoRegex.test(datosActualizados.correo))
      return showModal("Correo inválido", "Por favor, ingresa un correo electrónico válido.", "error");

    fetch("http://127.0.0.1:8000/api/empleados/correo-existe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo: datosActualizados.correo, id: empleado.ID_EMPLEADO }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.existe) return setCorreoError("El correo ya está registrado por otro empleado.");

        actualizarEmpleado(empleado.ID_EMPLEADO, datosActualizados)
          .then((res) => {
            const empleadoActualizado = res.empleado || res.data || res;
            setEmpleado(empleadoActualizado);
            localStorage.setItem("empleado", JSON.stringify(empleadoActualizado));
            setIsEditing(false);
            setShowProfileModal(false);
            setPasswordVerified(false);
            setCurrentPassword("");
            setFormData({ ...formData, CONTRASENA: "" });
            showModal("Éxito", "Perfil actualizado correctamente", "success");
          })
          .catch((err) => {
            console.error(err);
            showModal("Error", "Error al actualizar perfil", "error");
          });
      });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPasswordVerified(false);
    setCurrentPassword("");
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
              <small className="text-light opacity-75">Acelera tu servicio</small>
            </div>
          </Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            {!mostrarSoloUsuario && (
              <ul className="navbar-nav mx-auto align-items-center">
                <li className="nav-item">
                  <Link to="/" className={`nav-link d-flex align-items-center ${location.pathname === "/" ? "active" : ""}`}>
                    <TrendingUp size={20} className="me-2" /> Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/pantalla_completa" className={`nav-link d-flex align-items-center ${location.pathname === "/pantalla_completa" ? "active" : ""}`}>
                    <Tv size={20} className="me-2" /> Pantalla Completa
                  </Link>
                </li>
                <li className="nav-item translate-icon-container ms-2">
                  <button
                    id="translate-toggle"
                    className="btn btn-outline-light d-flex align-items-center"
                    title="Traducir página"
                  >
                    <Globe size={18} />
                  </button>
                  <div id="google_translate_element" className="translate-box"></div>
                </li>
              </ul>
            )}

            {showProfileModal && empleado && (
              <div
                className="custom-modal-overlay"
                onClick={() => { if (!modal.show) setShowProfileModal(false); }}
                style={{ pointerEvents: modal.show ? "none" : "auto" }}
              >
                <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header-profile">
                    <div>
                      <h5 className="profile-name">{empleado.NOMBRE}</h5>
                      <p className="profile-email">{empleado.CORREO}</p>
                    </div>

                    {!isEditing ? (
                      <button className="edit-btn" onClick={() => { setIsEditing(true); setCorreoError(""); }}>
                        <Pencil size={16} />
                      </button>
                    ) : (
                      <span className="edit-mode">Modo edición</span>
                    )}
                  </div>

                  <div className="modal-options darkable">
                    <span className="profile-label">Nombre</span>
                    <div className="content-profile-row">
                      {isEditing ? (
                        <input type="text" name="NOMBRE" value={formData.NOMBRE} onChange={handleChange} className="profile-input" />
                      ) : (
                        <div className="profile-row darkable">{empleado.NOMBRE}</div>
                      )}
                    </div>

                    <span className="profile-label">Correo</span>
                    <div className="content-profile-row">
                      {isEditing ? (
                        <>
                          <input type="email" name="CORREO" value={formData.CORREO} onChange={handleChange} className="profile-input" />
                          {correoError && <div className="text-danger mt-1">{correoError}</div>}
                        </>
                      ) : (
                        <div className="profile-row darkable">{empleado.CORREO}</div>
                      )}
                    </div>

                    <span className="profile-label">Contraseña</span>
                    {isEditing && !passwordVerified && (
                      <div className="content-profile-row d-flex align-items-center">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="profile-input me-2"
                          placeholder="Contraseña actual"
                        />
                        <button type="button" className="btn btn-primary" onClick={handleCurrentPasswordCheck}>Verificar</button>
                      </div>
                    )}

                    {isEditing && passwordVerified && (
                      <div className="content-profile-row d-flex align-items-center">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="CONTRASENA"
                          value={formData.CONTRASENA}
                          onChange={handleChange}
                          className="profile-input me-2"
                          placeholder="Nueva contraseña"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="eye-btn">
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    )}

                    {!isEditing && (
                      <div className="content-profile-row">
                        <div className="profile-row darkable">********</div>
                      </div>
                    )}

                    <span className="profile-label">Área</span>
                    <div className="content-profile-row">
                      <div className="profile-row darkable">{empleado.CARGO}</div>
                    </div>
                  </div>

                  <div className="modal-footer-profile darkable d-flex justify-content-between align-items-center">
                    {isEditing && (
                      <div className="d-flex gap-1">
                        <button className="btn btn-success d-flex align-items-center" onClick={handleSave}>
                          <Save size={12} className="me-1" /> Guardar
                        </button>
                        <button className="btn btn-secondary d-flex align-items-center" onClick={handleCancel}>
                          <X size={12} className="me-1" /> Cancelar
                        </button>
                      </div>
                    )}

                    <button
                      className="logout-btn btn btn-danger btn-sm align-items-center"
                      onClick={() => { logout(); setShowProfileModal(false); navigate("/"); }}
                    >
                      <User size={16} className="me-1" /> Cerrar Sesión
                    </button>

                  </div>


                </div>
              </div>
            )}

            <div className="ms-auto d-flex align-items-center gap-2">
              <button
                className="btn btn-danger d-flex align-items-center btn-login"
                onClick={() => {
                  if (location.pathname === "/" || location.pathname === "/login")
                    navigate("/login");
                  else setShowProfileModal(true);
                }}
              >
                <User size={16} className="me-2" /> {!mostrarSoloUsuario && "Iniciar Sesión"}
              </button>

              {empleado && (
                <>
                  <button
                    className={`btn d-flex align-items-center ${audioEnabled ? "btn-success" : "btn-secondary"}`}
                    onClick={toggleAudio}
                    title={audioEnabled ? "Desactivar sonido" : "Activar sonido"}
                  >
                    {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  </button>

                  <button
                    className={`btn d-flex align-items-center ${darkMode ? "btn-light" : "btn-dark"}`}
                    onClick={() => setDarkMode(!darkMode)}
                    title={darkMode ? "Modo claro" : "Modo oscuro"}
                  >
                    {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

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
