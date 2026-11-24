import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Sesion } from '../services/auth';
import { useSesion } from './SesionContext';
import { useDatos } from './DatosContext';
import { realApi } from '../services/authApi';
import { solicitudesApi, type SolicitudApi } from '../services/solicitudesApi';
import { avisosPropios, marcarAvisos, estadoServidor, solicitudVista } from '../services/orientacionAdapter';
import {
  actualizarSolicitud, crearSolicitud, listarSolicitudes,
  marcarNotificacionesLeidas, type AccionSolicitud, type Solicitud, type Notificacion,
} from '../services/orientacion';

interface OrientacionValue {
  solicitudes: Solicitud[];
  cargando: boolean;
  error: string;
  notificaciones(correo: string): Notificacion[];
  enviar(sesion: Sesion, datos: Pick<Solicitud, 'ofertaId' | 'oferta' | 'motivo' | 'fecha' | 'ofertasComparadas'>): Solicitud | Promise<Solicitud>;
  cambiar(id: string, sesion: Sesion, accion: AccionSolicitud): Solicitud | null | Promise<Solicitud | null>;
  leer(correo: string): void | Promise<void>;
}

const Context = createContext<OrientacionValue | null>(null);

export function OrientacionProvider({ children }: { children: ReactNode }) {
  const { sesion } = useSesion();
  const { ofertas } = useDatos();
  const [locales, setLocales] = useState(() => realApi ? [] : listarSolicitudes(localStorage));
  const [remotas, setRemotas] = useState<SolicitudApi[]>([]);
  const [avisos, setAvisos] = useState<Notificacion[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const jwt = sesion?.token;
  const rol = sesion?.rol;
  const solicitudes = realApi ? remotas.map(s => solicitudVista(s, ofertas)) : locales;

  useEffect(() => {
    if (realApi) return;
    const refrescar = () => {
      setLocales(listarSolicitudes(localStorage));
      try {
        const almacenadas = JSON.parse(localStorage.getItem('edubio360:notificaciones') || '[]') as Notificacion[];
        setAvisos(Array.isArray(almacenadas) ? almacenadas : []);
      } catch { setAvisos([]); }
    };
    refrescar();
    window.addEventListener('edubio360:orientaciones', refrescar);
    window.addEventListener('storage', refrescar);
    return () => {
      window.removeEventListener('edubio360:orientaciones', refrescar);
      window.removeEventListener('storage', refrescar);
    };
  }, []);

  useEffect(() => {
    if (!realApi) return;
    setRemotas([]); setAvisos([]); setError('');
    if (!jwt) { setCargando(false); return; }
    let vigente = true;
    setCargando(true);
    const cargar = async () => {
      try {
        const lista = rol === 'Estudiante' ? solicitudesApi.mias(jwt) : rol === 'Orientador' ? solicitudesApi.disponibles(jwt) : solicitudesApi.listar(jwt);
        const [items, notificaciones] = await Promise.all([lista, avisosPropios(jwt)]);
        if (vigente) { setRemotas(items); setAvisos(notificaciones); setError(''); }
      } catch { if (vigente) setError('No fue posible consultar las orientaciones.'); }
      finally { if (vigente) setCargando(false); }
    };
    void cargar();
    const intervalo = window.setInterval(cargar, 30000);
    return () => { vigente = false; window.clearInterval(intervalo); };
  }, [jwt, rol]);

  function token() {
    if (!jwt) throw new Error('Inicia sesión nuevamente.');
    return jwt;
  }
  function guardar(item: SolicitudApi) {
    if (sessionStorage.getItem('edubio360:jwt') === jwt) {
      setRemotas(prev => [...prev.filter(x => x.id !== item.id), item]);
    }
    return solicitudVista(item, ofertas);
  }

  return <Context.Provider value={{
    solicitudes, cargando, error,
    notificaciones: correo => avisos.filter(item => item.correo === correo),
    enviar: (actual, datos) => {
      if (!realApi) return crearSolicitud(localStorage, actual, datos);
      return solicitudesApi.crear({ ofertaId: Number(datos.ofertaId), motivo: datos.motivo,
        fechaHora: datos.fecha + 'T23:59:00', ofertasComparadas: datos.ofertasComparadas?.map(o => Number(o.id)) }, token()).then(guardar);
    },
    cambiar: (id, actual, accion) => {
      if (!realApi) return actualizarSolicitud(localStorage, id, actual, accion);
      const n = Number(id);
      const t = token();
      const anterior = solicitudes.find(s => s.id === id);
      if (!anterior) return null;
      if (accion.tipo === 'TOMAR') return solicitudesApi.confirmar(n, t).then(guardar);
      if (accion.tipo === 'CANCELAR') return solicitudesApi.cancelar(n, t).then(guardar);
      if (accion.tipo === 'REPROGRAMAR') return solicitudesApi.reprogramar(n, anterior.motivo, accion.fecha + 'T23:59:00', t).then(guardar);
      return solicitudesApi.gestionar(n, { estado: estadoServidor(accion.estado),
        fechaHora: accion.fecha ? accion.fecha + 'T23:59:00' : undefined,
        resultado: accion.resultado, observacion: accion.observacion }, t).then(guardar);
    },
    leer: correo => {
      if (!realApi) return marcarNotificacionesLeidas(localStorage, correo);
      return marcarAvisos(token()).then(() => setAvisos(prev => prev.map(n => ({ ...n, leida: true }))));
    },
  }}>{children}</Context.Provider>;
}

export function useOrientacion(): OrientacionValue {
  const valor = useContext(Context);
  if (!valor) throw new Error('Falta OrientacionProvider');
  return valor;
}
