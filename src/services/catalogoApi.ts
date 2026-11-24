import { apiRest } from './apiRest';

export interface SedeApi {
  id: number;
  nombre: string;
  institucion: string;
  comuna: string;
}

export interface OfertaApi {
  id: number;
  carrera: string;
  institucion: string;
  sedeId: number;
  sede: string;
  comuna: string;
  modalidad: string;
  jornada: string;
  arancel: number;
  matricula: number;
  area?: string | null;
  duracion?: number | null;
  nivel?: string | null;
  descripcion?: string | null;
  grupoComparacion?: string | null;
  imagen?: string | null;
  cupos?: number | null;
  cupoCritico?: number | null;
}

export type OfertaEntrada = Omit<OfertaApi, 'id' | 'institucion' | 'sede' | 'comuna'>;

export const catalogoApi = {
  listar(q = '', token?: string) {
    const filtro = q.trim() ? '?q=' + encodeURIComponent(q.trim()) : '';
    return apiRest<OfertaApi[]>('/api/ofertas' + filtro, {}, token);
  },
  obtener(id: number, token?: string) {
    return apiRest<OfertaApi>('/api/ofertas/' + id, {}, token);
  },
  sedes(token?: string) {
    return apiRest<SedeApi[]>('/api/sedes', {}, token);
  },
  crear(oferta: OfertaEntrada, token: string) {
    return apiRest<OfertaApi>('/api/ofertas', { method: 'POST', body: JSON.stringify(oferta) }, token);
  },
  actualizar(id: number, oferta: OfertaEntrada, token: string) {
    return apiRest<OfertaApi>('/api/ofertas/' + id, { method: 'PUT', body: JSON.stringify(oferta) }, token);
  },
  eliminar(id: number, token: string) {
    return apiRest<void>('/api/ofertas/' + id, { method: 'DELETE' }, token);
  },
};
