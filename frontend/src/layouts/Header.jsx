import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
<<<<<<< HEAD
<<<<<<< HEAD
import { User, TrendingUp, Tv, Pencil, Globe, Save, X, Eye, EyeOff, Sun, Moon } from "lucide-react"; 
=======
import { User, TrendingUp, Tv, Pencil, Globe, Save, X, Eye, EyeOff } from "lucide-react"; // ✅ un solo import
>>>>>>> josue
=======
import {
  User, TrendingUp, Tv, Pencil, Globe, Save, X, Eye, EyeOff, Sun, Moon,
  Volume2, VolumeX
} from "lucide-react";
>>>>>>> 6cde0a0ed69e2640b9b6200b663910c42e33fb8d
import logo from "../assets/logo-rojo.png";
import "./header.css";
import { EmpleadoContext } from "./EmpleadoContext";
import { actualizarEmpleado, verificarContrasena } from "../api/empleadosApi";
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
    NOMBRE: "", CORREO: "", CARGO: "", CONTRASENA: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [modal, setModal] = useState({ show: false, title: "", message: "", type: "info" });

<<<<<<< HEAD
<<<<<<< HEAD
  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
    type: "info"
  });

  const showModal = (title, message, type = "info") => {
    setModal({ show: true, title, message, type });
  };
  
=======
  const showModal = (title, message, type = "info") => setModal({ show: true, title, message, type });
>>>>>>> 6cde0a0ed69e2640b9b6200b663910c42e33fb8d
  const closeModal = () => setModal({ ...modal, show: false });
=======
  // Sincronizar formData con el empleado activo cada vez que cambie el usuario autenticado o se abra el modal
  useEffect(() => {
    if (showModal) {
      setFormData({...empleado});
    }
  }, [empleado, showModal]);
  const [passwordRules, setPasswordRules] = useState({
    length: false,
    uppercase: false,
    number: false
  });
  const [passwordUsed, setPasswordUsed] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordEditing, setIsPasswordEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

