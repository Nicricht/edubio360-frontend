import { describe, expect, it } from 'vitest';
import {
  validateContacto,
  validateLogin,
  validateOferta,
  validateRegistro,
  validarRun,
} from './validations';
import type { Oferta } from '../types';

const offer: Oferta = {
  id: '1',
  carrera: 'Enfermería',
  institucion: 'Universidad X',
  comuna: 'Concepción',
  area: 'Salud',
  modalidad: 'Presencial',
  jornada: 'Diurno',
  duracion: 10,
  matricula: 120000,
  arancel: 3000000,
  nivel: 'Pregrado',
  descripcion: 'Descripción',
};

describe('Validaciones', () => {
  it('acepta un RUN con dígito verificador correcto', () => {
    expect(validarRun('12.345.678-5')).toBe(true);
  });

  it('rechaza un RUN con dígito verificador incorrecto', () => {
    expect(validarRun('12345678-9')).toBe(false);
  });

  it('valida correo y contraseña obligatorios en Login', () => {
    expect(validateLogin({ correo: 'correo-invalido', contrasena: '' })).toEqual({
      correo: expect.stringMatching(/correo/i),
      contrasena: expect.stringMatching(/contraseña/i),
    });
  });

  it('acepta login con correo válido y contraseña de rango permitido', () => {
    expect(validateLogin({ correo: 'estudiante@gmail.com', contrasena: 'abc12345' })).toEqual({});
  });

  it('detecta comentario vacío sin marcar el resto de Contacto', () => {
    expect(
      validateContacto({ nombre: 'Ana', correo: 'ana@example.com', comentario: '  ' }),
    ).toEqual({
      comentario: expect.any(String),
    });
  });

  it('acepta formulario de contacto completo', () => {
    expect(
      validateContacto({
        nombre: 'Ana',
        correo: 'ana@example.com',
        comentario: 'Quisiera orientación.',
      }),
    ).toEqual({});
  });

  it('detecta registro sin comuna ni RUN válido', () => {
    const errors = validateRegistro({
      run: '12345678-9',
      nombre: 'Ana',
      apellidos: 'Pérez',
      correo: 'ana@example.com',
      region: 'Biobío',
      comuna: '',
      direccion: 'Calle de ejemplo',
    });
    expect(errors.run).toMatch(/RUN/i);
    expect(errors.comuna).toBeTruthy();
  });

  it('rechaza arancel negativo en una oferta', () => {
    expect(validateOferta({ ...offer, arancel: -1 }).arancel).toMatch(/negativo/i);
  });

  it('rechaza una oferta sin carrera y con duración inválida', () => {
    const errors = validateOferta({ ...offer, carrera: ' ', duracion: 0 });
    expect(errors.carrera).toBeTruthy();
    expect(errors.duracion).toBeTruthy();
  });

  it('acepta una oferta académica completa', () => {
    expect(validateOferta(offer)).toEqual({});
  });

  it('rechaza cupos negativos y un umbral de cupos que no sea entero', () => {
    const errores = validateOferta({ ...offer, cupos: -2, cupoCritico: 1.5 });
    expect(errores.cupos).toBeTruthy();
    expect(errores.cupoCritico).toBeTruthy();
  });
});
