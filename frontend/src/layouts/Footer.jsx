// components/Footer.js
import React from 'react';
import { Phone, MapPin, Users } from 'lucide-react';

const footerStyles = `
  .footer {
    background: linear-gradient(90deg, #212529 0%, #dc3545 50%, #212529 100%);
    color: white;
    padding: 2rem 1rem;
    margin-top: 4rem;
  }

  .footer a {
    color: #ffffffcc;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .footer a:hover {
    color: #ffffff;
  }

  .footer .footer-title {
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .footer .footer-row {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    justify-content: space-between;
  }

  .footer .footer-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 150px;
  }

  .footer .footer-bottom {
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
    <footer className="footer full-width-container">
      <style>{footerStyles}</style>
      <div className="footer-row">
        <div className="footer-item">
          <span className="footer-title">Contacto</span>
          <div className="d-flex align-items-center">
            <Phone size={16} className="me-2" />
            <span>+52 123 456 7890</span>
          </div>
          <div className="d-flex align-items-center">
            <MapPin size={16} className="me-2" />
            <span>Manzanillo, Colima, México</span>
          </div>
        </div>
        <div className="footer-item">
          <span className="footer-title">Sobre PitLine</span>
          <p style={{ fontSize: '0.9rem' }}>
            PitLine es tu taller mecánico de confianza en Manzanillo. Sistema de turnos rápido y eficiente.
          </p>
        </div>
        <div className="footer-item">
          <span className="footer-title">Equipo</span>
          <div className="d-flex align-items-center">
            <Users size={16} className="me-2" />
            <span>Personal capacitado y profesional</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} PitLine. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
