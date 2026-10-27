import { BookOpenCheck, HeartHandshake, Lightbulb, MapPinned } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Nosotros() {
  return (
    <main>
      <section className="interior-hero">
        <div className="container page-container">
          <div className="eyebrow">
            <span className="eyebrow-dot" /> NUESTRA HISTORIA
          </div>
          <h1>
            Conoce EduBío<span>360</span>
          </h1>
          <p>
            Creemos que una buena decisión educativa comienza cuando la información se vuelve fácil
            de encontrar y comprender.
          </p>
        </div>
      </section>
      <section className="container page-container section-space about-layout">
        <div>
          <span className="eyebrow">QUIÉNES SOMOS</span>
          <h2>
            Más claridad para <em>cada futuro.</em>
          </h2>
          <p>
            EduBío360 es un prototipo académico de orientación sobre educación superior en la Región
            del Biobío. Reunimos una selección de datos históricos sobre carreras, instituciones,
            comunas y aranceles en una experiencia fácil de explorar.
          </p>
          <p>
            Nuestro objetivo es apoyar las primeras etapas de búsqueda, sin reemplazar los canales
            oficiales de admisión ni la información vigente de cada institución.
          </p>
          <Link className="btn btn-dark rounded-pill px-4 py-3" to="/carreras">
            Explorar el catálogo
          </Link>
        </div>
        <div className="about-visual">
          <span className="about-visual-small">CONSTRUIDO PARA</span>
          <strong>TI.</strong>
          <span className="about-visual-bottom">BIOBÍO · CHILE</span>
        </div>
      </section>
      <section className="about-values">
        <div className="container page-container section-space">
          <div className="eyebrow">LO QUE NOS MUEVE</div>
          <h2>Información que abre caminos.</h2>
          <div className="benefit-grid">
            <article className="benefit-card">
              <Lightbulb size={30} />
              <h3>Claridad</h3>
              <p>Presentar distintas opciones con un lenguaje cercano y comprensible.</p>
            </article>
            <article className="benefit-card">
              <MapPinned size={30} />
              <h3>Identidad local</h3>
              <p>Dar visibilidad a alternativas vinculadas con la Región del Biobío.</p>
            </article>
            <article className="benefit-card">
              <HeartHandshake size={30} />
              <h3>Acompañamiento</h3>
              <p>Animar a estudiantes y familias a investigar y contrastar información.</p>
            </article>
          </div>
        </div>
      </section>
      <section className="container page-container section-space text-center">
        <BookOpenCheck size={34} className="mb-3" />
        <h2>¿Comenzamos?</h2>
        <p>Tu búsqueda puede empezar hoy.</p>
        <Link to="/carreras" className="btn btn-warning rounded-pill px-5 py-3 fw-semibold">
          Ver carreras
        </Link>
      </section>
    </main>
  );
}
