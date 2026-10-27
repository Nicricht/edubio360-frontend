import { ArrowUpRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { novedades } from '../data/novedades';

export function Novedades() {
  return (
    <main>
      <section className="interior-hero">
        <div className="container page-container">
          <div className="eyebrow">
            <span className="eyebrow-dot" /> CONSEJOS Y NOVEDADES
          </div>
          <h1>
            Ideas para <span>tu camino.</span>
          </h1>
          <p>Consejos sencillos para pensar tu futuro académico y elegir con más información.</p>
        </div>
      </section>
      <section className="container page-container section-space">
        <div className="section-head">
          <div>
            <div className="eyebrow">PARA LEER Y REFLEXIONAR</div>
            <h2>
              Historias que <span>orientan.</span>
            </h2>
          </div>
        </div>
        <div className="news-grid">
          {novedades.map((noticia, i) => (
            <article className="news-card" key={noticia.id}>
              <div className={`news-visual news-visual-${i + 1}`}>
                <BookOpen size={64} strokeWidth={1.1} />
                <span>EDUBÍO 360 · {String(i + 1).padStart(2, '0')}</span>
              </div>
              <div className="news-body">
                <span className="news-category">
                  {noticia.categoria} <b>·</b> {noticia.fecha}
                </span>
                <h3>{noticia.titulo}</h3>
                <p>{noticia.resumen}</p>
                <Link to={`/novedades/${noticia.id}`} className="section-link">
                  Leer artículo <ArrowUpRight size={19} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
