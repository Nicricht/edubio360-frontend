import { describe, expect, it } from 'vitest';
import { filtrarOfertas } from './filters';
import { seedOfertas } from '../data/seed';

describe('Filtros del catálogo', () => {
  it('encuentra carreras ignorando mayúsculas y tildes', () => {
    const result = filtrarOfertas(seedOfertas, {
      buscar: 'TECNICO UNIVERSITARIO EN AUTOMATIZACION Y CONTROL',
      area: '',
      comuna: '',
    });
    expect(result).toHaveLength(1);
    expect(result[0].carrera).toBe('Técnico Universitario en Automatización y Control');
  });

  it('combina filtros por área y comuna', () => {
    const result = filtrarOfertas(seedOfertas, { buscar: '', area: 'Tecnología', comuna: 'Hualpén' });
    expect(result).toHaveLength(1);
    expect(result[0].carrera).toBe('Técnico Universitario en Automatización y Control');
  });

  it('devuelve lista vacía para una búsqueda sin coincidencias', () => {
    expect(
      filtrarOfertas(seedOfertas, { buscar: 'Nombre imposible', area: '', comuna: '' }),
    ).toEqual([]);
  });
});
