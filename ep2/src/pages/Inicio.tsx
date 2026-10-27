import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Compass,
  GitCompareArrows,
  MapPin,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDatos } from '../context/DatosContext';
import { OfertaCard } from '../components/molecules/OfertaCard';

const beneficios = [
  {
    icon: Compass,
    num: '01',
    title: 'Explora con confianza',
    desc: 'Descubre carreras e instituciones de educación superior en el Biobío desde un solo lugar.',
  },
  {
    icon: GitCompareArrows,
    num: '02',
    title: 'Compara tus opciones',
    desc: 'Pon distintas alternativas lado a lado para entender sus características y costos históricos.',
  },
  {
    icon: ShieldCheck,
    num: '03',
    title: 'Decide informado',
    desc: 'Usa datos como punto de partida y comprueba la información actual con cada institución.',
  },
];

export function Inicio() {
  const { ofertas } = useDatos();
  return (
    <main>
      <section className="home-hero">
        <div className="container page-container home-hero-inner">
          <div className="home-hero-copy">
            <div className="hero-kicker">
              <span className="hero-kicker-circle" />
              <span>ORIENTACIÓN ACADÉMICA · REGIÓN DEL BIOBÍO</span>
            </div>
            <h1>
              Tu futuro <em>comienza</em> aquí<span className="hero-title-dot">.</span>
            </h1>
            <p>
              Encuentra la carrera que conecta con tus sueños. Explora opciones de educación
              superior, compara alternativas y da el siguiente paso con información a tu alcance.
            </p>
            <div className="hero-cta">
              <Link to="/carreras" className="btn-hero-primary">
                Explorar carreras <ArrowUpRight size={20} />
              </Link>
              <Link to="/registro" className="btn-hero-secondary">
                Crear cuenta <ArrowRight size={19} />
              </Link>
            </div>
            <div className="hero-trust">
              <span className="hero-trust-icon">
                <MapPin size={18} />
              </span>
              <span>Hecho para estudiantes de la Región del Biobío</span>
            </div>
          </div>
          <div className="hero-artwork" aria-hidden="true">
            <div className="hero-art-orbit orbit-outer" />
            <div className="hero-art-orbit orbit-inner" />
            <div className="hero-visual-core">
              <BookOpen size={104} strokeWidth={1.1} />
            </div>
            <div className="hero-floating-label label-top">
              <Sparkles size={16} /> DESCUBRE
            </div>
            <div className="hero-floating-label label-bottom">
              TU CAMINO <ArrowUpRight size={18} />
            </div>
            <div className="hero-art-corner top-left" />
            <div className="hero-art-corner bottom-right" />
            <span className="hero-art-index">360°</span>
          </div>
        </div>
        <div className="container page-container hero-stats">
          <div>
            <strong>{ofertas.length}</strong>
            <span>ofertas de muestra</span>
          </div>
          <div>
            <strong>Biobío</strong>
            <span>región en foco</span>
          </div>
          <div>
            <strong>2021</strong>
            <span>datos históricos</span>
          </div>
          <p>
            Una plataforma de orientación creada para impulsar mejores preguntas y mejores
            decisiones.
          </p>
        </div>
      </section>

      <section className="benefits-section container page-container section-space">
        <div className="section-head">
          <div>
            <div className="eyebrow">
              <span className="eyebrow-dot" /> ASÍ TE AYUDAMOS
            </div>
            <h2>
              Un mundo de posibilidades.
              <br />
              <span>Un lugar para descubrirlas.</span>
            </h2>
          </div>
          <p>
            Organizamos información académica para que cada paso de tu búsqueda sea un poco más
            sencillo.
          </p>
        </div>
        <div className="benefit-grid">
          {beneficios.map((b) => (
            <article className="benefit-card" key={b.num}>
              <div className="benefit-top">
                <span className="benefit-icon">
                  <b.icon size={27} />
                </span>
                <span className="benefit-number">{b.num}</span>
              </div>
              <h3>{b.title}</h3>
              <p>{b.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="featured-section">
        <div className="container page-container section-space">
          <div className="section-head align-items-end">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-dot" /> INSPÍRATE
              </div>
              <h2>
                Explora algunas <span>opciones.</span>
              </h2>
            </div>
            <Link className="section-link" to="/carreras">
              Ver todo el catálogo <ArrowUpRight size={20} />
            </Link>
          </div>
          <div className="ofertas-grid">
            {ofertas.slice(0, 3).map((o) => (
              <OfertaCard key={o.id} oferta={o} />
            ))}
          </div>
        </div>
      </section>

      <section className="home-cta-section">
        <div className="container page-container">
          <div className="home-cta-content">
            <div className="eyebrow">EL SIGUIENTE PASO ES TUYO</div>
            <h2>
              Las grandes historias
              <br />
              <em>comienzan con una decisión.</em>
            </h2>
            <p>Explora el catálogo y descubre qué opciones podrían acercarte a tus metas.</p>
            <Link to="/carreras" className="btn-hero-primary">
              Encuentra tu carrera <ArrowUpRight size={20} />
            </Link>
          </div>
          <div className="home-cta-symbol" aria-hidden="true">
            360°
          </div>
        </div>
      </section>
    </main>
  );
}
