import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, TrendingUp, Tv, Pencil, Globe, Save, X, Eye, EyeOff } from "lucide-react"; // ✅ un solo import
import logo from "../assets/logo-rojo.png";
import './header.css';
import { EmpleadoContext } from "./EmpleadoContext";
import { actualizarEmpleado, verificarContrasena } from "../api/empleadosApi";
import { useTranslation } from "react-i18next";

// import React from "react"; // ya no es necesario importar React en versiones recientes si solo usas JSX, importar dos veces react genera errores (ya esta declarado en la linea 1)

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const { empleado, logout } = useContext(EmpleadoContext); //setEmpleado eliminado, antes de " , logout"
  const [showModal, setShowModal] = useState(false); //valor predeterminado para el modal (oculto) se pasara a true cuando se presione 
  const [isEditing, setIsEditing] = useState(false); // Estado para editar perfil(modal)
  const [formData, setFormData] = useState({...empleado}); // Estado para los datos del formulario

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

  const soloUsuario = [
    "/vista_gerente",
    "/vista_trabajador",
    "/vista_superadministrador",
    "/historial",
    "/administrar_empleados",
    "/register_gerentes_y_trabajadores",
    "/register_trabajadores"
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

// ╔═══════════════════════════════╗
// ║           EDITAR              ║
// ╚═══════════════════════════════╝
// con esste bloque se pueden manejar los cambios en los inputs del modal mas no se guardaran aún 
  const handleChange = (e) => {
    const { name, value } = e.target;
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
  };

// ╔═══════════════════════════════╗
// ║           GUARDAR             ║
// ╚═══════════════════════════════╝
// Esta función se llamará cuando el usuario haga clic en "Guardar" en el modal (vaya, esto guarda los datos editados)
  const handleSave = () => {
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
      });
  };

// ╔═══════════════════════════════╗
// ║           CANCELAR            ║
// ╚═══════════════════════════════╝
  //se llamara esta funcion cuando el usuarioo haga clic en cancelar
  const handleCancel = () => {
    setIsEditing(false);
    setFormData({...empleado}); // Restablece los datos al estado original del empleado
    setIsPasswordEditing(false);
    setConfirmPassword('');
    setPasswordRules({ length: false, uppercase: false, number: false });
    setPasswordUsed(false);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark navbar-custom fixed-top full-width-container">
        <div className="container-fluid">

          {/* Logo */}
          <Link to="#" className="navbar-brand d-flex align-items-center">
            <img src={logo} alt="PitLine Logo" className="logo-image" />
            <div>
              <h4 className="mb-0 fw-bold">PitLine</h4>
              <small className="text-light opacity-75">
                Acelera tu servicio
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
            onClick={(e) => {
              return e.stopPropagation();
            }} // Evita que el click dentro cierre el modal
          >
            {/* Encabezado con imagen y nombre */}
            <div className="modal-header-profile">
              <div>
                <h5 className="profile-name">{empleado.NOMBRE}</h5>
                <p className="profile-email">{empleado.CORREO}</p>
              </div>

              {/* NUEVO: lápiz / guardar / cancelar */}
              {!isEditing ? (
                <button className="edit-btn" onClick={() => {
                  setFormData({...empleado}); // Siempre cargar datos actuales al iniciar edición
                  setIsEditing(true);
                }}>
                  <Pencil size={16} />
                </button>
              ) : (
                <div className="d-flex gap-2">
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
                </div>
              )}

            </div>

            {/* Opciones */}
            <div className="modal-options">
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
                  <div className="profile-row">{empleado.NOMBRE}</div>
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
                  />
                ) : (
                  <div className="profile-row">{empleado.CORREO}</div>
                )}
              </div>

              <span className="profile-label">Contraseña</span>
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
              </div>

              <span className="profile-label">Area</span>
              <div className="content-profile-row">
                {isEditing ? (
                  <input
                    type="text"
                    name="CARGO"
                    value={formData.CARGO}
                    onChange={handleChange}
                    className="profile-input"
                  />
                ) : (
                  <div className="profile-row">{empleado.CARGO}</div>
                )}
              </div>

            </div>

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
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
