import type { Oferta, Repository, Usuario } from '../types';
import { seedOfertas, seedUsuarios } from '../data/seed';

function repository<T extends { id: string }>(
  storage: Storage,
  key: string,
  seed: T[],
  valid: (item: unknown) => item is T,
): Repository<T> {
  function read(): T[] {
    try {
      const saved = storage.getItem(key);
      if (saved === null) return [...seed];
      const parsed: unknown = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.every(valid) ? [...parsed] : [...seed];
    } catch {
      return [...seed];
    }
  }

  function write(items: T[]): void {
    storage.setItem(key, JSON.stringify(items));
  }

  return {
    list: read,
    get: (id) => read().find((item) => item.id === id),
    create: (item) => {
      const items = read();
      if (items.some((existing) => existing.id === item.id))
        throw new Error('Ya existe un registro con ese identificador');
      write([...items, item]);
      return item;
    },
    update: (id, changes) => {
      const items = read();
      const index = items.findIndex((item) => item.id === id);
      if (index < 0) return undefined;
      const updated = { ...items[index], ...changes, id };
      items[index] = updated;
      write(items);
      return updated;
    },
    remove: (id) => {
      const items = read();
      const filtered = items.filter((item) => item.id !== id);
      if (filtered.length === items.length) return false;
      write(filtered);
      return true;
    },
  };
}

function validOferta(value: unknown): value is Oferta {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Partial<Oferta>;
  return (
    typeof v.id === 'string' &&
    typeof v.carrera === 'string' &&
    typeof v.institucion === 'string' &&
    typeof v.comuna === 'string' &&
    typeof v.area === 'string' &&
    typeof v.arancel === 'number' &&
    typeof v.matricula === 'number' &&
    typeof v.duracion === 'number' &&
    typeof v.modalidad === 'string' &&
    typeof v.jornada === 'string' &&
    typeof v.nivel === 'string' &&
    typeof v.descripcion === 'string'
  );
}

function validUsuario(value: unknown): value is Usuario {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Partial<Usuario>;
  return (
    typeof v.id === 'string' &&
    typeof v.run === 'string' &&
    typeof v.nombre === 'string' &&
    typeof v.correo === 'string' &&
    (v.rol === 'Estudiante' || v.rol === 'Orientador' || v.rol === 'Administrador')
  );
}

export function createOfertaRepository(storage: Storage): Repository<Oferta> {
  return repository(storage, 'edubio360:ofertas', seedOfertas, validOferta);
}

export function createUsuarioRepository(storage: Storage): Repository<Usuario> {
  return repository(storage, 'edubio360:usuarios', seedUsuarios, validUsuario);
}
