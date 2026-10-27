import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Sesion } from '../services/auth';
import {
  actualizarSolicitud, crearSolicitud, listarSolicitudes,
  marcarNotificacionesLeidas, type AccionSolicitud, type Solicitud, type Notificacion,
} from '../services/orientacion';

interface OrientacionValue {
  solicitudes: Solicitud[];
  notificaciones(correo: string): Notificacion[];
  enviar(sesion: Sesion, datos: Pick<Solicitud, 'ofertaId' | 'oferta' | 'motivo' | 'fecha' | 'ofertasComparadas'>): Solicitud;
  cambiar(id: string, sesion: Sesion, accion: AccionSolicitud): Solicitud | null;
  leer(correo: string): void;
}

const Context = createContext<OrientacionValue | null>(null);

export function OrientacionProvider({ children }: { children: ReactNode }) {
  const [solicitudes, setSolicitudes] = useState(() => listarSolicitudes(localStorage));
  const [avisos, setAvisos] = useState<Notificacion[]>([]);

  useEffect(() => {
    const refrescar = () => {
      setSolicitudes(listarSolicitudes(localStorage));
      try {
        const almacenadas = JSON.parse(localStorage.getItem('edubio360:notificaciones') || '[]') as Notificacion[];
        setAvisos(Array.isArray(almacenadas) ? almacenadas : []);
      } catch {
        setAvisos([]);
      }
    };
    refrescar();
    window.addEventListener('edubio360:orientaciones', refrescar);
    window.addEventListener('storage', refrescar);
    return () => {
      window.removeEventListener('edubio360:orientaciones', refrescar);
      window.removeEventListener('storage', refrescar);
    };
  }, []);

  return <Context.Provider value={{
    solicitudes,
    notificaciones: (correo) => avisos.filter((item) => item.correo === correo),
    enviar: (sesion, datos) => crearSolicitud(localStorage, sesion, datos),
    cambiar: (id, sesion, accion) => actualizarSolicitud(localStorage, id, sesion, accion),
    leer: (correo) => marcarNotificacionesLeidas(localStorage, correo),
  }}>{children}</Context.Provider>;
}

export function useOrientacion(): OrientacionValue {
  const valor = useContext(Context);
  if (!valor) throw new Error('Falta OrientacionProvider');
  return valor;
}
