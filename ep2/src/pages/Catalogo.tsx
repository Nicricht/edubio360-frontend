import { useMemo, useState } from 'react';
import { ArrowRight, Search, SlidersHorizontal } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDatos } from '../context/DatosContext';
import { filtrarOfertas } from '../utils/filters';
import { OfertaCard } from '../components/molecules/OfertaCard';
import { EmptyState } from '../components/molecules/EmptyState';

export function Catalogo() {
  const { ofertas, compararError } = useDatos();
  const [parametros] = useSearchParams();
  const [buscar, setBuscar] = useState('');
  const [area, setArea] = useState('');
  const [comuna, setComuna] = useState(parametros.get('sede') || '');
  const areas = useMemo(() => [...new Set(ofertas.map((o) => o.area))].sort(), [ofertas]);
  const comunas = useMemo(() => [...new Set(ofertas.map((o) => o.comuna))].sort(), [ofertas]);
  const filtered = useMemo(
    () => filtrarOfertas(ofertas, { buscar, area, comuna }),
    [ofertas, buscar, area, comuna],
  );
  const clear = () => {
    setBuscar('');
    setArea('');
    setComuna('');
  };
  return (
    <main>
      <section className="catalog-hero">
        <div className="container page-container">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            EXPLORA TU FUTURO
          </div>
          <div className="catalog-hero-flex">
            <div>
              <h1>
                Encuentra una carrera <span>para ti.</span>
              </h1>
              <p>
                Explora alternativas reales de educación superior en la Región del Biobío. Compara,
                descubre y elige con más información.
              </p>
            </div>
            <Link to="/comparar" className="ghost-link">
              Ir al comparador <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section
        className="container page-container catalog-section"
        aria-label="Catálogo de ofertas"
      >
        <div className="filter-panel">
          <div className="filter-search">
            <Search size={20} />
            <input
              type="search"
              aria-label="Buscar carrera o institución"
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
              placeholder="Buscar carrera o institución..."
            />
          </div>
          <div className="filter-control">
            <SlidersHorizontal size={17} />
            <select
              aria-label="Filtrar por área"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            >
              <option value="">Todas las áreas</option>
              {areas.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </div>
          <div className="filter-control">
            <select
              aria-label="Filtrar por comuna"
              value={comuna}
              onChange={(e) => setComuna(e.target.value)}
            >
              <option value="">Todas las comunas</option>
              {comunas.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="results-line">
          <div>
            <strong>
              {filtered.length}{' '}
              {filtered.length === 1 ? 'oferta encontrada' : 'ofertas encontradas'}
            </strong>
            <span> · Datos históricos de matrícula 2021</span>
          </div>
          {filtered.length > 0 && (buscar || area || comuna) && (
            <button className="text-button" onClick={clear}>
              Limpiar filtros
            </button>
          )}
        </div>
        {compararError && <p role="alert" className="text-danger">{compararError}</p>}
        {filtered.length ? (
          <div className="ofertas-grid">
            {filtered.map((oferta) => (
              <OfertaCard key={oferta.id} oferta={oferta} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No encontramos ofertas con esos filtros"
            text="Prueba con otra carrera, área o comuna."
            action={
              <button className="btn btn-dark rounded-pill px-4" onClick={clear}>
                Limpiar filtros
              </button>
            }
          />
        )}
      </section>
    </main>
  );
}
