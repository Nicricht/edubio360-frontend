import { Link } from 'react-router-dom';
import { useSesion } from '../context/SesionContext';
import { useOrientacion } from '../context/OrientacionContext';

export function Notificaciones() {
  const { sesion } = useSesion();
  const { notificaciones, leer } = useOrientacion();
  if (!sesion) return null;
  const avisos = notificaciones(sesion.correo);
  return <main className="container page-container section-space">
    <Link className="back-link" to="/estudiante">Volver al panel</Link>
    <div className="eyebrow">SEGUIMIENTO DE SOLICITUDES</div>
    <h1>Notificaciones</h1>
    <button className="btn btn-outline-dark my-4" onClick={() => leer(sesion.correo)}>Marcar todas como leídas</button>
    {avisos.length ? avisos.map((aviso) => <article className="form-surface mb-3" key={aviso.id}>
      {!aviso.leida && <span className="pill-soft">Nueva</span>}
      <p className="mt-2 mb-1">{aviso.texto}</p>
      <small>{new Date(aviso.fecha).toLocaleString('es-CL')}</small>
      <div><Link to="/estudiante/solicitudes">Ver solicitud</Link></div>
    </article>) : <p>Aún no tienes notificaciones.</p>}
  </main>;
}
