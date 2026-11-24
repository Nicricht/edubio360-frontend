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
    let timer: number | undefined;
    const recuperar = async () => {
      const s = await recuperarReal(sessionStorage);
      if (!activo || actual !== revision.current) return;
      if (!s && sessionStorage.getItem('edubio360:jwt')) {
        timer = window.setTimeout(() => void recuperar(), 5000);
        return;
      }
      setSesion(s);
      setCargando(false);
      if (s?.token) void sincronizarUsuarios(s.token, s.rol);
    };
    void recuperar();
    return () => { activo = false; window.clearTimeout(timer); };
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
    let activo = true;
    let timer: number | undefined;
    const actual = revision.current;
    const verificar = async () => {
      if (!activo || actual !== revision.current || sessionStorage.getItem('edubio360:jwt') !== jwt) return;
      const s = await recuperarReal(sessionStorage);
      if (!activo || actual !== revision.current) return;
      const almacenado = sessionStorage.getItem('edubio360:jwt');
      if (!s && !almacenado) { setSesion(null); setCargando(false); limpiarUsuarios(); return; }
      if (s && almacenado === s.token) {
        setSesion(s);
        setCargando(false);
        if (s.token && s.token !== jwt) { void sincronizarUsuarios(s.token, s.rol); return; }
        timer = window.setTimeout(() => void verificar(), 60000);
      } else if (!s && almacenado === jwt) {
        // Bloquear las rutas protegidas hasta que el servidor vuelva a validar.
        setCargando(true);
        timer = window.setTimeout(() => void verificar(), 5000);
      }
    };
    timer = window.setTimeout(() => void verificar(), 60000);
    return () => { activo = false; window.clearTimeout(timer); };
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
