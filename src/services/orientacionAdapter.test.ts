import { describe, expect, it } from 'vitest';
import { estadoServidor, estadoVista, solicitudVista } from './orientacionAdapter';
describe('Adaptación orientación', () => {
  it('mantiene equivalencia de estados entre React y Java', () => {
    expect(estadoVista('CONFIRMADA')).toBe('ACEPTADA');
    expect(estadoServidor('ATENDIDA')).toBe('COMPLETADA');
  });
  it('preserva IDs remotos e historial', () => {
    const s = solicitudVista({ id: 3, estudianteEmail: 'a@example.test', ofertaId: 1, motivo: 'Prueba', fechaHora: '2099-01-01T10:00:00',
      estado: 'COMPLETADA', orientadorEmail: 'b@example.test', createdAt: '2099-01-01', updatedAt: '2099-01-02',
      historial: [{ estado: 'CONFIRMADA', detalle: 'Confirmada', fecha: '2099-01-01T10:00:00' }], resultado: 'Atendida', ofertasComparadas: [1,2] }, []);
    expect(s.estado).toBe('ATENDIDA');
    expect(s.resultado).toBe('Atendida');
    expect(s.ofertasComparadas?.map(o => o.id)).toEqual(['1','2']);
    expect(s.historial[0].estado).toBe('ACEPTADA');
  });
});
