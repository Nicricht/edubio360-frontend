import type { Oferta } from '../types';
import type { OfertaApi, OfertaEntrada, SedeApi } from './catalogoApi';

export function desdeApi(o: OfertaApi): Oferta {
  return {
    id: String(o.id), sedeId: o.sedeId, carrera: o.carrera, institucion: o.institucion,
    comuna: o.comuna, modalidad: o.modalidad, jornada: o.jornada,
    arancel: o.arancel, matricula: o.matricula, area: o.area ?? 'Sin clasificar',
    duracion: o.duracion ?? 0, nivel: o.nivel ?? 'No informado',
    descripcion: o.descripcion ?? 'Información no disponible.',
    grupoComparacion: o.grupoComparacion ?? o.carrera,
    imagen: o.imagen ? import.meta.env.BASE_URL + 'img/ofertas/' + encodeURIComponent(o.imagen) : undefined,
    cupos: o.cupos ?? undefined, cupoCritico: o.cupoCritico ?? undefined,
  };
}

export function haciaApi(o: Oferta, sedes: SedeApi[]): OfertaEntrada {
  const sede = sedes.find(s => s.id === o.sedeId && s.institucion === o.institucion && s.comuna === o.comuna)
    ?? sedes.find(s => s.institucion === o.institucion && s.comuna === o.comuna);
  if (!sede) throw new Error('Selecciona una institución y comuna con sede registrada.');
  return {
    sedeId: sede.id, carrera: o.carrera, modalidad: o.modalidad, jornada: o.jornada,
    arancel: o.arancel, matricula: o.matricula, area: o.area, duracion: o.duracion,
    nivel: o.nivel, descripcion: o.descripcion, grupoComparacion: o.grupoComparacion ?? o.carrera,
    imagen: o.imagen?.split('/').pop(), cupos: o.cupos, cupoCritico: o.cupoCritico,
  };
}
