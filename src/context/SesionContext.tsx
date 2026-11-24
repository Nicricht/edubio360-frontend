import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useDatos } from './DatosContext';
import { cargarSesion, cerrarSesion, iniciarSesion, type Sesion } from '../services/auth';
import { realApi, ingresarReal, recuperarReal, salirReal } from '../services/authApi';

interface SesionValue {
  sesion: Sesion | null;
  cargando: boolean;
  ingresar(correo: string, clave: string): Sesion | null | Promise<Sesion>;
  salir(): void;
}
const Context = createContext<SesionValue | null>(null);

export function SesionProvider({ children }: { children: ReactNode }) {
  const { usuarios } = useDatos();
  const [sesion, setSesion] = useState(() => realApi ? null : cargarSesion(usuarios, sessionStorage));
  const [cargando, setCargando] = useState(realApi);
  const revision = useRef(0);

  useEffect(() => {
    if (!realApi) return;
    let activo = true;
    const actual = revision.current;
    recuperarReal(sessionStorage).then(s => {
      if (activo && actual === revision.current) { setSesion(s); setCargando(false); }
    });
    return () => { activo = false; };
  }, []);

  useEffect(() => {
    if (realApi) return;
    const actual = cargarSesion(usuarios, sessionStorage);
    if (JSON.stringify(actual) !== JSON.stringify(sesion)) setSesion(actual);
  }, [usuarios, sesion]);

  return <Context.Provider value={{
    sesion, cargando,
    ingresar: (correo, clave) => {
      if (realApi) {
        const actual = ++revision.current;
        return ingresarReal(correo, clave, sessionStorage).then(s => {
          if (actual === revision.current) { setSesion(s); setCargando(false); }
          return s;
        });
      }
      const actual = iniciarSesion(correo, clave, usuarios, sessionStorage);
      setSesion(actual);
      return actual;
    },
    salir: () => {
      revision.current++;
      salirReal(sessionStorage);
      cerrarSesion(sessionStorage);
      setSesion(null);
      setCargando(false);
    },
  }}>{children}</Context.Provider>;
}
export function useSesion(): SesionValue {
  const valor = useContext(Context);
  if (!valor) throw new Error('Falta SesionProvider');
  return valor;
}
