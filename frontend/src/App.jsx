// App incluye router y rutas, tambien algunas configuraciones globales

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import './styles/custom.css';

import { useLocation } from 'react-router-dom';

// Páginas
import Dashboard from "./pages/dashboard";
import PantallaCompleta from "./pages/pantalla_completa";
import FormularioTurno from "./pages/formulario_turno";
import Login from "./pages/login";
import VistaGerente from "./pages/vista_gerente";
import VistaEmpleado from './pages/vista_empleado';
import VistaSuperadministrador from "./pages/vista_superadministrador";
import Historial from './pages/historial';

// Layout condicional
const AppLayout = ({ children }) => {
  const location = useLocation();
  
  // Rutas que no deben mostrar header ni footer
  const noHeaderFooterRoutes = ['/pantalla_completa'];
  
  // Rutas que solo deben mostrar header pero no footer
  const noFooterRoutes = ['/formulario_turno']; // Agrega aquí otras rutas si es necesario
  
  const hideHeaderFooter = noHeaderFooterRoutes.includes(location.pathname);
  const hideFooterOnly = noFooterRoutes.includes(location.pathname);

  return (
    <>
      {!hideHeaderFooter && <Header />}
      {children}
      {!hideHeaderFooter && !hideFooterOnly && <Footer />}
    </>
  );
};


const PitLineApp = () => {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pantalla_completa" element={<PantallaCompleta />} />
          <Route path="/formulario_turno" element={<FormularioTurno />} />
          <Route path="/login" element={<Login />} />
          <Route path="/vista_gerente" element={<VistaGerente />} />
          <Route path="/vista_empleado" element={<VistaEmpleado />} />
          <Route path="/vista_superadministrador" element={<VistaSuperadministrador />} />
          <Route path="/historial" element={<Historial />} />
        </Routes>
      </AppLayout>
    </Router>
  );
};
export default PitLineApp;