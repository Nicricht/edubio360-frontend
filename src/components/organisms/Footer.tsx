import { ArrowUpRight, GraduationCap, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container page-container footer-main">
        <div>
          <div className="footer-brand">
            <GraduationCap size={24} /> EduBío<span>360</span>
          </div>
          <p>
            Información clara para tomar decisiones sobre tu futuro académico en la Región del
            Biobío.
          </p>
          <span className="footer-location">
            <MapPin size={15} /> Biobío, Chile
          </span>
        </div>
        <div>
          <h2>Explora</h2>
          <Link to="/carreras">Carreras</Link>
          <Link to="/comparar">Comparador</Link>
          <Link to="/novedades">Novedades</Link>
        </div>
        <div>
          <h2>EduBío360</h2>
          <Link to="/nosotros">Nosotros</Link>
          <Link to="/contacto">Contacto</Link>
          <Link to="/registro">Crear cuenta</Link>
        </div>
        <div className="footer-highlight">
          <span>¿LISTO PARA COMENZAR?</span>
          <p>Tu próxima gran decisión empieza con una búsqueda.</p>
          <Link to="/carreras">
            Descubrir opciones <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
      <div className="container page-container footer-bottom">
        <span>© 2026 EduBío360 · Proyecto académico</span>
        <span>Datos referenciales históricos 2021 · No es un portal oficial de admisión.</span>
      </div>
    </footer>
  );
}
