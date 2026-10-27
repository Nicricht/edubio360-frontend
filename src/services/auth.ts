import type { Usuario } from '../types';

export interface Sesion {
  correo: string;
  nombre: string;
  rol: Usuario['rol'];
}

const claveSesion = 'edubio360:sesion';

export function iniciarSesion(correo: string, clave: string, usuarios: Usuario[], storage: Storage): Sesion | null {
  const usuario = usuarios.find((item) => item.correo.toLowerCase() === correo.trim().toLowerCase());
  if (!usuario || usuario.estado === 'INACTIVO' || clave !== '1234') return null;
  const sesion: Sesion = {
    correo: usuario.correo.toLowerCase(),
    nombre: `${usuario.nombre} ${usuario.apellidos}`.trim(),
    rol: usuario.rol,
  };
  storage.setItem(claveSesion, JSON.stringify(sesion));
  return sesion;
}

export function cargarSesion(usuarios: Usuario[], storage: Storage): Sesion | null {
  try {
    const sesion = JSON.parse(storage.getItem(claveSesion) || 'null') as Sesion | null;
    if (!sesion || typeof sesion.correo !== 'string') return null;
    const usuario = usuarios.find((item) => item.correo.toLowerCase() === sesion.correo);
    if (!usuario || usuario.estado === 'INACTIVO') {
      storage.removeItem(claveSesion);
      return null;
    }
    return { correo: usuario.correo.toLowerCase(), rol: usuario.rol, nombre: `${usuario.nombre} ${usuario.apellidos}`.trim() };
  } catch {
    storage.removeItem(claveSesion);
    return null;
  }
}

export function cerrarSesion(storage: Storage): void {
  storage.removeItem(claveSesion);
}

export function destinoRol(rol: Usuario['rol']): string {
  return rol === 'Administrador' ? '/admin' : rol === 'Orientador' ? '/orientador' : '/estudiante';
}