//RECORDATORIO: terminar el editar y modificar el cancelar
//colocar en los inputs el "isEditing"
//checar composer.phar en backend
//enviar un correo al empleado si se cambia la contraseña (urgente solo cuando se trabaje en ello)
//mostrar y ocultar contraseña al presionar el boton de cambiar contraseña
//modificar el color gris de los input (utilizar el mismo que que el de la pagina sin modficiar)
//quitar datos genericos para rellenar inputs del perfil al editar
>>>>>>> josue

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
    soloUsuario.includes(location.pathname) || location.pathname.startsWith("/editar_empleado");

  const { t } = useTranslation();

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

  // === GOOGLE TRANSLATE: carga con HTTPS + init robusto + toggle .show ===
  useEffect(() => {
    // callback global que reintenta hasta que Google esté listo
    window.googleTranslateElementInit = () => {
      const tryInit = () => {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement(
            { pageLanguage: "es" },
            "google_translate_element"
          );
        } else {
          setTimeout(tryInit, 500);
        }
      };
      tryInit();
    };

    // inyectar script (HTTPS)
    const existing = document.querySelector("script[data-gt='el']");
    if (!existing) {
      const s = document.createElement("script");
      s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      s.async = true;
      s.defer = true;
      s.setAttribute("data-gt", "el");
      document.body.appendChild(s);
    } else {
      // si ya estaba, forzar init por si acaso
      if (typeof window.googleTranslateElementInit === "function") {
        window.googleTranslateElementInit();
      }
    }

    const toggleBtn = document.getElementById("translate-toggle");
    const element = document.getElementById("google_translate_element");

    const handleToggle = (e) => {
      e.stopPropagation();
      element?.classList.toggle("show");
    };

    const handleClickOutside = (e) => {
      if (!element) return;
      const insideBtn = e.target.closest("#translate-toggle");
      const insideBox = e.target.closest("#google_translate_element");
      if (!insideBtn && !insideBox && element.classList.contains("show")) {
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

  // === OCULTAR BARRA SUPERIOR DE GOOGLE TRANSLATE ===
  useEffect(() => {
    const hideTranslateBanner = () => {
      const iframe = document.querySelector("iframe.skiptranslate");
      const banner = document.querySelector(".skiptranslate");

      if (iframe) {
        iframe.style.display = "none";
        iframe.style.visibility = "hidden";
      }
      if (banner) {
        banner.style.display = "none";
      }
      document.body.style.top = "0px";
    };

    // Ejecuta de inmediato
    hideTranslateBanner();

    // Segundo intento después de 1s (por si Google tarda)
    const timeout = setTimeout(hideTranslateBanner, 1000);

    // Observa cambios por si lo reinyecta
    const observer = new MutationObserver(() => hideTranslateBanner());
    observer.observe(document.body, { childList: true, subtree: true });

    // Limpieza
    return () => {
      clearTimeout(timeout);
      observer.disconnect();
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
<<<<<<< HEAD
<<<<<<< HEAD
    setFormData(prev => ({ ...prev, [name]: value }));
=======
    setFormData({...formData, [name]: value });

    if (name === 'CONTRASENA') {
      // Validaciones en tiempo real
      setPasswordRules({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        number: /[0-9]/.test(value)
      });
      setPasswordUsed(false); // reset
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
>>>>>>> josue
=======
    setFormData((p) => ({ ...p, [name]: value }));
>>>>>>> 6cde0a0ed69e2640b9b6200b663910c42e33fb8d
  };

  const handleSave = () => {
<<<<<<< HEAD
    const datosActualizados = {
      nombre: formData.NOMBRE.trim(),
      correo: formData.CORREO.trim(),
      cargo: formData.CARGO.trim(),
      ...(formData.CONTRASENA ? { contrasena: formData.CONTRASENA } : {}),
    };

    if (datosActualizados.nombre.length < 3) {
      showModal("Nombre inválido", "El nombre debe tener al menos 3 caracteres.", "error");
      return;
    }

    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoRegex.test(datosActualizados.correo)) {
      showModal("Correo inválido", "Por favor, ingresa un correo electrónico válido.", "error");
      return;
    }

    fetch("http://127.0.0.1:8000/api/empleados/correo-existe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo: datosActualizados.correo, id: empleado.ID_EMPLEADO }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.existe) {
          setCorreoError("El correo ya está registrado por otro empleado.");
          throw new Error("Correo ya registrado");
        }

        if (datosActualizados.contrasena) {
          const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
          if (!passwordRegex.test(datosActualizados.contrasena)) {
            showModal(
              "Contraseña inválida",
              "La contraseña debe tener mínimo 8 caracteres, incluir 1 mayúscula, 1 minúscula y 1 carácter especial.",
              "error"
            );
            throw new Error("Contraseña inválida");
          }
        }

        if (!datosActualizados.nombre || !datosActualizados.correo || !datosActualizados.cargo) {
          showModal("Campos incompletos", "Por favor, completa todos los campos obligatorios.", "error");
          throw new Error("Campos incompletos");
        }
      })
<<<<<<< HEAD
      .then(() => {
        actualizarEmpleado(empleado.ID_EMPLEADO, datosActualizados)
          .then(res => {
            showModal("Éxito", "Perfil actualizado correctamente", "success");
            setIsEditing(false);
            setShowProfileModal(false);
            setEmpleado(res.empleado);
            localStorage.setItem("empleado", JSON.stringify(res.empleado));
          })
          .catch(err => {
            if (err.errors) {
              const mensajes = Object.values(err.errors).flat().join("\n");
              showModal("Error al actualizar perfil", mensajes);
            } else if (err.message) {
              showModal("Error al actualizar perfil", err.message);
            } else if (err.error) {
              showModal("Error al actualizar perfil", err.error);
            } else {
              showModal("Error al actualizar perfil", "Error desconocido");
            }
            console.error(err);
          });
=======
    // Preparar mensaje de confirmación personalizado
    const cambios = [];
    if (formData.NOMBRE && formData.NOMBRE.trim() !== empleado.NOMBRE) cambios.push(`tu nuevo nombre será ${formData.NOMBRE.trim()}`);
    if (formData.CORREO && formData.CORREO.trim() !== empleado.CORREO) cambios.push(`tu nuevo correo será ${formData.CORREO.trim()}`);
    const cambiandoPass = isPasswordEditing && !!(formData.CONTRASENA && formData.CONTRASENA.trim() !== '');
    // Nota: si también se cambia la contraseña, NO agregamos ningún mensaje aquí para la confirmación.
    // Construimos un mensaje de éxito para después de guardar.
    const mensajesExito = [];
    if (formData.NOMBRE && formData.NOMBRE.trim() !== empleado.NOMBRE) mensajesExito.push('El nombre ha sido actualizado.');
    if (formData.CORREO && formData.CORREO.trim() !== empleado.CORREO) mensajesExito.push('El correo ha sido actualizado.');
    if (formData.CARGO && formData.CARGO.trim() !== empleado.CARGO) mensajesExito.push('El área ha sido actualizada.');
    if (cambiandoPass) mensajesExito.push('La contraseña ha sido actualizada, no compartas este dato con nadie.');

    if (!formData.NOMBRE || !formData.CORREO || !formData.CARGO) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    // Si se está editando la contraseña validar reglas
    if (cambiandoPass) {
      const { length, uppercase, number } = passwordRules;
      if (!length || !uppercase || !number) {
        alert('La contraseña no cumple las reglas requeridas.');
        return;
      }
      // Verificar si la contraseña es igual a la actual usando la API
      verificarContrasena(empleado.ID_EMPLEADO, formData.CONTRASENA)
        .then(res => {
          if (res.igual) {
            alert('la contraseña no debe de ser idéntica a la actual');
            setPasswordUsed(true);
            return;
          }

          // Mostrar confirmación personalizada
          const confirmMsg = `¿Estás seguro que quieres actualizar tus datos?\n${cambios.join('\n')}`;
          if (!window.confirm(confirmMsg)) return;

          // Enviar la petición
          const datosActualizados = {
            nombre: formData.NOMBRE.trim(),
            correo: formData.CORREO.trim(),
            cargo: formData.CARGO.trim(),
            contrasena: formData.CONTRASENA
          };

          actualizarEmpleado(empleado.ID_EMPLEADO, datosActualizados)
            .then((res) => {
              let mensaje = 'Perfil actualizado correctamente';
              if (mensajesExito.length) {
                mensaje += '. ' + mensajesExito.join(' ');
              }
              alert(mensaje);
              setIsEditing(false);
              setIsPasswordEditing(false);
              setConfirmPassword('');
              // Cerrar modal en el siguiente tick para evitar interferencias con alert
              setTimeout(() => setShowModal(false), 0);
              localStorage.setItem('empleado', JSON.stringify(res.empleado));
            })
            .catch((err) => {
              alert('Error al actualizar perfil: ' + (err?.error || 'Error desconocido'));
            });
        })
        .catch(err => {
          alert('Error al verificar contraseña: ' + (err?.error || 'Error desconocido'));
        });
      return; // ya manejado el flujo async
    }

    // No se cambia contraseña
    const confirmMsg = `¿Estás seguro que quieres actualizar tus datos?\n${cambios.join('\n')}`;
    if (!window.confirm(confirmMsg)) return;

    const datosActualizados = {
      nombre: formData.NOMBRE.trim(),
      correo: formData.CORREO.trim(),
      cargo: formData.CARGO.trim()
    };

    actualizarEmpleado(empleado.ID_EMPLEADO, datosActualizados)
      .then((res) => {
        let mensaje = 'Perfil actualizado correctamente';
        if (mensajesExito.length) {
          mensaje += '. ' + mensajesExito.join(' ');
        }
        alert(mensaje);
        setIsEditing(false);
        setIsPasswordEditing(false);
        setConfirmPassword('');
        setTimeout(() => setShowModal(false), 0);
        localStorage.setItem('empleado', JSON.stringify(res.empleado));
      })
      .catch((err) => {
        alert('Error al actualizar perfil: ' + (err?.error || 'Error desconocido'));
>>>>>>> josue
=======
      .then(() => actualizarEmpleado(empleado.ID_EMPLEADO, datosActualizados))
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
          const msgs = Object.values(err.errors).flat().join("\n");
          showModal("Error al actualizar perfil", msgs);
        } else if (err.message && !/Correo ya registrado/.test(err.message)) {
          showModal("Error al actualizar perfil", err.message);
        } else if (err.error) {
          showModal("Error al actualizar perfil", err.error);
        } else if (!modal.show) {
          showModal("Error al actualizar perfil", "Error desconocido");
        }
        console.error(err);
>>>>>>> 6cde0a0ed69e2640b9b6200b663910c42e33fb8d
      });
  };

  const handleCancel = () => {
    setIsEditing(false);
<<<<<<< HEAD
    setFormData({
      NOMBRE: empleado?.NOMBRE || "",
      CORREO: empleado?.CORREO || "",
      CARGO: empleado?.CARGO || "",
      CONTRASENA: "",
    });
=======
    setFormData({...empleado}); // Restablece los datos al estado original del empleado
    setIsPasswordEditing(false);
    setConfirmPassword('');
    setPasswordRules({ length: false, uppercase: false, number: false });
    setPasswordUsed(false);
>>>>>>> josue
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
              <ul className="navbar-nav mx-auto">
                <li className="nav-item">
                  <Link
                    to="/"
                    className={`nav-link d-flex align-items-center ${location.pathname === "/" ? "active" : ""}`}
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
              {/* Traductor */}
              <button
                id="translate-toggle"
                aria-label="Traducir"
                title="Idioma"
                className="btn btn-outline-light d-flex align-items-center translate-btn"
                type="button"
              >
                <Globe size={18} />
              </button>

              {/* Login */}
              <button
                className="btn btn-danger d-flex align-items-center btn-login"
                onClick={() => {
                  if (location.pathname === "/" || location.pathname === "/login") navigate("/login");
                  else setShowProfileModal(true);
                }}
              >
                <User size={16} className="me-2" />
                {!mostrarSoloUsuario && "Iniciar Sesión"}
              </button>

              {/* Audio + DarkMode */}
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
                    title={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                  >
                    {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Caja flotante del traductor */}
      <div id="google_translate_element"></div>

      {/* Modal Perfil */}
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
<<<<<<< HEAD
<<<<<<< HEAD
                <button 
                  className="edit-btn" 
                  onClick={() => { 
                    setIsEditing(true); 
                    setCorreoError(""); //  limpia error al empezar a editar 
                  }}
                >
=======
                <button className="edit-btn" onClick={() => {
                  setFormData({...empleado}); // Siempre cargar datos actuales al iniciar edición
                  setIsEditing(true);
                }}>
>>>>>>> josue
=======
                <button className="edit-btn" onClick={() => { setIsEditing(true); setCorreoError(""); }}>
>>>>>>> 6cde0a0ed69e2640b9b6200b663910c42e33fb8d
                  <Pencil size={16} />
                </button>
              ) : (
                <div className="d-flex gap-2">
<<<<<<< HEAD
                  <button className="edit-btn" onClick={handleSave}><Save size={16} /></button>
                  <button className="edit-btn" onClick={handleCancel}><X size={16} /></button>
=======
                  <button
                    className="edit-btn"
                    onClick={handleSave}
                    disabled={
                      // Si está habilitada la edición de contraseña, exigir reglas y coincidencia
                      (isPasswordEditing && (
                        !(passwordRules.length && passwordRules.uppercase && passwordRules.number) ||
                        !formData.CONTRASENA ||
                        formData.CONTRASENA !== confirmPassword
                      ))
                    }
                    title={
                      isPasswordEditing
                        ? (!(passwordRules.length && passwordRules.uppercase && passwordRules.number)
                            ? 'La contraseña no cumple las reglas'
                            : (!formData.CONTRASENA
                                ? 'Ingresa la nueva contraseña'
                                : formData.CONTRASENA !== confirmPassword
                                  ? 'Las contraseñas no coinciden'
                                  : 'Guardar'))
                        : 'Guardar'
                    }
                  >
                    <Save size={16} />
                  </button>
                  <button className="edit-btn" onClick={handleCancel}>
                    <X size={16} />
                  </button>
>>>>>>> josue
                </div>
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
<<<<<<< HEAD
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
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="eye-btn">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </>
<<<<<<< HEAD
                ) : <div className="profile-row darkable">********</div>}
=======
              <div className="content-profile-row">
                {!isEditing && (
                  <div className="profile-row">********</div>
                )}
                {isEditing && !isPasswordEditing && (
                  <div style={{width: '100%'}}>
                    <div className="profile-row">********</div>
                    <div className="mt-2">
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => {
                          setIsPasswordEditing(true);
                          setFormData({...formData, CONTRASENA: ''});
                          setConfirmPassword('');
                          setPasswordRules({ length: false, uppercase: false, number: false });
                          setPasswordUsed(false);
                        }}
                      >
                        Cambiar contraseña
                      </button>
                    </div>
                  </div>
                )}
                {isEditing && isPasswordEditing && (
                  <div style={{width: '100%'}}>
                    <div style={{position: 'relative'}}>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="CONTRASENA"
                        value={formData.CONTRASENA || ''}
                        onChange={handleChange}
                        className="profile-input"
                        placeholder="Ingresa nueva contraseña (no se muestra la actual)"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        style={{
                          position: 'absolute',
                          right: 8,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          cursor: 'pointer'
                        }}
                        tabIndex={-1}
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <div className="password-rules mt-2">
                      {/* operacionnes ternario para validar parametros de la nueva contraseña */}
                      <div style={{color: passwordRules.length ? 'green' : 'red'}}> - la contraseña debe contener mínimo 8 dígitos</div>
                      <div style={{color: passwordRules.uppercase ? 'green' : 'red'}}> - la contraseña debe tener una letra mayúscula</div>
                      <div style={{color: passwordRules.number ? 'green' : 'red'}}> - la contraseña debe tener mínimo 1 número</div>
                      {passwordUsed && <div style={{color: 'red'}}>esta contraseña ya ha sido utilizada, utiliza una diferente</div>}
                      <div className="mt-2">
                        <input 
                          type={showPassword ? "text" : "password"}
                          name="CONFIRM_CONTRASENA"
                          value={confirmPassword}
                          onChange={handleConfirmPasswordChange}
                          className="profile-input"
                          placeholder="Confirma tu nueva contraseña"
                          autoComplete="new-password"
                        />
                        <div style={{marginTop: '6px'}}>
                          {formData.CONTRASENA && formData.CONTRASENA !== '' ? (
                            formData.CONTRASENA === confirmPassword ? (
                              /*cuando la contraseña coincida con lo que se pide el texto cambiará y semostrará en verde*/
                              <div style={{color: 'green'}}>la contraseña coincide</div>
                            ) : (
                              <div style={{color: 'red'}}>las contraseñas no coinciden</div>
                            )
                          ) : null}
                        </div>
                        <div className="mt-2">
                          <button
                          /* boton para confirmar cambio de contraseña */
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => {
                              /*  Cancelar cambio de contraseña */
                              setIsPasswordEditing(false);
                              setFormData({...formData, CONTRASENA: ''});
                              setConfirmPassword('');
                              setPasswordRules({ length: false, uppercase: false, number: false });
                              setPasswordUsed(false);
                            }}
                          >
                            Cancelar cambio de contraseña
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
>>>>>>> josue
=======
                ) : (
                  <div className="profile-row darkable">********</div>
                )}
>>>>>>> 6cde0a0ed69e2640b9b6200b663910c42e33fb8d
              </div>

              <span className="profile-label">Área</span>
              <div className="content-profile-row">
                <div className="profile-row darkable">{empleado.CARGO}</div>
              </div>
            </div>

<<<<<<< HEAD
            <div className="modal-footer-profile darkable">
              <button className="logout-btn" onClick={() => { logout(); setShowProfileModal(false); navigate("/"); }}>
                Cerrar Sesión
              </button>
=======
            {/* Footer */}
            <div className="modal-footer-profile">
              {!isEditing && (
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
              )}
>>>>>>> josue
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
