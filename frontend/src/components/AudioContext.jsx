import React, { createContext, useState, useContext } from "react";

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [audioEnabled, setAudioEnabled] = useState(false);

  const toggleAudio = () => setAudioEnabled(prev => !prev);

  return (
    <AudioContext.Provider value={{ audioEnabled, toggleAudio }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
