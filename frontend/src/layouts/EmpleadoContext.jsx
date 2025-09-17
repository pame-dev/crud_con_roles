// define un contexto global de React para manejar la sesión del empleado.
// Sirve para compartir la información del empleado logueado en toda la aplicación sin tener que pasarla como props entre componentes.
// También incluye una función para cerrar sesión que limpia el estado y el almacenamiento local.


import { createContext, useState } from "react";

export const EmpleadoContext = createContext();

// empleado: objeto con los datos del empleado logueado o null si no hay sesión.
export const EmpleadoProvider = ({ children }) => {
  const [empleado, setEmpleado] = useState(() => {  //setEmpleado: función para actualizar la información del empleado.
    const saved = localStorage.getItem("empleado");
    return saved ? JSON.parse(saved) : null;
  });

  //logout: función para cerrar sesión, limpia el estado y localStorage.
  const logout = () => { 
    localStorage.removeItem("empleado");  //  Limpia localStorage
    setEmpleado(null); //  Limpia el contexto global
  };

  return (
    <EmpleadoContext.Provider value={{ empleado, setEmpleado, logout }}>
      {children}
    </EmpleadoContext.Provider>
  );
};
