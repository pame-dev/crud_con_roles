// src/context/DarkModeContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  // Leer modo desde localStorage o por defecto "false"
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Cada vez que cambie, guardarlo en localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // (opcional) Aplicar clase al <body> para CSS global
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => useContext(DarkModeContext);
