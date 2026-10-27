import type { Oferta } from '../../types';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Check, MapPin, Plus, Clock3 } from 'lucide-react';
import { useDatos } from '../../context/DatosContext';
import { AreaMark } from '../atoms/AreaMark';
import { Price } from '../atoms/Price';

export function OfertaCard({ oferta }: { oferta: Oferta }) {
  const { comparadasIds, toggleComparar } = useDatos();
  const compared = comparadasIds.includes(oferta.id);
  return (
    <article className="oferta-card" data-testid="oferta-card">
      <div className="card-art">
        {oferta.imagen ? <img className="oferta-imagen" src={oferta.imagen} alt="" loading="lazy" /> : <AreaMark area={oferta.area} />}
        <span className="tag-floating">{oferta.area}</span>
      </div>
      <div className="oferta-card-body">
        <div className="card-metadata">
          <span>
            <MapPin size={14} />
            {oferta.comuna}
          </span>
          <span>
            <Clock3 size={14} />
            {oferta.duracion} semestres
          </span>
        </div>
        <h3>{oferta.carrera}</h3>
        <p className="institution">{oferta.institucion}</p>
        {oferta.cupos !== undefined && <p className="small mb-2" aria-label={`Cupos disponibles: ${oferta.cupos}`}>
          {oferta.cupos <= (oferta.cupoCritico ?? 0) ? 'Cupos limitados' : 'Cupos disponibles'}: {oferta.cupos}
        </p>}
        <div className="card-divider" />
        <div className="card-bottom">
          <Price value={oferta.arancel} />
          <div className="card-actions">
            <Link to={`/carreras/${oferta.id}`} className="btn-view">
              Ver detalle <ArrowUpRight size={16} />
            </Link>
            <button
              type="button"
              className={`btn-compare ${compared ? 'is-selected' : ''}`}
              onClick={() => toggleComparar(oferta.id)}
              aria-pressed={compared}
              aria-label={
                compared
                  ? `Quitar ${oferta.carrera} de comparar`
                  : `Agregar ${oferta.carrera} a comparar`
              }
              title={compared ? 'Quitar de comparar' : 'Agregar a comparar'}
            >
              {compared ? <Check size={18} /> : <Plus size={18} />}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
