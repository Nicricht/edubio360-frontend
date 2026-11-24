import { describe, expect, it } from 'vitest';
import { desdeApi, haciaApi } from './catalogoAdapter';
import type { OfertaApi } from './catalogoApi';

const registro: OfertaApi = {
  id: 12, carrera: 'Informática', institucion: 'Institución', sedeId: 2, sede: 'Centro',
  comuna: 'Concepción', modalidad: 'Presencial', jornada: 'Diurno',
  arancel: 100, matricula: 10, area: 'Tecnología', duracion: 8, nivel: 'Profesional',
  descripcion: 'Descripción', grupoComparacion: 'Informática', cupos: 15,
};

describe('Contrato del catálogo REST', () => {
  it('conserva los campos y el ID remoto sin fabricar datos', () => {
    const oferta = desdeApi(registro);
    expect(oferta.id).toBe('12');
    expect(oferta.sedeId).toBe(2);
    expect(oferta.cupos).toBe(15);
    expect(haciaApi(oferta, [{ id: 2, nombre: 'Centro', institucion: 'Institución', comuna: 'Concepción' }]))
      .toMatchObject({ sedeId: 2, carrera: 'Informática', duracion: 8, cupos: 15 });
  });
  it('rechaza una sede que no existe en el servidor', () => {
    expect(() => haciaApi(desdeApi(registro), [])).toThrow('Selecciona una institución');
  });
});
