import type { Oferta } from '../types';
export interface OfertaFilters {
  buscar: string;
  area: string;
  comuna: string;
}

const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

export function filtrarOfertas(ofertas: Oferta[], filters: OfertaFilters): Oferta[] {
  const q = normalize(filters.buscar);
  return ofertas.filter((oferta) => {
    const text = normalize(`${oferta.carrera} ${oferta.institucion} ${oferta.comuna}`);
    return (
      (!q || text.includes(q)) &&
      (!filters.area || oferta.area === filters.area) &&
      (!filters.comuna || oferta.comuna === filters.comuna)
    );
  });
}
