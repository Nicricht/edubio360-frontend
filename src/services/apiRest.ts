export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const base = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export async function apiRest<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  if (options.body) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', 'Bearer ' + token);

  const response = await fetch(base + path, { ...options, headers });
  if (!response.ok) {
    if (response.status === 401 && token && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('edubio360:sesion-invalida', { detail: token }));
    }
    const error: unknown = await response.json().catch(() => null);
    const message = error && typeof error === 'object' && 'message' in error &&
      typeof error.message === 'string' ? error.message : 'Error HTTP ' + response.status;
    throw new ApiError(response.status, message);
  }
  if (response.status === 204) return undefined as T;
  return await response.json() as T;
}
