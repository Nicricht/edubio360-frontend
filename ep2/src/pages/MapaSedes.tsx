import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { useDatos } from '../context/DatosContext';

const sedes = [
  { nombre: 'Concepción', lat: -36.827, lng: -73.05 },
  { nombre: 'Talcahuano', lat: -36.724, lng: -73.116 },
  { nombre: 'San Pedro de la Paz', lat: -36.84, lng: -73.103 },
  { nombre: 'Los Ángeles', lat: -37.469, lng: -72.353 },
  { nombre: 'Hualpén', lat: -36.787, lng: -73.09 },
];

function mapaUrl(lat: number, lng: number): string {
  const delta = 0.055;
  const bbox = [lng - delta, lat - delta, lng + delta, lat + delta].join(',');
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat}%2C${lng}`;
}

export function MapaSedes() {
  const { ofertas } = useDatos();
  const [search] = useSearchParams();
  const [seleccion, setSeleccion] = useState(() => sedes.find((sede) => sede.nombre === search.get('sede')) || sedes[0]);
  const disponibles = ofertas.filter((oferta) => oferta.comuna === seleccion.nombre);

  return <main className="container page-container section-space">
    <div className="eyebrow">REGIÓN DEL BIOBÍO</div>
    <h1>Mapa de sedes</h1>
    <p className="page-lead">Explora las comunas con ofertas académicas y revisa las alternativas disponibles.</p>
    <div className="row g-4 mt-2">
      <div className="col-lg-4">
        <div className="form-surface d-grid gap-2">
          {sedes.map((sede) => <button
            type="button" key={sede.nombre}
            className={`btn text-start ${seleccion.nombre === sede.nombre ? 'btn-dark' : 'btn-outline-secondary'}`}
            aria-pressed={seleccion.nombre === sede.nombre}
            onClick={() => setSeleccion(sede)}
          ><MapPin size={17} className="me-2" />{sede.nombre}</button>)}
        </div>
        <div className="mt-3">
          <strong>{disponibles.length} ofertas en {seleccion.nombre}</strong>
          <p className="mt-2">{new Set(disponibles.map((oferta) => oferta.institucion)).size} instituciones de educación superior.</p>
          <Link className="btn btn-dark rounded-pill" to={`/carreras?sede=${encodeURIComponent(seleccion.nombre)}`}>Ver ofertas de esta sede</Link>
        </div>
      </div>
      <div className="col-lg-8">
        <iframe
          key={seleccion.nombre}
          title={`Mapa de ${seleccion.nombre}`}
          className="mapa-frame"
          src={mapaUrl(seleccion.lat, seleccion.lng)}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <p className="small text-muted mt-2">Mapa de OpenStreetMap. Se requiere conexión a internet para visualizar los mapas.</p>
      </div>
    </div>
  </main>;
}
