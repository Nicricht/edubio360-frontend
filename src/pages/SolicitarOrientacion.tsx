import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDatos } from '../context/DatosContext';
import { useSesion } from '../context/SesionContext';
import { useOrientacion } from '../context/OrientacionContext';

function fechaHoy(): string {
  const fecha = new Date();
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
}

export function SolicitarOrientacion() {
  const [parametros] = useSearchParams();
  const { ofertas, comparadasIds } = useDatos();
  const { sesion } = useSesion();
  const { enviar } = useOrientacion();
  const idsComparacion = (parametros.get('comparacion') || '').split(',').filter(Boolean);
  const comparadas = idsComparacion.map((id) => ofertas.find((oferta) => oferta.id === id)).filter((oferta): oferta is (typeof ofertas)[number] => !!oferta);
  const [ofertaId, setOfertaId] = useState(parametros.get('oferta') || comparadas[0]?.id || comparadasIds[0] || ofertas[0]?.id || '');
  const [motivo, setMotivo] = useState('');
  const [fecha, setFecha] = useState('');
  const [error, setError] = useState('');
  const [enviada, setEnviada] = useState(false);

  const enviarFormulario = (evento: FormEvent) => {
    evento.preventDefault();
    const oferta = ofertas.find((item) => item.id === ofertaId);
    if (!sesion || !oferta || !motivo.trim() || !fecha || fecha < fechaHoy()) {
      setError('Selecciona una carrera, escribe el motivo y elige una fecha desde hoy.');
      return;
    }
    try {
      enviar(sesion, {
        ofertaId, oferta: oferta.grupoComparacion || oferta.carrera, motivo, fecha,
        ofertasComparadas: comparadas.length >= 2 ? comparadas.map((item) => ({ id: item.id, carrera: item.carrera, institucion: item.institucion, comuna: item.comuna })) : [],
      });
      setError('');
      setEnviada(true);
    } catch {
      setError('No se pudo guardar la solicitud. Revisa los datos e inténtalo nuevamente.');
    }
  };

  return <main className="container page-container section-space form-page">
    <div className="eyebrow">ORIENTACIÓN VOCACIONAL</div>
    <h1>Solicitar orientación</h1>
    <p className="page-lead">Un orientador puede revisar tu consulta y registrar el resultado de la atención.</p>
    {enviada ? <div className="form-surface" role="status">
      <h2>Solicitud enviada</h2>
      <p>Tu solicitud quedó pendiente de asignación y puedes consultar sus cambios.</p>
      <Link className="btn btn-dark" to="/estudiante/solicitudes">Ver mis solicitudes</Link>
    </div> : <form className="form-surface d-grid gap-3" noValidate onSubmit={enviarFormulario}>
      {comparadas.length >= 2 && <div className="p-3 bg-light rounded">
        <strong>Alternativas comparadas</strong>
        <ul className="mb-0 mt-2">{comparadas.map((item) => <li key={item.id}>{item.carrera} · {item.institucion}</li>)}</ul>
      </div>}
      <div><label className="form-label" htmlFor="ofertaSolicitud">Carrera e institución</label>
        <select id="ofertaSolicitud" className="form-select" value={ofertaId} onChange={(e) => setOfertaId(e.target.value)}>
          {ofertas.map((oferta) => <option key={oferta.id} value={oferta.id}>{oferta.carrera} · {oferta.institucion} · {oferta.comuna}</option>)}
        </select></div>
      <div><label className="form-label" htmlFor="motivoSolicitud">Motivo de consulta</label>
        <textarea id="motivoSolicitud" className="form-control" required maxLength={500} value={motivo} onChange={(e) => setMotivo(e.target.value)} rows={4} /></div>
      <div><label className="form-label" htmlFor="fechaSolicitud">Fecha preferida</label>
        <input id="fechaSolicitud" className="form-control" type="date" min={fechaHoy()} value={fecha} onChange={(e) => setFecha(e.target.value)} required /></div>
      {error && <p role="alert" className="text-danger mb-0">{error}</p>}
      <button className="btn btn-dark rounded-pill" type="submit">Enviar solicitud</button>
    </form>}
  </main>;
}
