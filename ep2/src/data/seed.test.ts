import { describe, expect, it } from 'vitest';
import { seedOfertas, seedUsuarios } from './seed';

describe('Migración de datos EP1', () => {
  it('conserva las 21 ofertas y sus identificadores originales', () => {
    expect(seedOfertas).toHaveLength(21);
    expect(seedOfertas[0]).toMatchObject({
      id: 'of-001',
      carrera: 'Ingeniería en Informática',
      institucion: 'IP DUOC UC',
      comuna: 'Concepción',
      arancel: 2190000,
    });
    expect(seedOfertas.at(-1)).toMatchObject({
      id: 'of-021',
      institucion: 'Universidad Técnica Federico Santa María',
      comuna: 'Hualpén',
    });
    expect(new Set(seedOfertas.map((oferta) => oferta.id)).size).toBe(21);
  });

  it('incluye cuentas de ejemplo de los tres roles del proyecto original', () => {
    expect(seedUsuarios.map((usuario) => usuario.rol).sort()).toEqual([
      'Administrador',
      'Estudiante',
      'Orientador',
    ]);
  });
});
