// Hook personalizado para manejar el estado de "diaFinalizado" sincronizado con localStorage
import { useState, useEffect } from 'react';

export const useDiaFinalizado = () => {
  const [diaFinalizado, setDiaFinalizadoState] = useState(
    localStorage.getItem("diaFinalizado") === "true"
  );

  useEffect(() => {
    // Función para actualizar el estado desde localStorage
    const updateStateFromStorage = () => {
      const value = localStorage.getItem("diaFinalizado") === "true";
      setDiaFinalizadoState(value);
    };

    // Escuchar cambios en localStorage de otras pestañas
    const handleStorageChange = (e) => {
      if (e.key === "diaFinalizado") {
        setDiaFinalizadoState(e.newValue === "true");
      }
    };

    // Escuchar cambios dentro de la misma pestaña cada segundo
    const interval = setInterval(updateStateFromStorage, 1000);

    // Agregar event listeners
    window.addEventListener('storage', handleStorageChange);

    // Limpieza
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Función para setear el valor que también actualiza localStorage
  const setDiaFinalizado = (value) => {
    localStorage.setItem("diaFinalizado", value.toString());
    setDiaFinalizadoState(value);
    // Disparar evento manualmente para notificar a otros componentes
    window.dispatchEvent(new Event('storage'));
  };

  return [diaFinalizado, setDiaFinalizado];
};