import { beforeEach, describe, expect, it } from 'vitest';
import { seedUsuarios } from '../data/seed';
import { cargarSesion, cerrarSesion, destinoRol, iniciarSesion } from './auth';

describe('Sesión de demostración', () => {
  beforeEach(() => sessionStorage.clear());

  it('inicia sesión con una cuenta activa y dirige al panel de su rol', () => {
    const sesion = iniciarSesion('ORIENTADOR@DUOC.CL', '1234', seedUsuarios, sessionStorage);
    expect(sesion).toMatchObject({ correo: 'orientador@duoc.cl', rol: 'Orientador' });
    expect(destinoRol(sesion!.rol)).toBe('/orientador');
    expect(cargarSesion(seedUsuarios, sessionStorage)).toEqual(sesion);
  });

  it('rechaza contraseñas incorrectas y cuentas inactivas', () => {
    expect(iniciarSesion('estudiante@duoc.cl', 'incorrecta', seedUsuarios, sessionStorage)).toBeNull();
    const inactivos = seedUsuarios.map((usuario) => ({ ...usuario, estado: 'INACTIVO' as const }));
    expect(iniciarSesion('estudiante@duoc.cl', '1234', inactivos, sessionStorage)).toBeNull();
    expect(sessionStorage.getItem('edubio360:sesion')).toBeNull();
  });

  it('cierra la sesión y no recupera cuentas eliminadas', () => {
    iniciarSesion('admin@duoc.cl', '1234', seedUsuarios, sessionStorage);
    expect(cargarSesion(seedUsuarios.filter((usuario) => usuario.rol !== 'Administrador'), sessionStorage)).toBeNull();
    iniciarSesion('estudiante@duoc.cl', '1234', seedUsuarios, sessionStorage);
    cerrarSesion(sessionStorage);
    expect(cargarSesion(seedUsuarios, sessionStorage)).toBeNull();
  });
});
