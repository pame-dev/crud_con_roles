// App incluye router y rutas, tambien algunas configuraciones globales

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import './styles/custom.css';
import './i18n/i18n';
import Equipo from "./pages/equipo";

import { useLocation } from 'react-router-dom';

// Páginas
import Dashboard from "./pages/dashboard";
import PantallaCompleta from "./pages/pantalla_completa";
import FormularioTurno from "./pages/formulario_turno";
import Login from "./pages/login";
import VistaGerente from "./pages/vista_gerente";
import VistaTrabajador from './pages/vista_trabajador';
import VistaSuperadministrador from "./pages/vista_superadministrador";
import Historial from './pages/historial';
import { EmpleadoProvider } from "./layouts/EmpleadoContext";
import RegisterGerentes from './pages/register_gerentes_y_trabajadores';
import RegisterTrabajadores from './pages/register_trabajadores';
import AdministrarEmpleados from "./pages/administrar_empleados";
import RequireRoleLocal from "./pages/RequireRoleLocal";
import OlvideMiContrasena from './pages/olvide_mi_contrasena';
import ReestablecerContrasena from './pages/reestablecer_contrasena';
import EditarEmpleado from './pages/editar_empleado';
import TerminosYCondiciones from './pages/terminos_y_condiciones';
import { DarkModeProvider, useDarkMode } from "./layouts/DarkModeContext";
import {AudioProvider} from "./components/AudioContext";
import Graficas from "./pages/graficas";
// Layout condicional
const AppLayout = ({ children }) => {
  const location = useLocation();
  
  // Rutas que no deben mostrar header ni footer
  const noHeaderFooterRoutes = ['/pantalla_completa'];
  
  // Rutas que solo deben mostrar header pero no footer
  const noFooterRoutes = ['#']; // Agrega aquí otras rutas si es necesario
  
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
    <EmpleadoProvider>
      <DarkModeProvider>
        <AudioProvider> {/* Se agregó aquí el proveedor global de audio */}
          <Router>
            <AppLayout>
              <Routes>
                <Route path="/equipo" element={<Equipo />} />
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/pantalla_completa" element={<PantallaCompleta />} />
                <Route path="/formulario_turno" element={<FormularioTurno />} />
                <Route path="/login" element={<Login />} />
                <Route path="/vista_gerente" element={<VistaGerente />} />
                <Route path="/vista_trabajador" element={<VistaTrabajador />} />
                <Route path="/vista_superadministrador" element={<VistaSuperadministrador />} />
                <Route path="/historial" element={<Historial />} />
                <Route path="/register_gerentes_y_trabajadores" element={<RegisterGerentes />} />
                <Route path="/register_trabajadores" element={<RegisterTrabajadores />} />
                <Route path="/administrar_empleados" element={<AdministrarEmpleados />} />
                <Route path="/administrar_empleados" element={
                  <RequireRoleLocal roles={['superadmin', 'gerente']}>
                    <AdministrarEmpleados />
                  </RequireRoleLocal>
                }/>
                <Route path="/olvide_mi_contrasena" element={<OlvideMiContrasena />} />
                <Route path='/reestablecer_contrasena' element={<ReestablecerContrasena />} />
                <Route path='/editar_empleado' element={<EditarEmpleado />} />
                <Route path="/editar_empleado/:id" element={<EditarEmpleado />} />
                <Route path="/terminos_y_condiciones" element={<TerminosYCondiciones />} />
                <Route path="/graficas" element={<Graficas />} />
              </Routes>
            </AppLayout>
          </Router>
        </AudioProvider> {/*cierre del proveedor */}
      </DarkModeProvider>
    </EmpleadoProvider>
  );
};
export default PitLineApp;