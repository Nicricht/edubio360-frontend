import type { Oferta } from '../types';
import type { Solicitud, EstadoSolicitud, Notificacion } from './orientacion';
import type { SolicitudApi } from './solicitudesApi';
import { apiRest } from './apiRest';

export function estadoVista(estado: string): EstadoSolicitud {
  if (estado === 'CONFIRMADA') return 'ACEPTADA';
  if (estado === 'COMPLETADA') return 'ATENDIDA';
  if (estado === 'PENDIENTE' || estado === 'REPROGRAMADA' || estado === 'CANCELADA') return estado;
  throw new Error('Estado de solicitud desconocido: ' + estado);
}
export function estadoServidor(estado: EstadoSolicitud): string {
  return estado === 'ACEPTADA' ? 'CONFIRMADA' : estado === 'ATENDIDA' ? 'COMPLETADA' : estado;
}
export function solicitudVista(s: SolicitudApi, ofertas: Oferta[]): Solicitud {
  const oferta = ofertas.find(o => o.id === String(s.ofertaId));
  return {
    id: String(s.id), estudiante: s.estudianteEmail, correo: s.estudianteEmail,
    ofertaId: String(s.ofertaId), oferta: oferta?.carrera ?? ('Oferta #' + s.ofertaId),
    motivo: s.motivo, fecha: s.fechaHora.slice(0, 10), estado: estadoVista(s.estado),
    orientador: s.orientadorEmail ?? '', resultado: s.resultado ?? '', observacion: s.observacion ?? '',
    historial: s.historial.map(h => ({ estado: estadoVista(h.estado), fecha: h.fecha, actor: h.detalle })),
    ofertasComparadas: (s.ofertasComparadas ?? []).map(id => {
      const o = ofertas.find(x => x.id === String(id));
      return { id: String(id), carrera: o?.carrera ?? ('Oferta #' + id), institucion: o?.institucion ?? '', comuna: o?.comuna ?? '' };
    }),
  };
}
interface AvisoApi { id: number; destinatario: string; mensaje: string; createdAt: string; leida: boolean; tipo: string }
export async function avisosPropios(token: string): Promise<Notificacion[]> {
  return (await apiRest<AvisoApi[]>('/api/notificaciones/mias', {}, token)).map(n => {
    let texto = n.mensaje, solicitudId = '';
    if (n.tipo === 'ORIENTACION_CONFIRMADA') {
      try { const p = JSON.parse(n.mensaje); solicitudId = String(p.solicitudId ?? ''); texto = 'Tu solicitud de orientación fue confirmada.'; }
      catch { texto = 'Tu solicitud de orientación fue confirmada.'; }
    }
    return { id: String(n.id), correo: n.destinatario, texto, solicitudId, fecha: n.createdAt, leida: n.leida };
  });
}
export function marcarAvisos(token: string) {
  return apiRest<void>('/api/notificaciones/mias/leidas', { method: 'PUT' }, token);
}
