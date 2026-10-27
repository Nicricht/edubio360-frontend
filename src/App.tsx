import { Navigate, Route, Routes } from 'react-router-dom';
import { type ReactNode } from 'react';
import { SiteHeader } from './components/organisms/SiteHeader';
import { Footer } from './components/organisms/Footer';
import { Inicio } from './pages/Inicio';
import { Catalogo } from './pages/Catalogo';
import { DetalleOferta } from './pages/DetalleOferta';
import { Comparador } from './pages/Comparador';
import { Nosotros } from './pages/Nosotros';
import { Novedades } from './pages/Novedades';
import { NovedadDetalle } from './pages/NovedadDetalle';
import { Contacto } from './pages/Contacto';
import { Login } from './pages/Login';
import { Registro } from './pages/Registro';
import { AdminOfertas } from './pages/AdminOfertas';
import { AdminOfertaForm } from './pages/AdminOfertaForm';
import { AdminUsuarios } from './pages/AdminUsuarios';
import { AdminUsuarioForm } from './pages/AdminUsuarioForm';
import { NoEncontrada } from './pages/NoEncontrada';
import { SesionProvider, useSesion } from './context/SesionContext';
import { OrientacionProvider } from './context/OrientacionContext';
import { destinoRol } from './services/auth';
import type { Usuario } from './types';
import { MapaSedes } from './pages/MapaSedes';
import { PanelRol } from './pages/PanelRol';
import { SolicitarOrientacion } from './pages/SolicitarOrientacion';
import { Solicitudes } from './pages/Solicitudes';
import { GestionSolicitud } from './pages/GestionSolicitud';
import { Notificaciones } from './pages/Notificaciones';
import { Perfil } from './pages/Perfil';

function Protegida({ rol, children }: { rol: Usuario['rol']; children: ReactNode }) {
  const { sesion } = useSesion();
  if (!sesion) return <Navigate to="/login" replace />;
  if (sesion.rol !== rol) return <Navigate to={destinoRol(sesion.rol)} replace />;
  return children;
}

function Rutas() {
  return (
    <div className="app-shell">
      <SiteHeader />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/carreras" element={<Catalogo />} />
        <Route path="/carreras/:id" element={<DetalleOferta />} />
        <Route path="/comparar" element={<Comparador />} />
        <Route path="/mapa" element={<MapaSedes />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/novedades" element={<Novedades />} />
        <Route path="/novedades/:id" element={<NovedadDetalle />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/solicitar" element={<Protegida rol="Estudiante"><SolicitarOrientacion /></Protegida>} />
        <Route path="/estudiante" element={<Protegida rol="Estudiante"><PanelRol /></Protegida>} />
        <Route path="/estudiante/solicitudes" element={<Protegida rol="Estudiante"><Solicitudes /></Protegida>} />
        <Route path="/estudiante/historial" element={<Protegida rol="Estudiante"><Solicitudes /></Protegida>} />
        <Route path="/estudiante/notificaciones" element={<Protegida rol="Estudiante"><Notificaciones /></Protegida>} />
        <Route path="/estudiante/perfil" element={<Protegida rol="Estudiante"><Perfil /></Protegida>} />
        <Route path="/orientador" element={<Protegida rol="Orientador"><PanelRol /></Protegida>} />
        <Route path="/orientador/solicitudes" element={<Protegida rol="Orientador"><Solicitudes /></Protegida>} />
        <Route path="/orientador/historial" element={<Protegida rol="Orientador"><Solicitudes /></Protegida>} />
        <Route path="/orientador/solicitudes/:id" element={<Protegida rol="Orientador"><GestionSolicitud /></Protegida>} />
        <Route path="/orientador/perfil" element={<Protegida rol="Orientador"><Perfil /></Protegida>} />
        <Route path="/admin" element={<Protegida rol="Administrador"><PanelRol /></Protegida>} />
        <Route path="/admin/ofertas" element={<Protegida rol="Administrador"><AdminOfertas /></Protegida>} />
        <Route path="/admin/ofertas/nueva" element={<Protegida rol="Administrador"><AdminOfertaForm /></Protegida>} />
        <Route path="/admin/ofertas/:id/editar" element={<Protegida rol="Administrador"><AdminOfertaForm /></Protegida>} />
        <Route path="/admin/usuarios" element={<Protegida rol="Administrador"><AdminUsuarios /></Protegida>} />
        <Route path="/admin/usuarios/nuevo" element={<Protegida rol="Administrador"><AdminUsuarioForm /></Protegida>} />
        <Route path="/admin/usuarios/:id/editar" element={<Protegida rol="Administrador"><AdminUsuarioForm /></Protegida>} />
        <Route path="/admin/solicitudes" element={<Protegida rol="Administrador"><Solicitudes /></Protegida>} />
        <Route path="*" element={<NoEncontrada />} />
      </Routes>
      <Footer />
    </div>
  );
}

export function App() {
  return <SesionProvider><OrientacionProvider><Rutas /></OrientacionProvider></SesionProvider>;
}
