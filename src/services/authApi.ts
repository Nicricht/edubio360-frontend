import { apiRest } from './apiRest';
import type { Sesion } from './auth';
import { desdeUsuarioApi, type UsuarioApi } from './usuariosApi';

export const realApi = import.meta.env.VITE_REAL_API === 'true' || (import.meta.env.MODE !== 'test' && import.meta.env.VITE_REAL_API !== 'false');
const key = 'edubio360:jwt';
interface LoginResponse { token: string; email: string; role: string }
type UserResponse = UsuarioApi;

function session(user: UserResponse, token: string): Sesion {
  const roles = { STUDENT: 'Estudiante', ORIENTADOR: 'Orientador', ADMIN: 'Administrador' } as const;
  if (!user.active || !Object.prototype.hasOwnProperty.call(roles, user.role)) throw new Error('Sesión inválida');
  const perfil = desdeUsuarioApi(user);
  return { correo: user.email, nombre: (perfil.nombre + ' ' + perfil.apellidos).trim() || user.email, rol: roles[user.role as keyof typeof roles], token };
}

export async function ingresarReal(correo: string, clave: string, storage: Storage): Promise<Sesion> {
  const login = await apiRest<LoginResponse>('/api/auth/login', {
    method: 'POST', body: JSON.stringify({ email: correo.trim(), password: clave }),
  });
  const user = await apiRest<UserResponse>('/api/auth/me', {}, login.token);
  const actual = session(user, login.token);
  if (login.email !== user.email || login.role !== user.role) throw new Error('La sesión cambió, vuelve a ingresar.');
  storage.setItem(key, login.token);
  return actual;
}

function requiereRenovacion(token: string): boolean {
  try {
    const segmento = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(segmento));
    // La lectura local solo determina cuándo consultar al servidor; no autentica.
    return typeof payload.exp === 'number' && payload.exp * 1000 - Date.now() <= 180000;
  } catch { return false; }
}

export async function recuperarReal(storage: Storage): Promise<Sesion | null> {
  const token = storage.getItem(key);
  if (!token) return null;
  try {
    const user = await apiRest<UserResponse>('/api/auth/me', {}, token);
    if (storage.getItem(key) !== token) return null;
    const actual = session(user, token);
    if (!requiereRenovacion(token)) return actual;
    const renovado = await apiRest<LoginResponse>('/api/auth/refresh', { method: 'POST' }, token);
    if (storage.getItem(key) !== token) return null;
    if (renovado.email !== user.email || renovado.role !== user.role) throw new Error('Sesión modificada');
    const nueva = session(user, renovado.token);
    storage.setItem(key, renovado.token);
    return nueva;
  } catch {
    if (storage.getItem(key) === token) storage.removeItem(key);
    return null;
  }
}

export function salirReal(storage: Storage) {
  storage.removeItem(key);
}
