import { afterEach, describe, expect, it, vi } from 'vitest';
import { usuariosApi, desdeUsuarioApi } from './usuariosApi';

afterEach(() => vi.unstubAllGlobals());
const perfil = { run: '12345678-5', nombre: 'Ana', apellidos: 'Prueba', region: 'Biobío', comuna: 'Concepción', direccion: 'Prueba' };
const registro = { id: 7, email: 'ana@example.test', role: 'STUDENT', active: true, perfil };

describe('Usuarios REST', () => {
  it('registra cuenta con perfil sin pedir rol privilegiado', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 201, json: async () => registro });
    vi.stubGlobal('fetch', fetchMock);
    expect(desdeUsuarioApi(await usuariosApi.registrar({ correo: registro.email, ...perfil }, 'clave-prueba')).nombre).toBe('Ana');
    const payload = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(payload.role).toBeUndefined();
    expect(payload.perfil).toEqual(perfil);
  });
  it('edita usuario sin enviar una contraseña nueva si no corresponde', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => registro });
    vi.stubGlobal('fetch', fetchMock);
    await usuariosApi.actualizar(desdeUsuarioApi(registro), 'jwt');
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).password).toBeUndefined();
    expect(fetchMock.mock.calls[0][1].headers.get('Authorization')).toBe('Bearer jwt');
  });
});
