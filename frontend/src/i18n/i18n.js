// src/i18n/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    es: {
      translation: {
        pasarAlModulo: "Pase al módulo: {{modulo}}",
        filaActual: "Fila Actual",
        cargando: "Cargando...",
        cargandoTurnos: "Cargando turnos...",
        noTurnosPendientes: "No hay turnos pendientes",
        noTurnosPendientesCargo: "No hay turnos pendientes en {{cargo}}",
        bienvenida: "PitLine les da la Bienvenida",
        descripcionBienvenida: "Tu taller mecánico de confianza en Manzanillo. Sistema de turnos rápido y eficiente.",
        accionesRapidas: "Acciones Rápidas",
        solicitarTurno: "Solicitar Turno",
        descripcionSolicitarTurno: "Agenda tu cita de forma rápida y sencilla",
        agendarAhora: "Agendar Ahora",
        errorCargarFila: "Error al cargar la fila",
        traducir: "Traducir",
        dashboard: "Tablero",
        pantallaCompleta: "Pantalla Completa",
        iniciarSesion: "Iniciar Sesión",
        cerrarSesion: "Cerrar Sesión",
        turnoEnAtencion: "No hay turno en atención",
        reparacion: "Reparación",
        cotizacion: "Cotización",
        iniciado: "Iniciado",
        atendidoPor: "Atendido por",
        slogan: "Tu taller mecánico de confianza en Manzanillo. Sistema de turnos rápido y eficiente."
      },
    },
    en: {
      translation: {
        pasarAlModulo: "Go to module: {{modulo}}",
        filaActual: "Current Queue",
        cargando: "Loading...",
        cargandoTurnos: "Loading turns...",
        noTurnosPendientes: "No pending turns",
        noTurnosPendientesCargo: "No pending turns in {{cargo}}",
        bienvenida: "PitLine welcomes you",
        descripcionBienvenida: "Your trusted mechanic workshop in Manzanillo. Fast and efficient queue system.",
        accionesRapidas: "Quick Actions",
        solicitarTurno: "Request Turn",
        descripcionSolicitarTurno: "Book your appointment quickly and easily",
        agendarAhora: "Book Now",
        errorCargarFila: "Error loading queue",
        traducir: "Translate",
        dashboard: "Dashboard",
        pantallaCompleta: "Full Screen",
        iniciarSesion: "Log In",
        cerrarSesion: "Log Out",
        turnoEnAtencion: "No turn is being attended",
        reparacion: "Repair",
        cotizacion: "Quote",
        iniciado: "Started",
        atendidoPor: "Attended by",
        slogan: "Your trusted mechanic workshop in Manzanillo. Fast and efficient queue system."
      },
    },
  },
  lng: "es", // idioma inicial
  fallbackLng: "es",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
