import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Oferta, Usuario } from '../types';
import { createOfertaRepository, createUsuarioRepository } from '../services/repositories';
import { realApi } from '../services/authApi';
import { catalogoApi, type SedeApi } from '../services/catalogoApi';
import { desdeApi, haciaApi } from '../services/catalogoAdapter';

export interface DatosValue {
  ofertas: Oferta[];
  sedes: SedeApi[];
  catalogoCargando: boolean;
  catalogoError: string;
  usuarios: Usuario[];
  comparadasIds: string[];
  compararError: string;
  toggleComparar(id: string): void;
  clearComparar(): void;
  createOferta(oferta: Oferta): void | Promise<void>;
  updateOferta(id: string, changes: Partial<Oferta>): void | Promise<void>;
  removeOferta(id: string): void | Promise<void>;
  createUsuario(usuario: Usuario): void;
  updateUsuario(id: string, changes: Partial<Usuario>): void;
  removeUsuario(id: string): void;
}

const Context = createContext<DatosValue | null>(null);

export function DatosProvider({ children }: { children: ReactNode }) {
  const ofertaRepo = useMemo(() => createOfertaRepository(localStorage), []);
  const usuarioRepo = useMemo(() => createUsuarioRepository(localStorage), []);
  const [ofertas, setOfertas] = useState(() => realApi ? [] : ofertaRepo.list());
  const [sedes, setSedes] = useState<SedeApi[]>([]);
  const [catalogoCargando, setCatalogoCargando] = useState(realApi);
  const [catalogoError, setCatalogoError] = useState('');
  const [usuarios, setUsuarios] = useState(() => usuarioRepo.list());
  const [comparadasIds, setComparadasIds] = useState<string[]>(() => {
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem('edubio360:comparadas') || '[]');
      return Array.isArray(parsed)
        ? parsed.filter(
            (id): id is string => typeof id === 'string' && (realApi || ofertaRepo.get(id) !== undefined),
          )
        : [];
    } catch {
      return [];
    }
  });
  const [compararError, setCompararError] = useState('');

  useEffect(() => {
    const sincronizar = (evento: StorageEvent) => {
      if (realApi) return;
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

  useEffect(() => {
    if (!realApi) return;
    let vigente = true;
    Promise.all([catalogoApi.listar(), catalogoApi.sedes()]).then(([items, ubicaciones]) => {
      if (vigente) { setOfertas(items.map(desdeApi)); setSedes(ubicaciones); }
    }).catch(() => { if (vigente) setCatalogoError('No fue posible cargar el catálogo desde el servidor.'); })
      .finally(() => { if (vigente) setCatalogoCargando(false); });
    return () => { vigente = false; };
  }, []);

  const token = () => {
    const jwt = sessionStorage.getItem('edubio360:jwt');
    if (!jwt) throw new Error('Inicia sesión para administrar ofertas.');
    return jwt;
  };

  const saveCompared = (next: string[]) => {
    localStorage.setItem('edubio360:comparadas', JSON.stringify(next));
    setComparadasIds(next);
  };

  const value: DatosValue = {
    ofertas, sedes, catalogoCargando, catalogoError,
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
      if (realApi) return catalogoApi.crear(haciaApi(oferta, sedes), token()).then(item => { setOfertas(prev => [...prev, desdeApi(item)]); });
      ofertaRepo.create(oferta);
      setOfertas(ofertaRepo.list());
    },
    updateOferta: (id, changes) => {
      if (realApi) {
        const actual = ofertas.find(o => o.id === id);
        if (!actual) throw new Error('Oferta no encontrada.');
        return catalogoApi.actualizar(Number(id), haciaApi({ ...actual, ...changes }, sedes), token()).then(item => {
          setOfertas(prev => prev.map(o => o.id === id ? desdeApi(item) : o));
        });
      }
      ofertaRepo.update(id, changes);
      setOfertas(ofertaRepo.list());
    },
    removeOferta: (id) => {
      if (realApi) return catalogoApi.eliminar(Number(id), token()).then(() => {
        setOfertas(prev => prev.filter(o => o.id !== id));
        if (comparadasIds.includes(id)) saveCompared(comparadasIds.filter(o => o !== id));
      });
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
