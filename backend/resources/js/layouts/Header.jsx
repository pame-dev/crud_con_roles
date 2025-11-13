import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  User, TrendingUp, Tv, Pencil, Globe, Save, X, Eye, EyeOff, Sun, Moon,
  Volume2, VolumeX, BarChart3, Home
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
  const [verifyAttempts, setVerifyAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
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
    "/graficas",
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
        { pageLanguage: "es" },
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
    // evita cerrar si haces clic dentro del contenedor del traductor o su iframe
    if (
      !e.target.closest(".translate-icon-container") &&
      !e.target.closest("#google_translate_element") &&
      !e.target.closest(".goog-te-menu-frame")
    ) {
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

  // === OCULTAR BARRA SUPERIOR DE GOOGLE TRANSLATE ===
  useEffect(() => {
    const hideTranslateBanner = () => {
      const iframe = document.querySelector("iframe.skiptranslate");
      // Solo baja el z-index
      if (iframe) {
        iframe.style.zIndex = "1";
      }

      // Reajusta el body si Google empuja la página hacia abajo
      document.body.style.top = "0px";
    };

    // Ejecuta al montar y cada vez que Google reinyecta elementos
    hideTranslateBanner();
    const observer = new MutationObserver(() => hideTranslateBanner());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
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

  useEffect(() => {
    let timer;
    if (isLocked && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (isLocked && countdown === 0) {
      setIsLocked(false);
      setVerifyAttempts(0);
      showModal("Aviso", "Ya puedes volver a intentar verificar tu contraseña.", "info");
    }

    return () => clearInterval(timer);
  }, [isLocked, countdown]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCurrentPasswordCheck = () => {
    if (isLocked || loadingVerify) return;
    if (!currentPassword)
      return showModal("Error", "Ingresa tu contraseña actual.", "error");

    setLoadingVerify(true);

    fetch(`https://crudconroles-production.up.railway.app/api/empleados/${empleado.ID_EMPLEADO}/verificar-contrasena`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contrasena: currentPassword }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoadingVerify(false);
        if (data.igual) {
          setPasswordVerified(true);
          setIsLocked(false);
          setVerifyAttempts(0);
          showModal("Éxito", "Contraseña verificada. Ahora puedes editar tu perfil.", "success");
        } else {
          const newAttempts = verifyAttempts + 1;
          setVerifyAttempts(newAttempts);
          if (newAttempts >= 3) {
            setIsLocked(true);
            setCountdown(60);
            showModal("Bloqueado", "Demasiados intentos fallidos. Espera 60 segundos antes de volver a intentar.", "error");
          } else {
            showModal("Error", `Contraseña incorrecta. Te quedan ${newAttempts} de 3 Intentos.`, "error");
          }
        }
      })
      .catch((err) => {
        console.error(err);
        setLoadingVerify(false);
        showModal("Error", "Error al verificar la contraseña.", "error");
      });
  };



  const handleSave = () => {
    if (loadingSave) return;

    const datosActualizados = {
      nombre: formData.NOMBRE.trim(),
      correo: formData.CORREO.trim(),
      cargo: formData.CARGO.trim(),
      ...(passwordVerified && formData.CONTRASENA
        ? { contrasena: formData.CONTRASENA.trim() }
        : {}),
    };

    // Validar si no hubo ningún cambio
    const sinCambios =
      datosActualizados.nombre === (empleado.NOMBRE || "").trim() &&
      datosActualizados.correo === (empleado.CORREO || "").trim() &&
      (!datosActualizados.contrasena || datosActualizados.contrasena === "");

    if (sinCambios) {
      return showModal("Sin cambios", "No se detectaron modificaciones para guardar.", "info");
    }

    if (datosActualizados.nombre.length < 3)
      return showModal("Nombre inválido", "El nombre debe tener al menos 3 caracteres.", "error");

    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoRegex.test(datosActualizados.correo))
      return showModal("Correo inválido", "Por favor, ingresa un correo electrónico válido.", "error");

    if (passwordVerified && formData.CONTRASENA) {
      const contrasena = formData.CONTRASENA.trim();
      const contrasenaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
      if (!contrasenaRegex.test(contrasena))
        return showModal("Contraseña insegura", "Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.", "error");
    }

    setLoadingSave(true);

    fetch("https://crudconroles-production.up.railway.app/api/empleados/correo-existe", {
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
          setLoadingSave(false);
          return setCorreoError("El correo ya está registrado por otro empleado.");
        }

        actualizarEmpleado(empleado.ID_EMPLEADO, datosActualizados)
          .then((res) => {
            setLoadingSave(false);
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
            setLoadingSave(false);
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
            <ul className="navbar-nav mx-auto align-items-center">
              {/* Secciones visibles solo si hay sesión activa y NO está en / o /login */}
              {empleado && 
                location.pathname !== "/" &&
                location.pathname !== "/login" &&
                (empleado?.ID_ROL === 0 || empleado?.ID_ROL === 1) && (
                  <>
                    <li className="nav-item">
                      <button
                        className={`nav-link d-flex align-items-center btn btn-link p-0 border-0 ${
                          (location.pathname === "/vista_superadministrador" || location.pathname === "/vista_gerente") ? "active" : ""
                        }`}
                        onClick={() => {
                          if (empleado?.ID_ROL === 0) navigate("/vista_superadministrador");
                          else if (empleado?.ID_ROL === 1) navigate("/vista_gerente");
                        }}
                        style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
                      >
                        <Home size={20} className="my-2 mx-2" /> Principal
                      </button>
                    </li>
                      
                    <li className="nav-item">
                      <Link
                        to="/graficas"
                        className={`nav-link d-flex align-items-center ${location.pathname === "/graficas" ? "active" : ""}`}
                      >
                        <BarChart3 size={20} className="my-2 mx-2" /> Gráficas
                      </Link>
                    </li>
                  </>
              )}


              {/* Dashboard y Pantalla Completa - solo en páginas públicas */}
              {!mostrarSoloUsuario && (
                <>
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
                </>
              )}
            </ul>

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
                      
                      <button
                        className="edit-btn d-flex align-items-center"
                        onClick={() => { 
                          if (!passwordVerified) {
                            setIsEditing(true); 
                            setCorreoError(""); 
                          } else {
                            showModal("Aviso", "Ya verificaste tu contraseña, puedes editar directamente.", "info");
                          }
                        }}
                        title="Editar perfil"
                      >
                        <Pencil size={16} className="me-1" /> Editar
                      </button>
                    ) : (
                      <span
                        className="edit-mode badge bg-warning"
                        style={{ fontSize: "0.9rem", marginLeft: "60px" }}
                      >
                        Modo edición
                      </span>

                    )}

                  </div>

                  <div className="modal-options darkable">
                    {isEditing && !passwordVerified && (
                      <div style={{ marginBottom: "6px" }}>
                        <p className="text-danger mb-1" style={{ fontSize: "0.75rem", margin: 0 }}>
                          *La edición de su perfil requiere la verificación de su contraseña*
                        </p>
                      </div>
                    )}
                    <span className="profile-label">Nombre</span>
                    <div className="content-profile-row">
                      {isEditing ? (
                        <input
                          type="text"
                          name="NOMBRE"
                          value={formData.NOMBRE}
                          onChange={handleChange}
                          className="profile-input"
                          disabled={!passwordVerified}
                        />
                      ) : (
                        <div className="profile-row darkable">{empleado.NOMBRE}</div>
                      )}

                    </div>

                    <span className="profile-label">Correo</span>
                    <div className="content-profile-row">
                      {isEditing ? (
                        <input
                          type="email"
                          name="CORREO"
                          value={formData.CORREO}
                          onChange={handleChange}
                          className="profile-input"
                          disabled={!passwordVerified}
                        />
                      ) : (
                        <div className="profile-row darkable">{empleado.CORREO}</div>
                      )}
                    </div>

                    <span className="profile-label">Contraseña</span>
                    {isEditing && !passwordVerified && (
                      <>
                        <div className="content-profile-row d-flex align-items-center">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="profile-input me-2"
                            placeholder="Contraseña actual"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="eye-btn me-2"
                            title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary d-flex align-items-center justify-content-center"
                            onClick={handleCurrentPasswordCheck}
                            disabled={loadingVerify}
                            style={{ width: "100px" }}
                          >
                            {loadingVerify ? (
                              <div className="spinner-border spinner-border-sm text-light" role="status"></div>
                            ) : (
                              "Verificar"
                            )}
                          </button>
                        </div>
                      </>
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

                    {isLocked && (
                      <div className="text-danger text-center">
                        <p style={{ fontSize: "0.8rem" }}>
                          Espera <strong>{countdown}</strong> segundos para volver a intentarlo.
                        </p>
                        <div className="progress my-3" style={{ height: "4px" }}>
                          <div
                            className="progress-bar bg-danger"
                            role="progressbar"
                            style={{ width: `${((60 - countdown) / 60) * 100}%` }}
                            aria-valuenow={60 - countdown}
                            aria-valuemin="0"
                            aria-valuemax="60"
                          ></div>
                        </div>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => navigate("/olvide_mi_contrasena")}
                          style={{ fontSize: "0.8rem", padding: "0.15rem 1rem" }}
                        >
                          Recuperar contraseña
                        </button>
                      </div>
                    )}



                    <span className="profile-label">Área *</span>
                    <div className="content-profile-row">
                      <div className="profile-row darkable">{empleado.CARGO}</div>
                    </div>
                  </div>

                  <div className="modal-footer-profile darkable d-flex justify-content-between align-items-center">
                    {isEditing && (
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-success d-flex align-items-center"
                          onClick={handleSave}
                          disabled={loadingSave}
                        >
                          {loadingSave ? (
                            <div className="spinner-border spinner-border-sm text-light" role="status"></div>
                          ) : (
                            <Save size={20} className="me-0" />
                          )}
                        </button>

                        <button className="btn btn-secondary d-flex align-items-center" onClick={handleCancel}>
                          <X size={20} className="me-0" /> 
                        </button>
                      </div>
                    )}

                    <button
                      className="logout-btn btn btn-danger btn-sm align-items-center ms-1"
                      onClick={() => { logout(); setShowProfileModal(false); navigate("/"); }}
                    >
                      <User size={16} className="me-2" /> Cerrar Sesión
                    </button>

                  </div>


                </div>
              </div>
            )}

            <div className="ms-auto d-flex align-items-center gap-2">
              {empleado && location.pathname !== "/" && location.pathname !== "/login" && (
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
                    title={darkMode ? "Modo claro" : "Modo oscuro"}
                  >
                    {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                  </button>
                </>
              )}
            
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
              
              <div className="translate-wrapper">
                <button
                  id="translate-toggle"
                  className="btn btn-outline-light d-flex align-items-center translate-btn"
                  title="Traducir página"
                >
                  <Globe size={18} />
                </button>
                <div id="google_translate_element" className="translate-box"></div>
              </div>   
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
