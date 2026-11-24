import { apiRest } from './apiRest';
import type { Usuario } from '../types';

export type PerfilApi = Pick<Usuario, 'run' | 'nombre' | 'apellidos' | 'region' | 'comuna' | 'direccion'>;
export interface UsuarioApi { id: number; email: string; role: string; active: boolean; perfil?: Partial<PerfilApi> | null }
const roles = { STUDENT: 'Estudiante', ORIENTADOR: 'Orientador', ADMIN: 'Administrador' } as const;
const rolesApi = { Estudiante: 'STUDENT', Orientador: 'ORIENTADOR', Administrador: 'ADMIN' } as const;

export function desdeUsuarioApi(u: UsuarioApi): Usuario {
  if (!Object.prototype.hasOwnProperty.call(roles, u.role)) throw new Error('Rol no válido');
  return { id: String(u.id), correo: u.email, rol: roles[u.role as keyof typeof roles], estado: u.active ? 'ACTIVO' : 'INACTIVO',
    run: u.perfil?.run ?? '', nombre: u.perfil?.nombre ?? '', apellidos: u.perfil?.apellidos ?? '',
    region: u.perfil?.region ?? '', comuna: u.perfil?.comuna ?? '', direccion: u.perfil?.direccion ?? '' };
}
export function perfilDe(u: PerfilApi): PerfilApi {
  return { run: u.run, nombre: u.nombre, apellidos: u.apellidos, region: u.region, comuna: u.comuna, direccion: u.direccion };
}
function entrada(u: Usuario, password?: string) {
  return { email: u.correo, role: rolesApi[u.rol], active: u.estado !== 'INACTIVO', perfil: perfilDe(u), password: password || undefined };
}
export const usuariosApi = {
  registrar(u: Pick<Usuario, 'correo'> & PerfilApi, password: string) {
    return apiRest<UsuarioApi>('/api/auth/register', { method: 'POST', body: JSON.stringify({ email: u.correo, password, perfil: perfilDe(u) }) });
  },
  listar(token: string) { return apiRest<UsuarioApi[]>('/api/usuarios', {}, token); },
  perfil(token: string) { return apiRest<UsuarioApi>('/api/auth/me', {}, token); },
  actualizarPerfil(u: PerfilApi, token: string) {
    return apiRest<UsuarioApi>('/api/auth/me', { method: 'PUT', body: JSON.stringify(perfilDe(u)) }, token);
  },
  crear(u: Usuario, password: string, token: string) {
    return apiRest<UsuarioApi>('/api/usuarios', { method: 'POST', body: JSON.stringify(entrada(u, password)) }, token);
  },
  actualizar(u: Usuario, token: string, password?: string) {
    return apiRest<UsuarioApi>('/api/usuarios/' + u.id, { method: 'PUT', body: JSON.stringify(entrada(u, password)) }, token);
  },
  eliminar(id: string, token: string) { return apiRest<void>('/api/usuarios/' + id, { method: 'DELETE' }, token); },
};
