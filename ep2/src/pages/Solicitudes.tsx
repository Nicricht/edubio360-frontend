import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSesion } from '../context/SesionContext';
import { useOrientacion } from '../context/OrientacionContext';
import { type EstadoSolicitud, type Solicitud } from '../services/orientacion';

const estados: EstadoSolicitud[] = ['PENDIENTE', 'ACEPTADA', 'REPROGRAMADA', 'CANCELADA', 'ATENDIDA'];

function TarjetaSolicitud({ solicitud, rol, correo, cambiar }: {
  solicitud: Solicitud;
  rol: 'Estudiante' | 'Orientador' | 'Administrador';
  correo: string;
  cambiar: ReturnType<typeof useOrientacion>['cambiar'];
}) {
  const [fecha, setFecha] = useState('');
  const [error, setError] = useState('');
  const activa = !['CANCELADA', 'ATENDIDA'].includes(solicitud.estado);
  const accion = (tipo: 'TOMAR' | 'CANCELAR' | 'REPROGRAMAR') => {
    const sesion = { correo, nombre: '', rol };
    const resultado = tipo === 'REPROGRAMAR'
      ? cambiar(solicitud.id, sesion, { tipo, fecha })
      : cambiar(solicitud.id, sesion, { tipo });
    setError(resultado ? '' : 'No se pudo actualizar la solicitud. Verifica la fecha y el estado.');
  };
  return <article className="form-surface mb-3">
    <span className="pill-soft">{solicitud.estado}</span>
    <h2 className="h4 mt-3">{solicitud.oferta}</h2>
    <p className="mb-1"><strong>Fecha:</strong> {solicitud.fecha}</p>
    <p className="mb-1"><strong>Motivo:</strong> {solicitud.motivo}</p>
    {rol !== 'Estudiante' && <p className="mb-1"><strong>Estudiante:</strong> {solicitud.estudiante} · {solicitud.correo}</p>}
    {solicitud.orientador && <p className="mb-1"><strong>Orientador:</strong> {solicitud.orientador}</p>}
    {solicitud.resultado && <p className="mb-1"><strong>Resultado:</strong> {solicitud.resultado}</p>}
    {solicitud.observacion && <p className="mb-1"><strong>Observaciones:</strong> {solicitud.observacion}</p>}
    {(solicitud.ofertasComparadas?.length || 0) >= 2 && <details className="my-3"><summary>Alternativas comparadas</summary>
      <ul>{solicitud.ofertasComparadas!.map((item) => <li key={item.id}>{item.carrera} · {item.institucion} · {item.comuna}</li>)}</ul>
    </details>}
    <details className="my-3"><summary>Historial de cambios</summary>
      <ul>{solicitud.historial.map((cambio, indice) => <li key={`${cambio.fecha}-${indice}`}>{cambio.estado} · {new Date(cambio.fecha).toLocaleString('es-CL')} · {cambio.actor}</li>)}</ul>
    </details>
    {rol === 'Orientador' && activa && (!solicitud.orientador ?
      <button className="btn btn-dark btn-sm" onClick={() => accion('TOMAR')}>Tomar solicitud</button> :
      <Link className="btn btn-dark btn-sm" to={`/orientador/solicitudes/${solicitud.id}`}>Gestionar orientación</Link>)}
    {rol === 'Estudiante' && activa && <div className="d-flex flex-wrap gap-2 align-items-center">
      <input className="form-control" style={{ maxWidth: 210 }} type="date" aria-label={`Nueva fecha para ${solicitud.oferta}`} value={fecha} onChange={(e) => setFecha(e.target.value)} />
      <button className="btn btn-outline-dark btn-sm" onClick={() => accion('REPROGRAMAR')}>Solicitar reprogramación</button>
      <button className="btn btn-outline-danger btn-sm" onClick={() => accion('CANCELAR')}>Cancelar solicitud</button>
    </div>}
    {error && <p role="alert" className="text-danger mt-2 mb-0">{error}</p>}
  </article>;
}

export function Solicitudes() {
  const { sesion } = useSesion();
  const { solicitudes, cambiar } = useOrientacion();
  const [estado, setEstado] = useState('');
  if (!sesion) return null;
  const visibles = solicitudes.filter((solicitud) => {
    if (estado && solicitud.estado !== estado) return false;
    if (sesion.rol === 'Administrador') return true;
    if (sesion.rol === 'Estudiante') return solicitud.correo === sesion.correo;
    return solicitud.orientador === sesion.correo || (!solicitud.orientador && ['PENDIENTE', 'REPROGRAMADA'].includes(solicitud.estado));
  });
  return <main className="container page-container section-space admin-page">
    <Link className="back-link" to={sesion.rol === 'Administrador' ? '/admin' : sesion.rol === 'Orientador' ? '/orientador' : '/estudiante'}>Volver al panel</Link>
    <div className="eyebrow">SEGUIMIENTO</div>
    <h1>{sesion.rol === 'Estudiante' ? 'Mis solicitudes' : 'Solicitudes de orientación'}</h1>
    <div className="d-flex align-items-center gap-3 my-4 flex-wrap">
      <label htmlFor="filtroEstado">Estado</label>
      <select id="filtroEstado" className="form-select" style={{ maxWidth: 260 }} value={estado} onChange={(e) => setEstado(e.target.value)}>
        <option value="">Todos los estados</option>
        {estados.map((valor) => <option key={valor}>{valor}</option>)}
      </select>
      {sesion.rol === 'Estudiante' && <Link to="/solicitar" className="btn btn-dark rounded-pill">Nueva solicitud</Link>}
    </div>
    {visibles.length ? visibles.map((solicitud) => <TarjetaSolicitud key={solicitud.id} solicitud={solicitud} rol={sesion.rol} correo={sesion.correo} cambiar={cambiar} />) : <p>No hay solicitudes para esta vista.</p>}
  </main>;
}
