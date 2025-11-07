// src/pages/Equipo.js
import React from "react";
import { Linkedin } from "lucide-react";

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
    linkedin:
      "https://www.linkedin.com/in/daira-pamela-rodriguez-gomez-167452324/",
    color: "#ff4e4e",
  },
  {
    nombre: "Nancy Laureano",
    rol: "Scrum Master",
    img: nancyImg,
    linkedin:
      "https://www.linkedin.com/in/nancy-laureano-a155b7324?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    color: "#ff784e",
  },
  {
    nombre: "Josue Aguilar",
    rol: "Encargado BD",
    img: josueImg,
    linkedin: "https://github.com/JosuenahumNEO",
    color: "#ffb14e",
  },
  {
    nombre: "Melany Hernandez",
    rol: "Front-end",
    img: melanyImg,
    linkedin:
      "https://www.linkedin.com/in/melany-guadalupe-hernandez-vazquez-01a99a324/?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    color: "#ff4ec9",
  },
  {
    nombre: "Juan Angelina",
    rol: "Back-end",
    img: juanImg,
    linkedin:
      "https://www.linkedin.com/in/juan-pablo-angelina-murillo-b63380284/",
    color: "#4e9dff",
  },
  {
    nombre: "Jahir Santana",
    rol: "Back-end",
    img: jahirImg,
    linkedin:
      "https://www.linkedin.com/in/jahir-espitia-santana-883997356/",
    color: "#6cff7d",
  },
];

const Equipo = () => {
  return (
    <section
      style={{
        minHeight: "100vh",
        padding: "5rem 2rem 4rem",
        color: "white",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "3rem",
          fontWeight: "bold",
          marginBottom: "1rem",
        }}
      >
        Equipo de Desarrolladores
      </h1>
      <p
        style={{
          top: "1rem",
          fontSize: "1.2rem",
          color: "rgba(255,255,255,0.8)",
          marginBottom: "3rem",
        }}
      >
        Conoce a las personas detrás del sistema de turnos{" "}
        <b>Turnomatico</b>.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "2rem",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {equipo.map((persona, index) => (
          <div
            key={index}
            className="team-card"
            style={{
              position: "relative",
              background: "#1c1c1c",
              borderRadius: "18px",
              overflow: "hidden",
              boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              cursor: "pointer",
            }}
            onClick={() => window.open(persona.linkedin, "_blank")}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow =
                "0 15px 35px rgba(0,0,0,0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 10px 25px rgba(0,0,0,0.4)";
            }}
          >
            {/* Fondo decorativo */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: `linear-gradient(135deg, ${persona.color}66, transparent 80%)`,
                zIndex: 0,
              }}
            />
            

            {/* Imagen */}
            <div
              style={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                justifyContent: "center",
                marginTop: "2rem",
              }}
            >
              <img
                src={persona.img}
                alt={persona.nombre}
                style={{
                  width: "110px",
                  height: "110px",
                  borderRadius: "50%",
                  border: `4px solid ${persona.color}`,
                  objectFit: "cover",
                }}
              />
            </div>

            {/* Texto */}
            <div style={{ padding: "1.5rem 1rem 2rem", zIndex: 1, position: "relative" }}>
              <h3
                style={{
                  fontSize: "1.3rem",
                  fontWeight: "700",
                  color: "white",
                  margin: "0.8rem 0 0.3rem",
                }}
              >
                {persona.nombre}
              </h3>
              <p
                style={{
                  fontSize: "1rem",
                  color: "rgba(255,255,255,0.7)",
                  marginBottom: "1rem",
                }}
              >
                {persona.rol}
              </p>
              <a
                href={persona.linkedin}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  color: persona.color,
                  textDecoration: "none",
                  fontWeight: "600",
                }}
              >
                <Linkedin size={18} /> Ver perfil
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Equipo;
