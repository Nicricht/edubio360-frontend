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
  it('elimina el token vencido sin recurrir a una sesión simulada', async () => {
    sessionStorage.setItem('edubio360:jwt', 'vencido');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({ message: 'Vencido' }, 401)));
    expect(await recuperarReal(sessionStorage)).toBeNull();
    expect(sessionStorage.getItem('edubio360:jwt')).toBeNull();
  });
});
