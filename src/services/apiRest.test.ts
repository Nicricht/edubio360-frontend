import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, apiRest } from './apiRest';
import { catalogoApi } from './catalogoApi';
import { solicitudesApi } from './solicitudesApi';

afterEach(() => vi.unstubAllGlobals());

function mockFetch(body: unknown, status = 200) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('Servicios REST de catálogo y orientación', () => {
  it('codifica la búsqueda y envía el token', async () => {
    const fetchMock = mockFetch([{ id: 1 }]);
    expect(await catalogoApi.listar('Tecnología y salud', 'jwt-prueba')).toEqual([{ id: 1 }]);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toContain('/api/ofertas?q=Tecnolog%C3%ADa%20y%20salud');
    expect(options.headers.get('Authorization')).toBe('Bearer jwt-prueba');
  });

  it('envía datos de creación con POST y JSON', async () => {
    const data = { carrera: 'Prueba', modalidad: 'Presencial', jornada: 'Diurna', arancel: 100, matricula: 10, sedeId: 1 };
    const fetchMock = mockFetch({ id: 2, ...data }, 201);
    expect((await catalogoApi.crear(data, 'jwt')).id).toBe(2);
    const [, options] = fetchMock.mock.calls[0];
    expect(options.method).toBe('POST');
    expect(JSON.parse(options.body)).toEqual(data);
    expect(options.headers.get('Content-Type')).toBe('application/json');
  });

  it('maneja la respuesta 204 al eliminar', async () => {
    const fetchMock = mockFetch(null, 204);
    expect(await catalogoApi.eliminar(1, 'jwt')).toBeUndefined();
    expect(fetchMock.mock.calls[0][1].method).toBe('DELETE');
  });

  it('consulta las solicitudes propias sin enviar un correo manipulable', async () => {
    const fetchMock = mockFetch([]);
    await solicitudesApi.mias('jwt');
    expect(fetchMock.mock.calls[0][0]).toContain('/api/solicitudes/mias');
  });

  it('propaga el error del servidor sin simular éxito local', async () => {
    mockFetch({ message: 'Acceso denegado' }, 403);
    await expect(apiRest('/api/ofertas', {}, 'jwt')).rejects.toMatchObject({ status: 403, message: 'Acceso denegado' });
    await expect(apiRest('/api/ofertas')).rejects.toBeInstanceOf(ApiError);
  });
});
