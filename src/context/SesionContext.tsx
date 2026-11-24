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
  const { usuarios, sincronizarUsuarios, limpiarUsuarios } = useDatos();
  const [sesion, setSesion] = useState(() => realApi ? null : cargarSesion(usuarios, sessionStorage));
  const [cargando, setCargando] = useState(realApi);
  const revision = useRef(0);

  useEffect(() => {
    if (!realApi) return;
    let activo = true;
    const actual = revision.current;
    recuperarReal(sessionStorage).then(s => {
      if (activo && actual === revision.current) { setSesion(s); setCargando(false); if (s?.token) void sincronizarUsuarios(s.token, s.rol); }
    });
    return () => { activo = false; };
  }, []);

  useEffect(() => {
    if (realApi) return;
    const actual = cargarSesion(usuarios, sessionStorage);
    if (JSON.stringify(actual) !== JSON.stringify(sesion)) setSesion(actual);
  }, [usuarios, sesion]);

  useEffect(() => {
    if (!realApi) return;
    const invalidar = (evento: Event) => {
      const token = (evento as CustomEvent<string>).detail;
      if (sessionStorage.getItem('edubio360:jwt') !== token) return;
      revision.current++;
      salirReal(sessionStorage);
      limpiarUsuarios();
      setSesion(null);
      setCargando(false);
    };
    window.addEventListener('edubio360:sesion-invalida', invalidar);
    return () => window.removeEventListener('edubio360:sesion-invalida', invalidar);
  }, [limpiarUsuarios]);

  useEffect(() => {
    if (!realApi || !sesion?.token) return;
    const jwt = sesion.token;
    const timer = window.setInterval(() => {
      if (sessionStorage.getItem('edubio360:jwt') !== jwt) return;
      void recuperarReal(sessionStorage).then(s => {
        if (sessionStorage.getItem('edubio360:jwt') !== jwt && s) return;
        if (!s && !sessionStorage.getItem('edubio360:jwt')) { setSesion(null); limpiarUsuarios(); }
        else if (s) setSesion(s);
      });
    }, 60000);
    return () => window.clearInterval(timer);
  }, [sesion?.token]);

  return <Context.Provider value={{
    sesion, cargando,
    ingresar: (correo, clave) => {
      if (realApi) {
        const actual = ++revision.current;
        return ingresarReal(correo, clave, sessionStorage).then(s => {
          if (actual === revision.current) { setSesion(s); setCargando(false); if (s.token) void sincronizarUsuarios(s.token, s.rol); }
          return s;
        });
      }
      const actual = iniciarSesion(correo, clave, usuarios, sessionStorage);
      setSesion(actual);
      return actual;
    },
    salir: () => {
      revision.current++;
      limpiarUsuarios();
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
