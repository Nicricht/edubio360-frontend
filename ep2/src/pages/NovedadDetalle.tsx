import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { novedades } from '../data/novedades';
import { EmptyState } from '../components/molecules/EmptyState';

export function NovedadDetalle() {
  const { id } = useParams();
  const noticia = novedades.find((n) => n.id === id);
  if (!noticia)
    return (
      <main className="container page-container section-space">
        <EmptyState
          title="Artículo no encontrado"
          text="La publicación no existe."
          action={<Link to="/novedades">Volver a novedades</Link>}
        />
      </main>
    );
  return (
    <main>
      <section className="article-heading">
        <div className="container page-container">
          <Link className="back-link" to="/novedades">
            <ArrowLeft size={18} /> Volver a novedades
          </Link>
          <div className="eyebrow">{noticia.categoria}</div>
          <h1>{noticia.titulo}</h1>
          <p>{noticia.resumen}</p>
        </div>
      </section>
      <article className="container page-container section-space article-content">
        {noticia.parrafos.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <div className="article-footnote">
          EduBío360 es un proyecto académico. Verifica la información actualizada en las
          instituciones y organismos oficiales.
        </div>
        <Link className="btn btn-dark rounded-pill px-4 mt-4" to="/carreras">
          Explorar carreras <ArrowUpRight size={18} />
        </Link>
      </article>
    </main>
  );
}
