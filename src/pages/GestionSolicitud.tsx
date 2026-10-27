import { useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useOrientacion } from '../context/OrientacionContext';
import { useSesion } from '../context/SesionContext';
import { type EstadoSolicitud } from '../services/orientacion';

export function GestionSolicitud() {
  const { id } = useParams();
  const { sesion } = useSesion();
  const { solicitudes, cambiar } = useOrientacion();
  const solicitud = solicitudes.find((item) => item.id === id && item.orientador === sesion?.correo);
  const [estado, setEstado] = useState<EstadoSolicitud>(solicitud?.estado || 'PENDIENTE');
  const [fecha, setFecha] = useState(solicitud?.fecha || '');
  const [resultado, setResultado] = useState(solicitud?.resultado || '');
  const [observacion, setObservacion] = useState(solicitud?.observacion || '');
  const [mensaje, setMensaje] = useState('');
  if (!solicitud || !sesion) return <main className="container page-container section-space"><h1>Solicitud no disponible</h1><Link to="/orientador/solicitudes">Volver a solicitudes</Link></main>;
  const finalizada = ['ATENDIDA', 'CANCELADA'].includes(solicitud.estado);
  const guardar = (evento: FormEvent) => {
    evento.preventDefault();
    const actual = cambiar(solicitud.id, sesion, { tipo: 'GESTIONAR', estado, fecha, resultado, observacion });
    setMensaje(actual ? 'Cambios guardados. El estudiante recibió una notificación.' : 'Revisa la fecha y el resultado antes de guardar.');
  };
  return <main className="container page-container section-space form-page">
    <Link className="back-link" to="/orientador/solicitudes">Volver a solicitudes</Link>
    <div className="eyebrow">ORIENTACIÓN VOCACIONAL</div>
    <h1>Gestionar orientación</h1>
    <p><strong>Estudiante:</strong> {solicitud.estudiante} · {solicitud.correo}</p>
    <p><strong>Consulta:</strong> {solicitud.oferta} · {solicitud.motivo}</p>
    {(solicitud.ofertasComparadas?.length || 0) >= 2 && <div className="form-surface mb-3"><h2 className="h5">Alternativas comparadas</h2>
      <ul>{solicitud.ofertasComparadas!.map((item) => <li key={item.id}>{item.carrera} · {item.institucion} · {item.comuna}</li>)}</ul>
    </div>}
    <form className="form-surface d-grid gap-3" onSubmit={guardar}>
      <div><label className="form-label" htmlFor="estadoGestion">Estado</label>
        <select id="estadoGestion" className="form-select" value={estado} disabled={finalizada} onChange={(e) => setEstado(e.target.value as EstadoSolicitud)}>
          {(['PENDIENTE', 'ACEPTADA', 'REPROGRAMADA', 'CANCELADA', 'ATENDIDA'] as EstadoSolicitud[]).map((item) => <option key={item}>{item}</option>)}
        </select></div>
      <div><label className="form-label" htmlFor="fechaGestion">Fecha</label>
        <input id="fechaGestion" className="form-control" type="date" value={fecha} disabled={finalizada} onChange={(e) => setFecha(e.target.value)} /></div>
      <div><label className="form-label" htmlFor="resultadoGestion">Resultado de orientación</label>
        <textarea id="resultadoGestion" className="form-control" rows={3} maxLength={500} value={resultado} disabled={finalizada} onChange={(e) => setResultado(e.target.value)} /></div>
      <div><label className="form-label" htmlFor="observacionGestion">Observaciones</label>
        <textarea id="observacionGestion" className="form-control" rows={3} maxLength={500} value={observacion} disabled={finalizada} onChange={(e) => setObservacion(e.target.value)} /></div>
      {mensaje && <p role="status" className="mb-0">{mensaje}</p>}
      {!finalizada && <button className="btn btn-dark" type="submit">Guardar cambios</button>}
    </form>
  </main>;
}
