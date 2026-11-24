import { apiRest } from './apiRest';
import type { Sesion } from './auth';
import { desdeUsuarioApi, type UsuarioApi } from './usuariosApi';

export const realApi = import.meta.env.VITE_REAL_API === 'true';
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

export async function recuperarReal(storage: Storage): Promise<Sesion | null> {
  const token = storage.getItem(key);
  if (!token) return null;
  try {
    return session(await apiRest<UserResponse>('/api/auth/me', {}, token), token);
  } catch {
    storage.removeItem(key);
    return null;
  }
}

export function salirReal(storage: Storage) {
  storage.removeItem(key);
}
