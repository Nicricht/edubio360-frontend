import { apiRest } from './apiRest';

export interface SolicitudApi {
  id: number;
  estudianteEmail: string;
  ofertaId: number;
  motivo: string;
  fechaHora: string;
  estado: string;
  orientadorEmail: string | null;
  createdAt: string;
  updatedAt: string;
  historial: { estado: string; detalle: string; fecha: string }[];
  resultado?: string | null;
  observacion?: string | null;
  ofertasComparadas?: number[];
}

export interface SolicitudEntrada {
  ofertaId: number;
  ofertasComparadas?: number[];
  motivo: string;
  fechaHora: string;
}

export const solicitudesApi = {
  listar(token: string) {
    return apiRest<SolicitudApi[]>('/api/solicitudes', {}, token);
  },
  disponibles(token: string) {
    return apiRest<SolicitudApi[]>('/api/solicitudes/disponibles', {}, token);
  },
  mias(token: string) {
    return apiRest<SolicitudApi[]>('/api/solicitudes/mias', {}, token);
  },
  obtener(id: number, token: string) {
    return apiRest<SolicitudApi>('/api/solicitudes/' + id, {}, token);
  },
  crear(datos: SolicitudEntrada, token: string) {
    return apiRest<SolicitudApi>('/api/solicitudes', { method: 'POST', body: JSON.stringify(datos) }, token);
  },
  actualizar(id: number, datos: Omit<SolicitudEntrada, 'ofertaId'>, token: string) {
    return apiRest<SolicitudApi>('/api/solicitudes/' + id, { method: 'PUT', body: JSON.stringify(datos) }, token);
  },
  confirmar(id: number, token: string) {
    return apiRest<SolicitudApi>('/api/solicitudes/' + id + '/confirmar', { method: 'PUT' }, token);
  },
  reprogramar(id: number, motivo: string, fechaHora: string, token: string) {
    return apiRest<SolicitudApi>('/api/solicitudes/' + id + '/reprogramar', { method: 'PUT', body: JSON.stringify({ motivo, fechaHora }) }, token);
  },
  gestionar(id: number, datos: { estado: string; fechaHora?: string; resultado?: string; observacion?: string }, token: string) {
    return apiRest<SolicitudApi>('/api/solicitudes/' + id + '/gestionar', { method: 'PUT', body: JSON.stringify(datos) }, token);
  },
  cancelar(id: number, token: string) {
    return apiRest<SolicitudApi>('/api/solicitudes/' + id + '/cancelar', { method: 'PUT' }, token);
  },
};
