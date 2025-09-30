// src/pages/Equipo.js
import React from "react";

// Importa tus imágenes locales desde la carpeta assets
import pameImg from "../assets/pame.jpeg";
import nancyImg from "../assets/nancy.jpeg";
import josueImg from "../assets/josue.jpeg";
import melanyImg from "../assets/melany.jpeg";
import juanImg from "../assets/juan.jpeg";
import jahirImg from "../assets/jahir.jpeg";

const equipo = [
  { 
    nombre: "Pamela Rodriguez", 
    rol: "Líder de Proyecto", 
    img: pameImg,
    linkedin: "https://www.linkedin.com/in/daira-pamela-rodriguez-gomez-167452324/"
  },
  { 
    nombre: "Nancy Laureano", 
    rol: "Scrum Master", 
    img: nancyImg,
    linkedin: "https://www.linkedin.com/in/nancy-laureano-a155b7324?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
  },
  { 
    nombre: "Josue Aguilar", 
    rol: "Encargado BD", 
    img: josueImg,
    linkedin: "https://github.com/JosuenahumNEO"
  },
  { 
    nombre: "Melany Hernandez", 
    rol: "Front-end", 
    img: melanyImg,
    linkedin: "https://www.linkedin.com/in/melany-guadalupe-hernandez-vazquez-01a99a324/?utm_source=share_via&utm_content=profile&utm_medium=member_android"
  },
  { 
    nombre: "Juan Angelina", 
    rol: "Back-end", 
    img: juanImg,
    linkedin: "https://www.linkedin.com/in/juan-pablo-angelina-murillo-b63380284/"
  },
  { 
    nombre: "Jahir Santana", 
    rol: "Back-end", 
    img: jahirImg,
    linkedin: "https://www.linkedin.com/in/jahir-espitia-santana-883997356/"
  },
];

const Equipo = () => {
  return (
    <div 
      style={{ 
        padding: "3rem -2rem", 
        textAlign: "center", 
        background: "rgba(255, 73, 73, 0.6)",
        margin: "0rem",
      }}
    >
      <h1 style={{ marginTop: "5rem", marginBottom: "1rem", color: "#ffffffff", fontWeight: "bold", fontSize: "3rem" }}>
        Equipo de Desarrolladores
      </h1>
      <p style={{ marginBottom: "2rem", fontSize: "1.5rem", color: "#f5f5f5b0",  }}>
        Conoce a las personas detrás del sistema de turnos <b>Turnomatico</b>.
      </p>

      <div
        style={{
          display: "grid",
          gap: "2rem",
          padding: "0 2rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        }}
      >
        {equipo.map((persona, index) => (
          <div
            key={index}
            onClick={() => window.open(persona.linkedin, "_blank")}
            style={{
              background: "linear-gradient(135deg, #c9c9c9ff, #ffffffd6)", // 🔹 Más claro
              padding: "2rem 1.5rem",
              borderRadius: "16px",
              color: "#1a1a1a",
              boxShadow: "0 6px 16px rgba(0,0,0,0.3)",
              cursor: "pointer",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 10px 24px rgba(0,0,0,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.3)";
            }}
          >
            <img
              src={persona.img}
              alt={persona.nombre}
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #dc3545",
                marginBottom: "1rem",
              }}
            />
            <h3 style={{ margin: "0.5rem 0", fontSize: "1.2rem", color: "#dc3545" }}>
              {persona.nombre}
            </h3>
            <p style={{ margin: 0, fontSize: "0.95rem", color: "#333" }}>
              {persona.rol}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Equipo;
