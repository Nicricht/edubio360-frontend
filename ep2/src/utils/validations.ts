import type { Oferta } from '../types';

export interface LoginInput {
  correo: string;
  contrasena: string;
}
export interface ContactoInput {
  nombre: string;
  correo: string;
  comentario: string;
}
export interface RegistroInput {
  run: string;
  nombre: string;
  apellidos: string;
  correo: string;
  region: string;
  comuna: string;
  direccion: string;
}
type Errors<T> = Partial<Record<keyof T, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarRun(run: string): boolean {
  const normalized = run.replace(/[.\s-]/g, '').toUpperCase();
  if (!/^\d{7,8}[\dK]$/.test(normalized)) return false;
  const number = normalized.slice(0, -1);
  const dv = normalized.slice(-1);
  let sum = 0;
  let factor = 2;
  for (let i = number.length - 1; i >= 0; i--) {
    sum += Number(number[i]) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  const result = 11 - (sum % 11);
  return (result === 11 ? '0' : result === 10 ? 'K' : String(result)) === dv;
}

export function validateLogin(data: LoginInput): Errors<LoginInput> {
  const errors: Errors<LoginInput> = {};
  if (!emailPattern.test(data.correo.trim()) || data.correo.length > 100)
    errors.correo = 'Ingresa un correo electrónico válido (máximo 100 caracteres).';
  if (data.contrasena.length < 4 || data.contrasena.length > 10)
    errors.contrasena = 'La contraseña debe tener entre 4 y 10 caracteres.';
  return errors;
}

export function validateContacto(data: ContactoInput): Errors<ContactoInput> {
  const errors: Errors<ContactoInput> = {};
  if (!data.nombre.trim() || data.nombre.length > 100)
    errors.nombre = 'Escribe tu nombre (máximo 100 caracteres).';
  if (!emailPattern.test(data.correo.trim()) || data.correo.length > 100)
    errors.correo = 'Ingresa un correo válido (máximo 100 caracteres).';
  if (!data.comentario.trim() || data.comentario.length > 500)
    errors.comentario = 'Escribe un comentario de hasta 500 caracteres.';
  return errors;
}

export function validateRegistro(data: RegistroInput): Errors<RegistroInput> {
  const errors: Errors<RegistroInput> = {};
  if (!validarRun(data.run)) errors.run = 'El RUN ingresado no es válido.';
  if (!data.nombre.trim() || data.nombre.length > 50)
    errors.nombre = 'El nombre es obligatorio (máximo 50 caracteres).';
  if (!data.apellidos.trim() || data.apellidos.length > 100)
    errors.apellidos = 'Los apellidos son obligatorios (máximo 100 caracteres).';
  if (!emailPattern.test(data.correo.trim()) || data.correo.length > 100)
    errors.correo = 'Ingresa un correo electrónico válido.';
  if (!data.region) errors.region = 'Selecciona una región.';
  if (!data.comuna) errors.comuna = 'Selecciona una comuna.';
  if (!data.direccion.trim() || data.direccion.length > 300)
    errors.direccion = 'La dirección es obligatoria (máximo 300 caracteres).';
  return errors;
}

export function validateOferta(data: Oferta): Errors<Oferta> {
  const errors: Errors<Oferta> = {};
  for (const field of [
    'carrera',
    'institucion',
    'comuna',
    'area',
    'modalidad',
    'jornada',
    'nivel',
    'descripcion',
  ] as const) {
    if (!data[field].trim()) errors[field] = 'Este campo es obligatorio.';
  }
  if (!Number.isFinite(data.arancel) || data.arancel < 0)
    errors.arancel = 'El arancel no puede ser negativo.';
  if (!Number.isFinite(data.matricula) || data.matricula < 0)
    errors.matricula = 'La matrícula no puede ser negativa.';
  if (!Number.isInteger(data.duracion) || data.duracion <= 0 || data.duracion > 24)
    errors.duracion = 'La duración debe ser entre 1 y 24 semestres.';
  if (data.cupos !== undefined && (!Number.isInteger(data.cupos) || data.cupos < 0))
    errors.cupos = 'Los cupos deben ser un número entero no negativo.';
  if (data.cupoCritico !== undefined && (!Number.isInteger(data.cupoCritico) || data.cupoCritico < 0))
    errors.cupoCritico = 'El umbral debe ser un número entero no negativo.';
  return errors;
}
