import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Oferta, Usuario } from '../types';
import { createOfertaRepository, createUsuarioRepository } from '../services/repositories';

export interface DatosValue {
  ofertas: Oferta[];
  usuarios: Usuario[];
  comparadasIds: string[];
  compararError: string;
  toggleComparar(id: string): void;
  clearComparar(): void;
  createOferta(oferta: Oferta): void;
  updateOferta(id: string, changes: Partial<Oferta>): void;
  removeOferta(id: string): void;
  createUsuario(usuario: Usuario): void;
  updateUsuario(id: string, changes: Partial<Usuario>): void;
  removeUsuario(id: string): void;
}

const Context = createContext<DatosValue | null>(null);

export function DatosProvider({ children }: { children: ReactNode }) {
  const ofertaRepo = useMemo(() => createOfertaRepository(localStorage), []);
  const usuarioRepo = useMemo(() => createUsuarioRepository(localStorage), []);
  const [ofertas, setOfertas] = useState(() => ofertaRepo.list());
  const [usuarios, setUsuarios] = useState(() => usuarioRepo.list());
  const [comparadasIds, setComparadasIds] = useState<string[]>(() => {
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem('edubio360:comparadas') || '[]');
      return Array.isArray(parsed)
        ? parsed.filter(
            (id): id is string => typeof id === 'string' && ofertaRepo.get(id) !== undefined,
          )
        : [];
    } catch {
      return [];
    }
  });
  const [compararError, setCompararError] = useState('');

  useEffect(() => {
    const sincronizar = (evento: StorageEvent) => {
      if (evento.key === 'edubio360:ofertas' || evento.key === null) setOfertas(ofertaRepo.list());
      if (evento.key === 'edubio360:usuarios' || evento.key === null) setUsuarios(usuarioRepo.list());
      if (evento.key === 'edubio360:comparadas' || evento.key === null) {
        try {
          const guardadas: unknown = JSON.parse(localStorage.getItem('edubio360:comparadas') || '[]');
          setComparadasIds(Array.isArray(guardadas) ? guardadas.filter((id): id is string => typeof id === 'string' && ofertaRepo.get(id) !== undefined).slice(0, 3) : []);
        } catch {
          setComparadasIds([]);
        }
      }
    };
    window.addEventListener('storage', sincronizar);
    return () => window.removeEventListener('storage', sincronizar);
  }, [ofertaRepo, usuarioRepo]);

  const saveCompared = (next: string[]) => {
    localStorage.setItem('edubio360:comparadas', JSON.stringify(next));
    setComparadasIds(next);
  };

  const value: DatosValue = {
    ofertas,
    usuarios,
    comparadasIds,
    compararError,
    toggleComparar: (id) => {
      if (!ofertas.some((oferta) => oferta.id === id)) return;
      setCompararError('');
      if (!comparadasIds.includes(id) && comparadasIds.length >= 3) {
        setCompararError('Puedes comparar hasta tres ofertas.');
        return;
      }
      const primera = ofertas.find((oferta) => oferta.id === comparadasIds[0]);
      const candidata = ofertas.find((oferta) => oferta.id === id);
      if (!comparadasIds.includes(id) && primera && candidata &&
        (primera.grupoComparacion || primera.carrera) !== (candidata.grupoComparacion || candidata.carrera)) {
        setCompararError('Selecciona carreras equivalentes para comparar.');
        return;
      }
      const next = comparadasIds.includes(id) ? comparadasIds.filter((current) => current !== id) : [...comparadasIds, id];
      saveCompared(next);
    },
    clearComparar: () => {
      setCompararError('');
      saveCompared([]);
    },
    createOferta: (oferta) => {
      ofertaRepo.create(oferta);
      setOfertas(ofertaRepo.list());
    },
    updateOferta: (id, changes) => {
      ofertaRepo.update(id, changes);
      setOfertas(ofertaRepo.list());
    },
    removeOferta: (id) => {
      ofertaRepo.remove(id);
      setOfertas(ofertaRepo.list());
      if (comparadasIds.includes(id))
        saveCompared(comparadasIds.filter((current) => current !== id));
    },
    createUsuario: (usuario) => {
      usuarioRepo.create(usuario);
      setUsuarios(usuarioRepo.list());
    },
    updateUsuario: (id, changes) => {
      usuarioRepo.update(id, changes);
      setUsuarios(usuarioRepo.list());
    },
    removeUsuario: (id) => {
      usuarioRepo.remove(id);
      setUsuarios(usuarioRepo.list());
    },
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useDatos(): DatosValue {
  const value = useContext(Context);
  if (!value) throw new Error('useDatos debe usarse dentro de DatosProvider');
  return value;
}
