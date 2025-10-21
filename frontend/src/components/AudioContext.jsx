import React, { createContext, useState, useContext, useEffect } from "react";

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [audioEnabled, setAudioEnabled] = useState(() => {
    // lee el valor guardado al cargar
    const saved = localStorage.getItem("audioEnabled");
    return saved ? JSON.parse(saved) : true; // por defecto true (sonido activado)
  });

  // guarda el valor cada vez que cambie
  useEffect(() => {
    localStorage.setItem("audioEnabled", JSON.stringify(audioEnabled));
  }, [audioEnabled]);

  const toggleAudio = () => setAudioEnabled(prev => !prev);

  return (
    <AudioContext.Provider value={{ audioEnabled, toggleAudio }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
