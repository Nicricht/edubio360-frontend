import { afterEach, describe, expect, it, vi } from 'vitest';
import { ingresarReal, recuperarReal, salirReal } from './authApi';

afterEach(() => { vi.unstubAllGlobals(); sessionStorage.clear(); });

function response(data: unknown, status = 200) {
  return { ok: status < 400, status, json: async () => data };
}

describe('Autenticación REST', () => {
  it('obtiene JWT y valida el rol con el servidor', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(response({ token: 'jwt', email: 'a@example.test', role: 'ADMIN' }))
      .mockResolvedValueOnce(response({ id: 1, email: 'a@example.test', role: 'ADMIN', active: true }));
    vi.stubGlobal('fetch', fetchMock);
    const sesion = await ingresarReal('a@example.test', 'clave-demo', sessionStorage);
    expect(sesion.rol).toBe('Administrador');
    expect(fetchMock.mock.calls[1][1].headers.get('Authorization')).toBe('Bearer jwt');
    expect(sessionStorage.getItem('edubio360:jwt')).toBe('jwt');
    salirReal(sessionStorage);
    expect(sessionStorage.getItem('edubio360:jwt')).toBeNull();
  });
  it('recupera la sesión por API tras recargar', async () => {
    sessionStorage.setItem('edubio360:jwt', 'jwt');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({ id: 2, email: 's@example.test', role: 'STUDENT', active: true })));
    expect((await recuperarReal(sessionStorage))?.rol).toBe('Estudiante');
  });
  it('renueva un JWT próximo a vencer y conserva solo el nuevo', async () => {
    const token = 'header.' + btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 120 })) + '.signature';
    sessionStorage.setItem('edubio360:jwt', token);
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(response({ id: 2, email: 's@example.test', role: 'STUDENT', active: true }))
      .mockResolvedValueOnce(response({ token: 'nuevo-jwt', email: 's@example.test', role: 'STUDENT' }));
    vi.stubGlobal('fetch', fetchMock);
    expect((await recuperarReal(sessionStorage))?.token).toBe('nuevo-jwt');
    expect(sessionStorage.getItem('edubio360:jwt')).toBe('nuevo-jwt');
    expect(fetchMock.mock.calls[1][0]).toContain('/api/auth/refresh');
    expect(fetchMock.mock.calls[1][1].headers.get('Authorization')).toBe('Bearer ' + token);
  });
  it('no vuelve a iniciar sesión si el usuario salió durante una renovación', async () => {
    const token = 'header.' + btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 120 })) + '.signature';
    sessionStorage.setItem('edubio360:jwt', token);
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(response({ id: 2, email: 's@example.test', role: 'STUDENT', active: true }))
      .mockImplementationOnce(async () => {
        salirReal(sessionStorage);
        return response({ token: 'nuevo-jwt', email: 's@example.test', role: 'STUDENT' });
      }));
    expect(await recuperarReal(sessionStorage)).toBeNull();
    expect(sessionStorage.getItem('edubio360:jwt')).toBeNull();
  });
  it('conserva el token ante HTTP 503 y lo verifica al recuperarse el servidor', async () => {
    sessionStorage.setItem('edubio360:jwt', 'jwt');
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(response({ message: 'Servicio temporalmente no disponible' }, 503))
      .mockResolvedValueOnce(response({ id: 2, email: 's@example.test', role: 'STUDENT', active: true })));
    expect(await recuperarReal(sessionStorage)).toBeNull();
    expect(sessionStorage.getItem('edubio360:jwt')).toBe('jwt');
    expect((await recuperarReal(sessionStorage))?.rol).toBe('Estudiante');
  });
  it('no borra el token durante una interrupción de red', async () => {
    sessionStorage.setItem('edubio360:jwt', 'jwt');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    expect(await recuperarReal(sessionStorage)).toBeNull();
    expect(sessionStorage.getItem('edubio360:jwt')).toBe('jwt');
  });
  it('conserva el token si falla temporalmente la renovación', async () => {
    const token = 'header.' + btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 120 })) + '.signature';
    sessionStorage.setItem('edubio360:jwt', token);
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(response({ id: 2, email: 's@example.test', role: 'STUDENT', active: true }))
      .mockResolvedValueOnce(response({ message: 'No disponible' }, 503)));
    expect(await recuperarReal(sessionStorage)).toBeNull();
    expect(sessionStorage.getItem('edubio360:jwt')).toBe(token);
  });
  it('elimina el token vencido sin recurrir a una sesión simulada', async () => {
    sessionStorage.setItem('edubio360:jwt', 'vencido');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({ message: 'Vencido' }, 401)));
    expect(await recuperarReal(sessionStorage)).toBeNull();
    expect(sessionStorage.getItem('edubio360:jwt')).toBeNull();
  });
});
