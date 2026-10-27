import type { Sesion } from './auth';

export type EstadoSolicitud = 'PENDIENTE' | 'ACEPTADA' | 'REPROGRAMADA' | 'CANCELADA' | 'ATENDIDA';
export interface CambioSolicitud {
  estado: EstadoSolicitud;
  fecha: string;
  actor: string;
}
export interface OfertaComparada {
  id: string;
  carrera: string;
  institucion: string;
  comuna: string;
}
export interface Solicitud {
  id: string;
  estudiante: string;
  correo: string;
  ofertaId: string;
  oferta: string;
  motivo: string;
  fecha: string;
  estado: EstadoSolicitud;
  orientador: string;
  resultado: string;
  observacion: string;
  historial: CambioSolicitud[];
  ofertasComparadas?: OfertaComparada[];
}
export interface Notificacion {
  id: string;
  correo: string;
  texto: string;
  solicitudId: string;
  fecha: string;
  leida: boolean;
}
export type AccionSolicitud =
  | { tipo: 'TOMAR' }
  | { tipo: 'CANCELAR' }
  | { tipo: 'REPROGRAMAR'; fecha: string }
  | { tipo: 'GESTIONAR'; estado: EstadoSolicitud; fecha?: string; resultado?: string; observacion?: string };

const solicitudesClave = 'edubio360:solicitudes';
const notificacionesClave = 'edubio360:notificaciones';

function leer<T>(storage: Storage, clave: string): T[] {
  try {
    const resultado: unknown = JSON.parse(storage.getItem(clave) || '[]');
    return Array.isArray(resultado) ? resultado as T[] : [];
  } catch {
    return [];
  }
}

function guardar<T>(storage: Storage, clave: string, items: T[]): void {
  storage.setItem(clave, JSON.stringify(items));
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('edubio360:orientaciones'));
}

function hoy(): string {
  const fecha = new Date();
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
}

function fechaValida(fecha: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(fecha) && !Number.isNaN(Date.parse(`${fecha}T12:00:00`)) && fecha >= hoy();
}

function notificar(storage: Storage, correo: string, texto: string, solicitudId: string): void {
  const notificaciones = leer<Notificacion>(storage, notificacionesClave);
  const nueva: Notificacion = {
    id: crypto.randomUUID(), correo, texto, solicitudId,
    fecha: new Date().toISOString(), leida: false,
  };
  guardar(storage, notificacionesClave, [nueva, ...notificaciones]);
}

export function listarSolicitudes(storage: Storage): Solicitud[] {
  return leer<Solicitud>(storage, solicitudesClave).filter((item) => item && typeof item.id === 'string' && typeof item.correo === 'string');
}

export function listarNotificaciones(storage: Storage, correo: string): Notificacion[] {
  return leer<Notificacion>(storage, notificacionesClave).filter((item) => item.correo === correo.toLowerCase());
}

export function marcarNotificacionesLeidas(storage: Storage, correo: string): void {
  const todas = leer<Notificacion>(storage, notificacionesClave);
  guardar(storage, notificacionesClave, todas.map((item) => item.correo === correo.toLowerCase() ? { ...item, leida: true } : item));
}

export function crearSolicitud(storage: Storage, sesion: Sesion, input: Pick<Solicitud, 'ofertaId' | 'oferta' | 'motivo' | 'fecha'> & { ofertasComparadas?: OfertaComparada[] }): Solicitud {
  if (sesion.rol !== 'Estudiante' || !input.ofertaId || !input.oferta.trim() || !input.motivo.trim() || !fechaValida(input.fecha)) {
    throw new Error('Completa la oferta, el motivo y una fecha válida.');
  }
  const fecha = new Date().toISOString();
  const creada: Solicitud = {
    id: crypto.randomUUID(), estudiante: sesion.nombre, correo: sesion.correo,
    ofertaId: input.ofertaId, oferta: input.oferta, motivo: input.motivo.trim(), fecha: input.fecha,
    estado: 'PENDIENTE', orientador: '', resultado: '', observacion: '',
    historial: [{ estado: 'PENDIENTE', fecha, actor: sesion.correo }],
    ofertasComparadas: input.ofertasComparadas || [],
  };
  guardar(storage, solicitudesClave, [...listarSolicitudes(storage), creada]);
  notificar(storage, sesion.correo, 'Tu solicitud de orientación fue recibida.', creada.id);
  return creada;
}

export function actualizarSolicitud(storage: Storage, id: string, sesion: Sesion, accion: AccionSolicitud): Solicitud | null {
  const solicitudes = listarSolicitudes(storage);
  const indice = solicitudes.findIndex((item) => item.id === id);
  if (indice < 0) return null;
  const anterior = solicitudes[indice];
  if (anterior.estado === 'CANCELADA' || anterior.estado === 'ATENDIDA') return null;
  const esEstudiante = sesion.rol === 'Estudiante' && anterior.correo === sesion.correo;
  const esOrientador = sesion.rol === 'Orientador' && anterior.orientador === sesion.correo;
  let cambios: Partial<Solicitud>;

  if (accion.tipo === 'TOMAR') {
    if (sesion.rol !== 'Orientador' || anterior.orientador || !['PENDIENTE', 'REPROGRAMADA'].includes(anterior.estado)) return null;
    cambios = { orientador: sesion.correo };
  } else if (accion.tipo === 'CANCELAR') {
    if (!esEstudiante) return null;
    cambios = { estado: 'CANCELADA' };
  } else if (accion.tipo === 'REPROGRAMAR') {
    if (!esEstudiante || !fechaValida(accion.fecha)) return null;
    cambios = { estado: 'REPROGRAMADA', fecha: accion.fecha };
  } else {
    if (!esOrientador) return null;
    if ((accion.estado === 'ACEPTADA' || accion.estado === 'REPROGRAMADA') && !fechaValida(accion.fecha || anterior.fecha)) return null;
    if (accion.estado === 'ATENDIDA' && !(accion.resultado || anterior.resultado).trim()) return null;
    cambios = {
      estado: accion.estado, fecha: accion.fecha || anterior.fecha,
      resultado: accion.resultado ?? anterior.resultado,
      observacion: accion.observacion ?? anterior.observacion,
    };
  }

  const actualizado: Solicitud = {
    ...anterior, ...cambios,
    historial: [...anterior.historial, { estado: cambios.estado || anterior.estado, fecha: new Date().toISOString(), actor: sesion.correo }],
  };
  solicitudes[indice] = actualizado;
  guardar(storage, solicitudesClave, solicitudes);
  notificar(storage, anterior.correo, accion.tipo === 'TOMAR' ? 'Un orientador tomó tu solicitud.' : `Tu solicitud está ${actualizado.estado.toLowerCase()}.`, id);
  return actualizado;
}
