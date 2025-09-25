import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, TrendingUp, Tv, Pencil, Globe, Save, X, Eye, EyeOff } from "lucide-react"; 
import logo from "../assets/logo-rojo.png";
import './header.css';
import { EmpleadoContext } from "./EmpleadoContext";
import { actualizarEmpleado } from "../api/empleadosApi";
import { useTranslation } from "react-i18next";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const { empleado, setEmpleado, logout } = useContext(EmpleadoContext);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    NOMBRE: "",
    CORREO: "",
    CARGO: "",
    CONTRASENA: "",
  });
  const [showPassword, setShowPassword] = useState(false);

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
  const toggleLanguage = () => i18n.changeLanguage(i18n.language === "es" ? "en" : "es");

  // Sincronizar formData con empleado cuando cambie
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

  // Colapsar navbar al cambiar ruta
  useEffect(() => {
    const navbar = document.getElementById("navbarNav");
    if (navbar && navbar.classList.contains("show")) {
      const collapse = new window.bootstrap.Collapse(navbar, { toggle: false });
      collapse.hide();
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const datosActualizados = {
      nombre: formData.NOMBRE.trim(),
      correo: formData.CORREO.trim(),
      cargo: formData.CARGO.trim(),
      ...(formData.CONTRASENA ? { contrasena: formData.CONTRASENA } : {}),
    };


    if (!datosActualizados.nombre || !datosActualizados.correo || !datosActualizados.cargo) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    actualizarEmpleado(empleado.ID_EMPLEADO, datosActualizados)
      .then(res => {
        alert("Perfil actualizado correctamente");
        setIsEditing(false);
        setShowModal(false);

        setEmpleado(res.empleado);
        
        localStorage.setItem("empleado", JSON.stringify(res.empleado));
      })
      .catch(err => {
        if (err.errors) {
          const mensajes = Object.values(err.errors).flat().join("\n");
          alert("Error al actualizar perfil:\n" + mensajes);
        } else if (err.message) {
          alert("Error al actualizar perfil: " + err.message);
        } else if (err.error) {
          alert("Error al actualizar perfil: " + err.error);
        } else {
          alert("Error al actualizar perfil: Error desconocido");
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
                  <Link to="/" className={`nav-link d-flex align-items-center ${location.pathname === "/" ? "active" : ""}`}>
                    <TrendingUp size={20} className="me-2" /> Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/pantalla_completa" className={`nav-link d-flex align-items-center ${location.pathname === "/pantalla_completa" ? "active" : ""}`}>
                    <Tv size={20} className="me-2" /> Pantalla Completa
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="#" className="nav-link d-flex align-items-center" onClick={(e) => { e.preventDefault(); toggleLanguage(); }}>
                    <Globe size={20} className="me-2" /> {t("traducir")}
                  </Link>
                </li>
              </ul>
            )}
            <div className="ms-auto">
              <button className="btn btn-danger d-flex align-items-center btn-login" onClick={() => {
                if (location.pathname === "/" || location.pathname === "/login") navigate("/login");
                else setShowModal(true);
              }}>
                <User size={16} className="me-2" /> {!mostrarSoloUsuario && "Iniciar Sesión"}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {showModal && empleado && (
        <div className="custom-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="custom-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header-profile">
              <div>
                <h5 className="profile-name">{empleado.NOMBRE}</h5>
                <p className="profile-email">{empleado.CORREO}</p>
              </div>

              {!isEditing ? (
                <button className="edit-btn" onClick={() => setIsEditing(true)}><Pencil size={16} /></button>
              ) : (
                <div className="d-flex gap-2">
                  <button className="edit-btn" onClick={handleSave}><Save size={16} /></button>
                  <button className="edit-btn" onClick={handleCancel}><X size={16} /></button>
                </div>
              )}
            </div>

            <div className="modal-options">
              <span className="profile-label">Nombre</span>
              <div className="content-profile-row">
                {isEditing ? (
                  <input type="text" name="NOMBRE" value={formData.NOMBRE} onChange={handleChange} className="profile-input" />
                ) : (
                  <div className="profile-row">{empleado.NOMBRE}</div>
                )}
              </div>

              <span className="profile-label">Correo</span>
              <div className="content-profile-row">
                {isEditing ? (
                  <input type="email" name="CORREO" value={formData.CORREO} onChange={handleChange} className="profile-input" />
                ) : (
                  <div className="profile-row">{empleado.CORREO}</div>
                )}
              </div>

              <span className="profile-label">Contraseña</span>
              <div className="content-profile-row d-flex align-items-center">
                {isEditing ? (
                  <>
                    <input type={showPassword ? "text" : "password"} name="CONTRASENA" value={formData.CONTRASENA} onChange={handleChange} className="profile-input me-2" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="eye-btn">
                      {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                    </button>
                  </>
                ) : <div className="profile-row">********</div>}
              </div>

              <span className="profile-label">Área</span>
              <div className="content-profile-row">
                <div className="profile-row">{empleado.CARGO}</div>
              </div>
            </div>

            <div className="modal-footer-profile">
              <button className="logout-btn" onClick={() => { logout(); setShowModal(false); navigate("/"); }}>
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
