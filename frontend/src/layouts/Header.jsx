import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, TrendingUp, Tv, Pencil, Globe, Save, X } from "lucide-react"; // ✅ un solo import
import logo from "../assets/logo-rojo.png";
import './header.css';
import { EmpleadoContext } from "./EmpleadoContext";
import { actualizarEmpleado } from "../api/empleadosApi";
import { useTranslation } from "react-i18next";

// import React from "react"; // ya no es necesario importar React en versiones recientes si solo usas JSX, importar dos veces react genera errores (ya esta declarado en la linea 1)

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const { empleado, logout } = useContext(EmpleadoContext); //setEmpleado eliminado, antes de " , logout"
  const [showModal, setShowModal] = useState(false); //valor predeterminado para el modal (oculto) se pasara a true cuando se presione 
  const [isEditing, setIsEditing] = useState(false); // Estado para editar perfil(modal)
  const [formData, setFormData] = useState({...empleado}); // Estado para los datos del formulario

//RECORDATORIO: terminar el editar y modificar el cancelar
//colocar en los inputs el "isEditing"
//checar composer.phar en backend

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
  };

// ╔═══════════════════════════════╗
// ║           GUARDAR             ║
// ╚═══════════════════════════════╝
// Esta función se llamará cuando el usuario haga clic en "Guardar" en el modal (vaya, esto guarda los datos editados)
  const handleSave = () => {
    // Validar datos antes de enviar
    const datosActualizados = {
      nombre: formData.NOMBRE.trim(),      // 🔹 convertimos a minúsculas
      correo: formData.CORREO.trim(),      // Hacer lo mismo para correo
      cargo: formData.CARGO.trim(),
      ...(formData.CONTRASENA ? { contrasena: formData.CONTRASENA } : {}),
    };

    // Verificar que los datos no estén vacíos
    if (!datosActualizados.nombre || !datosActualizados.correo || !datosActualizados.cargo) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    actualizarEmpleado(empleado.ID_EMPLEADO, datosActualizados)
      .then((res) => {
        alert("Perfil actualizado correctamente");
        setIsEditing(false);
        setShowModal(false);
        // Actualizar localStorage y contexto si es necesario
        localStorage.setItem("empleado", JSON.stringify(res.empleado));
        // Si tienes setEmpleado en el contexto, actualízalo aquí
      })
      .catch((err) => {
        alert("Error al actualizar perfil: " + (err?.error || "Error desconocido"));
      });
  };

// ╔═══════════════════════════════╗
// ║           CANCELAR            ║
// ╚═══════════════════════════════╝
  //se llamara esta funcion cuando el usuarioo haga clic en cancelar
  const handleCancel = () => {
    setIsEditing(false);
    setFormData({...empleado}); // Restablece los datos al estado original del empleado
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
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
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
                {isEditing ? (
                  <input
                    type="password"
                    name="CONTRASENA"
                    value={formData.CONTRASENA}
                    onChange={handleChange}
                    className="profile-input"
                  />
                ) : (
                  <div className="profile-row">{empleado.CONTRASENA}</div>
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
