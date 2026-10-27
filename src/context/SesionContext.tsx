import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useDatos } from './DatosContext';
import { cargarSesion, cerrarSesion, iniciarSesion, type Sesion } from '../services/auth';

interface SesionValue {
  sesion: Sesion | null;
  ingresar(correo: string, clave: string): Sesion | null;
  salir(): void;
}

const Context = createContext<SesionValue | null>(null);

export function SesionProvider({ children }: { children: ReactNode }) {
  const { usuarios } = useDatos();
  const [sesion, setSesion] = useState(() => cargarSesion(usuarios, sessionStorage));

  useEffect(() => {
    const actual = cargarSesion(usuarios, sessionStorage);
    if (JSON.stringify(actual) !== JSON.stringify(sesion)) setSesion(actual);
  }, [usuarios, sesion]);

  return <Context.Provider value={{
    sesion,
    ingresar: (correo, clave) => {
      const actual = iniciarSesion(correo, clave, usuarios, sessionStorage);
      setSesion(actual);
      return actual;
    },
    salir: () => {
      cerrarSesion(sessionStorage);
      setSesion(null);
    },
  }}>{children}</Context.Provider>;
}

export function useSesion(): SesionValue {
  const valor = useContext(Context);
  if (!valor) throw new Error('Falta SesionProvider');
  return valor;
}
