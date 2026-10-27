import { useState } from 'react';
import { ArrowUpRight, Menu, X, GitCompareArrows } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Brand } from '../atoms/Brand';
import { useDatos } from '../../context/DatosContext';
import { useSesion } from '../../context/SesionContext';
import { destinoRol } from '../../services/auth';

const links = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/carreras', label: 'Carreras' },
  { to: '/mapa', label: 'Mapa' },
  { to: '/novedades', label: 'Novedades' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/contacto', label: 'Contacto' },
];

export function SiteHeader() {
  const { comparadasIds } = useDatos();
  const { sesion, salir } = useSesion();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const [lastPath, setLastPath] = useState(location.pathname);
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname);
    setOpen(false);
  }
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Navegación principal">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? 'nav-item is-active' : 'nav-item')}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <Link to="/comparar" className="compare-shortcut">
            <GitCompareArrows size={19} />
            <span>Comparar</span>
            {comparadasIds.length > 0 && (
              <span className="compare-count">{comparadasIds.length}</span>
            )}
          </Link>
          {sesion ? <>
            <Link to={destinoRol(sesion.rol)} className="header-login">Mi panel <ArrowUpRight size={16} /></Link>
            <button type="button" className="header-login" onClick={salir}>Salir</button>
          </> : <Link to="/login" className="header-login">Ingresar <ArrowUpRight size={16} /></Link>}
        </div>
        <button
          type="button"
          className="mobile-menu-toggle"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <nav className="mobile-nav" aria-label="Navegación móvil">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end}>
              {link.label}
            </NavLink>
          ))}
          <Link to="/comparar">Comparar ({comparadasIds.length})</Link>
          {sesion ? <><Link to={destinoRol(sesion.rol)}>Mi panel</Link><button type="button" className="btn btn-link text-start" onClick={salir}>Cerrar sesión</button></> : <><Link to="/login">Ingresar</Link><Link to="/registro">Crear cuenta</Link></>}
        </nav>
      )}
    </header>
  );
}
