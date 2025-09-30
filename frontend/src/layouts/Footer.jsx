// components/Footer.js
import React from "react";
import { Phone, MapPin, Users } from "lucide-react";

const footerStyles = `
  .footer {
    position: relative;
    background: linear-gradient(135deg, #1a1a1a 0%, #dc3545 50%, #1a1a1a 100%);
    color: white;
    padding: 3rem 2rem 2rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    overflow: hidden;
  }

  .footer-row {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    justify-content: space-evenly;
    text-align: center;
  }

  .footer .footer-title {
    font-weight: bold;
    margin-bottom: 1rem;
    font-size: 1.2rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    position: relative;
  }

  .footer .footer-title::after {
    content: "";
    display: block;
    width: 40px;
    height: 3px;
    background: #ffc107;
    margin: 0.5rem auto;
    border-radius: 2px;
  }

  .footer .footer-item {
    flex: 1 1 250px;
    max-width: 300px;
  }

  .footer .footer-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    background: rgba(255,255,255,0.1);
    padding: 0.6rem 1rem;
    border-radius: 50px;
    margin: 0.5rem auto;
    width: fit-content;
    transition: all 0.3s ease;
    color: white;
    text-decoration: none;
  }

  .footer .footer-icon:hover {
    background: rgba(255,255,255,0.2);
    transform: scale(1.05);
  }

  .footer .footer-icon svg {
    color: #ffc107;
  }

  .footer-bottom {
    margin-top: 2rem;
    border-top: 1px solid rgba(255,255,255,0.2);
    padding-top: 1rem;
    text-align: center;
    font-size: 0.9rem;
    opacity: 0.8;
  }
`;

const Footer = () => {
  return (
    <div style={{ position: 'relative' }}>
      {/* Ola superior decorativa */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100px' }}
      >
        <path
          fill="#1a1a1a"
          d="M0,64L48,90.7C96,117,192,171,288,170.7C384,171,480,117,576,96C672,75,768,85,864,112C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
        />
      </svg>

      <footer className="footer full-width-container">
        <style>{footerStyles}</style>
        <div className="footer-row">
          <div className="footer-item">
            <span className="footer-title">Contacto</span>
            <div className="footer-icon">
              <Phone size={20} />
              <span>+52 314 148 2608</span>
            </div>
            <a
              href="https://www.google.com/maps/place/Facultad+de+Ingenier%C3%ADa+Electromec%C3%A1nica+(FIE)/@19.1239095,-104.4025857,17z/data=!3m1!4b1!4m6!3m5!1s0x84255a99f51cf4b5:0x71073f9935f08f0a!8m2!3d19.1239095!4d-104.4000108!16s%2Fg%2F124ylkqb8?entry=ttu&g_ep=EgoyMDI1MDkyOC4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-icon"
            >
              <MapPin size={20} />
              <span>Manzanillo, Colima, México</span>
            </a>
          </div>

          <div className="footer-item">
            <span className="footer-title">Sobre PitLine</span>
            <p style={{ fontSize: "0.95rem", lineHeight: "1.5" }}>
              PitLine es tu taller mecánico de confianza en Manzanillo. 
              Nuestro sistema de turnos rápido y eficiente asegura que tu vehículo
              siempre reciba atención a tiempo.
            </p>
          </div>

          <div className="footer-item">
            <span className="footer-title">Equipo</span>
            <a href="/equipo" className="footer-icon">
              <Users size={20} />
              <span>Personal capacitado y profesional</span>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} PitLine. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};

export default Footer;
