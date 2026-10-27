import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  MapPin,
  Plus,
  Clock3,
  CalendarClock,
  GraduationCap,
} from 'lucide-react';
import { useDatos } from '../context/DatosContext';
import { AreaMark } from '../components/atoms/AreaMark';
import { Price } from '../components/atoms/Price';
import { EmptyState } from '../components/molecules/EmptyState';

export function DetalleOferta() {
  const { id } = useParams();
  const { ofertas, comparadasIds, toggleComparar } = useDatos();
  const oferta = ofertas.find((item) => item.id === id);
  if (!oferta)
    return (
      <main className="container page-container section-space">
        <EmptyState
          title="Oferta no encontrada"
          text="La carrera que buscas no existe o fue eliminada."
          action={
            <Link className="btn btn-dark rounded-pill px-4" to="/carreras">
              Volver al catálogo
            </Link>
          }
        />
      </main>
    );
  const compared = comparadasIds.includes(oferta.id);
  return (
    <main className="container page-container section-space detail-page">
      <Link className="back-link" to="/carreras">
        <ArrowLeft size={17} /> Volver al catálogo
      </Link>
      <div className="detail-grid">
        <div>
          <AreaMark area={oferta.area} large />
        </div>
        <div className="detail-content">
          <span className="pill-soft">{oferta.area}</span>
          <h1>{oferta.carrera}</h1>
          <p className="detail-institution">
            <GraduationCap size={19} />
            {oferta.institucion}
          </p>
          <p className="detail-description">{oferta.descripcion}</p>
          <div className="detail-facts">
            <span>
              <MapPin size={18} />
              <strong>{oferta.comuna}</strong>
              <small>Comuna</small>
            </span>
            <span>
              <Clock3 size={18} />
              <strong>{oferta.duracion} semestres</strong>
              <small>Duración</small>
            </span>
            <span>
              <CalendarClock size={18} />
              <strong>{oferta.jornada}</strong>
              <small>Jornada</small>
            </span>
          </div>
          <div className="detail-price">
            <Price value={oferta.arancel} />
            <Price value={oferta.matricula} label="Matrícula" />
          </div>
          <div className="d-flex gap-2 flex-wrap mt-4">
            <button
              className="btn btn-dark btn-lg rounded-pill px-4 d-inline-flex align-items-center gap-2"
              onClick={() => toggleComparar(oferta.id)}
            >
              {compared ? <Check size={18} /> : <Plus size={18} />}
              {compared ? 'Agregada al comparador' : 'Agregar a comparar'}
            </button>
            <Link
              className="btn btn-outline-dark btn-lg rounded-pill px-4 d-inline-flex align-items-center gap-2"
              to="/comparar"
            >
              Ver comparador <ArrowUpRight size={17} />
            </Link>
            <Link className="btn btn-outline-dark btn-lg rounded-pill px-4" to={`/solicitar?oferta=${oferta.id}`}>
              Solicitar orientación
            </Link>
          </div>
        </div>
      </div>
      <div className="data-notice">
        Fuente: Registro de Matrícula de Educación Superior del Biobío, 2021. Los valores son
        históricos y pueden haber cambiado.
      </div>
    </main>
  );
}
