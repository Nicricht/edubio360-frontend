import { beforeEach, describe, expect, it } from 'vitest';
import {
  actualizarSolicitud,
  crearSolicitud,
  listarNotificaciones,
  listarSolicitudes,
  marcarNotificacionesLeidas,
} from './orientacion';

const estudiante = { correo: 'estudiante@duoc.cl', rol: 'Estudiante' as const, nombre: 'Estudiante Demo' };
const orientador = { correo: 'orientador@duoc.cl', rol: 'Orientador' as const, nombre: 'Orientador Demo' };
const otraPersona = { correo: 'otro@duoc.cl', rol: 'Estudiante' as const, nombre: 'Otro' };
const fechaFutura = '2099-12-30';

function generar() {
  return crearSolicitud(localStorage, estudiante, {
    ofertaId: 'of-001', oferta: 'Ingeniería en Informática', motivo: 'Necesito orientación', fecha: fechaFutura,
  });
}

describe('Orientación entre estudiante y orientador', () => {
  beforeEach(() => localStorage.clear());

  it('crea la solicitud con estado pendiente, historial y notificación', () => {
    const creada = generar();
    expect(listarSolicitudes(localStorage)).toEqual([creada]);
    expect(creada.estado).toBe('PENDIENTE');
    expect(creada.historial).toHaveLength(1);
    expect(listarNotificaciones(localStorage, estudiante.correo)).toHaveLength(1);
  });

  it('solo permite a un orientador tomar solicitudes disponibles', () => {
    const creada = generar();
    expect(actualizarSolicitud(localStorage, creada.id, estudiante, { tipo: 'TOMAR' })).toBeNull();
    expect(actualizarSolicitud(localStorage, creada.id, orientador, { tipo: 'TOMAR' })?.orientador).toBe(orientador.correo);
    expect(actualizarSolicitud(localStorage, creada.id, { ...orientador, correo: 'otro@duoc.cl' }, { tipo: 'TOMAR' })).toBeNull();
  });

  it('no permite a otros estudiantes cancelar solicitudes ajenas', () => {
    const creada = generar();
    expect(actualizarSolicitud(localStorage, creada.id, otraPersona, { tipo: 'CANCELAR' })).toBeNull();
    expect(actualizarSolicitud(localStorage, creada.id, estudiante, { tipo: 'CANCELAR' })?.estado).toBe('CANCELADA');
    expect(actualizarSolicitud(localStorage, creada.id, estudiante, { tipo: 'CANCELAR' })).toBeNull();
  });

  it('valida fecha futura y resultado antes de finalizar', () => {
    const creada = generar();
    actualizarSolicitud(localStorage, creada.id, orientador, { tipo: 'TOMAR' });
    expect(actualizarSolicitud(localStorage, creada.id, orientador, { tipo: 'GESTIONAR', estado: 'ACEPTADA', fecha: '2000-01-01' })).toBeNull();
    expect(actualizarSolicitud(localStorage, creada.id, orientador, { tipo: 'GESTIONAR', estado: 'ATENDIDA', resultado: '' })).toBeNull();
    const atendida = actualizarSolicitud(localStorage, creada.id, orientador, { tipo: 'GESTIONAR', estado: 'ATENDIDA', resultado: 'Orientación realizada' });
    expect(atendida?.estado).toBe('ATENDIDA');
    expect(atendida?.historial).toHaveLength(3);
    expect(listarNotificaciones(localStorage, estudiante.correo)).toHaveLength(3);
  });

  it('permite reprogramar con una fecha válida y marcar las notificaciones leídas', () => {
    const creada = generar();
    expect(actualizarSolicitud(localStorage, creada.id, estudiante, { tipo: 'REPROGRAMAR', fecha: '2000-01-01' })).toBeNull();
    expect(actualizarSolicitud(localStorage, creada.id, estudiante, { tipo: 'REPROGRAMAR', fecha: fechaFutura })?.estado).toBe('REPROGRAMADA');
    marcarNotificacionesLeidas(localStorage, estudiante.correo);
    expect(listarNotificaciones(localStorage, estudiante.correo).every((nota) => nota.leida)).toBe(true);
  });

  it('conserva las ofertas comparadas al solicitar orientación', () => {
    const ofertasComparadas = [
      { id: 'of-001', carrera: 'Ingeniería en Informática', institucion: 'IP DUOC UC', comuna: 'Concepción' },
      { id: 'of-002', carrera: 'Ingeniería en Informática', institucion: 'IP Santo Tomás', comuna: 'Concepción' },
    ];
    const creada = crearSolicitud(localStorage, estudiante, {
      ofertaId: 'of-001', oferta: 'Ingeniería en Informática', motivo: 'Comparar alternativas',
      fecha: fechaFutura, ofertasComparadas,
    });
    expect(creada.ofertasComparadas).toEqual(ofertasComparadas);
    expect(listarSolicitudes(localStorage)[0].ofertasComparadas).toHaveLength(2);
  });
});
