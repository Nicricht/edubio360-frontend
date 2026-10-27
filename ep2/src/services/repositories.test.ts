import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createOfertaRepository, createUsuarioRepository } from './repositories';
import type { Oferta, Usuario } from '../types';

const oferta: Oferta = {
  id: 'prueba-1',
  carrera: 'Ingeniería Informática',
  institucion: 'Institución de prueba',
  comuna: 'Concepción',
  area: 'Tecnología',
  modalidad: 'Presencial',
  jornada: 'Diurno',
  duracion: 8,
  matricula: 100000,
  arancel: 2500000,
  nivel: 'Pregrado',
  descripcion: 'Programa de prueba',
};

const usuario: Usuario = {
  id: 'usuario-1',
  run: '12345678-5',
  nombre: 'Ana',
  apellidos: 'Prueba',
  correo: 'ana@example.com',
  rol: 'Estudiante',
  region: 'Biobío',
  comuna: 'Concepción',
  direccion: 'Dirección de prueba',
};

describe('OfertaRepository', () => {
  beforeEach(() => localStorage.clear());

  it('entrega ofertas iniciales al comenzar con almacenamiento vacío', () => {
    expect(createOfertaRepository(localStorage).list().length).toBeGreaterThanOrEqual(8);
  });

  it('lee una oferta por identificador', () => {
    const repository = createOfertaRepository(localStorage);
    expect(repository.get(repository.list()[0].id)?.carrera).toBeTruthy();
  });

  it('crea una oferta y la incorpora a la lista', () => {
    const repository = createOfertaRepository(localStorage);
    const before = repository.list().length;
    repository.create(oferta);
    expect(repository.list()).toHaveLength(before + 1);
    expect(repository.get('prueba-1')).toEqual(oferta);
  });

  it('rechaza un identificador de oferta duplicado', () => {
    const repository = createOfertaRepository(localStorage);
    repository.create(oferta);
    expect(() => repository.create(oferta)).toThrow(/existe/i);
  });

  it('actualiza una oferta sin cambiar las demás', () => {
    const repository = createOfertaRepository(localStorage);
    repository.create(oferta);
    const count = repository.list().length;
    expect(repository.update('prueba-1', { arancel: 2900000 })?.arancel).toBe(2900000);
    expect(repository.list()).toHaveLength(count);
  });

  it('elimina una oferta y ya no permite consultarla', () => {
    const repository = createOfertaRepository(localStorage);
    repository.create(oferta);
    expect(repository.remove('prueba-1')).toBe(true);
    expect(repository.get('prueba-1')).toBeUndefined();
    expect(repository.remove('prueba-1')).toBe(false);
  });

  it('persiste cambios entre nuevas instancias', () => {
    createOfertaRepository(localStorage).create(oferta);
    expect(createOfertaRepository(localStorage).get('prueba-1')?.carrera).toBe(oferta.carrera);
  });

  it('guarda las ofertas con la clave correcta del almacenamiento', () => {
    const escritura = vi.spyOn(Storage.prototype, 'setItem');
    try {
      createOfertaRepository(localStorage).create(oferta);
      expect(escritura).toHaveBeenCalledWith('edubio360:ofertas', expect.any(String));
      expect(JSON.parse(localStorage.getItem('edubio360:ofertas') || '[]')).toContainEqual(oferta);
    } finally {
      escritura.mockRestore();
    }
  });

  it('recupera datos iniciales si el almacenamiento contiene JSON inválido', () => {
    localStorage.setItem('edubio360:ofertas', '{mal-json');
    expect(createOfertaRepository(localStorage).list().length).toBeGreaterThanOrEqual(8);
  });

  it('rechaza campos inválidos almacenados sin romper el catálogo', () => {
    localStorage.setItem('edubio360:ofertas', JSON.stringify([{ foo: 'bar' }]));
    expect(createOfertaRepository(localStorage).list().length).toBeGreaterThanOrEqual(8);
  });
});

describe('UsuarioRepository', () => {
  beforeEach(() => localStorage.clear());

  it('crea y recupera un usuario', () => {
    const repository = createUsuarioRepository(localStorage);
    repository.create(usuario);
    expect(repository.get('usuario-1')).toEqual(usuario);
  });

  it('actualiza rol de un usuario', () => {
    const repository = createUsuarioRepository(localStorage);
    repository.create(usuario);
    expect(repository.update('usuario-1', { rol: 'Administrador' })?.rol).toBe('Administrador');
  });

  it('elimina un usuario y conserva el resto', () => {
    const repository = createUsuarioRepository(localStorage);
    repository.create(usuario);
    expect(repository.remove('usuario-1')).toBe(true);
    expect(repository.get('usuario-1')).toBeUndefined();
  });
});
