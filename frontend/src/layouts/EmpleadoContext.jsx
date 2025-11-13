// define un contexto global de React para manejar la sesión del empleado.
// Sirve para compartir la información del empleado logueado en toda la aplicación sin tener que pasarla como props entre componentes.
// También incluye una función para cerrar sesión que limpia el estado y el almacenamiento local.

import { createContext, useState, useEffect, useContext } from "react";
import API_URL from "../api/config";
import ModalAlert from "../components/ModalAlert"; 

export const EmpleadoContext = createContext();

export const EmpleadoProvider = ({ children }) => {
  // Estado del empleado logueado
  const [empleado, setEmpleado] = useState(() => {
    const saved = localStorage.getItem("empleado");
    return saved ? JSON.parse(saved) : null;
  });

  // Estado global de empleados ausentes (IDs)
  const [empleadosAusentes, setEmpleadosAusentes] = useState(new Set());

  // Cargar empleados ausentes desde la API al iniciar
  useEffect(() => {
    cargarAusentes();
  }, []);

      const [modal, setModal] = useState({
      show: false,
      title: "",
      message: "",
      type: "info"
    });
  
      const showModal = (title, message, type = "info") => {
      setModal({ show: true, title, message, type });
    };
  
    const closeModal = () => setModal({ ...modal, show: false });
  const cargarAusentes = async () => {
    try {
      const res = await fetch(`${API_URL}/empleados/ausentes`);
      if (!res.ok) throw new Error("Error al obtener empleados ausentes");
      const data = await res.json();
      setEmpleadosAusentes(new Set(data.map(e => e.ID_EMPLEADO)));
    } catch (err) {
      console.error("Error al cargar empleados ausentes:", err);
    }
  };

  // Actualizar estado del empleado en la API
  const actualizarEstadoEmpleado = async (id, estado) => {
    try {
      const res = await fetch(`${API_URL}/empleados/${id}/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado }) // true = presente, false = ausente
      });
      if (!res.ok) throw new Error("Error al actualizar estado del empleado");
      return await res.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // Marcar como ausente
  const marcarAusente = async (id) => {
    try {
      await actualizarEstadoEmpleado(id, false);
      setEmpleadosAusentes(prev => new Set(prev).add(id));
    } catch (err) {
      showModal("Error", "Error al marcar como ausente", "error");
    }
  };

  // Marcar como presente
  const quitarAusente = async (id) => {
    try {
      await actualizarEstadoEmpleado(id, true);
      setEmpleadosAusentes(prev => {
        const copy = new Set(prev);
        copy.delete(id);
        return copy;
      });
    } catch (err) {
      showModal("Error", "Error al marcar como presente", "error");
    }
  };

  // Logout: limpiar sesión
  const logout = () => {
    localStorage.removeItem("empleado");
    setEmpleado(null);
  };

  return (
    <EmpleadoContext.Provider
      value={{
        empleado,
        setEmpleado,
        logout,
        empleadosAusentes,
        cargarAusentes,
        marcarAusente,
        quitarAusente
      }}
    >
      {children}
          <ModalAlert
      show={modal.show}
      title={modal.title}
      message={modal.message}
      type={modal.type}
      onClose={closeModal}
    />
  </EmpleadoContext.Provider>
  );
};

// Hook para usar el contexto
export const useEmpleados = () => useContext(EmpleadoContext);
