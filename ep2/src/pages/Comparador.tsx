import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Trash2, Scale } from 'lucide-react';
import { useDatos } from '../context/DatosContext';
import { AreaMark } from '../components/atoms/AreaMark';
import { pesoCL } from '../components/atoms/Price';
import { EmptyState } from '../components/molecules/EmptyState';

export function Comparador() {
  const { ofertas, comparadasIds, compararError, toggleComparar, clearComparar } = useDatos();
  const selected = comparadasIds
    .map((id) => ofertas.find((o) => o.id === id))
    .filter((o): o is NonNullable<typeof o> => !!o);
  return (
    <main className="container page-container section-space compare-page">
      <div className="eyebrow">DECIDE CON INFORMACIÓN</div>
      <div className="page-topline">
        <div>
          <h1>
            Compara tus opciones<span className="yellow-dot">.</span>
          </h1>
          <p>Revisa las diferencias entre las carreras que más te interesan.</p>
        </div>
        {selected.length > 0 && (
          <button className="text-button" onClick={clearComparar}>
            Limpiar comparación
          </button>
        )}
      </div>
      {compararError && <p role="alert" className="text-danger">{compararError}</p>}
      {!selected.length ? (
        <EmptyState
          title="Aún no has agregado carreras"
          text="Explora el catálogo y presiona el botón + en las carreras que quieras comparar."
          action={
            <Link to="/carreras" className="btn btn-dark rounded-pill px-4">
              Explorar carreras <ArrowRight size={16} />
            </Link>
          }
        />
      ) : (
        <>
          <p className="compare-note">
            {selected.length}{' '}
            {selected.length === 1 ? 'carrera seleccionada' : 'carreras seleccionadas'} · Datos
            históricos de 2021
          </p>
          <Link className="btn btn-dark rounded-pill mb-4" to={selected.length > 1 ? `/solicitar?comparacion=${selected.map((item) => item.id).join(',')}` : `/solicitar?oferta=${selected[0].id}`}>
            Solicitar orientación sobre esta comparación
          </Link>
          <div className="compare-grid">
            {selected.map((oferta) => (
              <article className="compare-card" key={oferta.id}>
                <AreaMark area={oferta.area} />
                <div className="compare-card-body">
                  <span className="pill-soft">{oferta.area}</span>
                  <h2>{oferta.carrera}</h2>
                  <p>{oferta.institucion}</p>
                  <dl>
                    <div>
                      <dt>Comuna</dt>
                      <dd>{oferta.comuna}</dd>
                    </div>
                    <div>
                      <dt>Modalidad</dt>
                      <dd>{oferta.modalidad}</dd>
                    </div>
                    <div>
                      <dt>Jornada</dt>
                      <dd>{oferta.jornada}</dd>
                    </div>
                    <div>
                      <dt>Duración</dt>
                      <dd>{oferta.duracion} semestres</dd>
                    </div>
                    <div>
                      <dt>Matrícula</dt>
                      <dd>{pesoCL(oferta.matricula)}</dd>
                    </div>
                    <div className="dl-emphasis">
                      <dt>Arancel anual</dt>
                      <dd>{pesoCL(oferta.arancel)}</dd>
                    </div>
                  </dl>
                  <div className="d-flex gap-2 justify-content-between">
                    <Link to={`/carreras/${oferta.id}`} className="text-button">
                      Ver detalle <ArrowUpRight size={16} />
                    </Link>
                    <button
                      className="remove-compare"
                      onClick={() => toggleComparar(oferta.id)}
                      aria-label={`Quitar ${oferta.carrera} del comparador`}
                    >
                      <Trash2 size={17} /> Quitar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {selected.length < 2 && (
            <p className="compare-hint">
              <Scale size={19} /> Agrega otra carrera para comparar sus características lado a lado.
            </p>
          )}
        </>
      )}
    </main>
  );
}
