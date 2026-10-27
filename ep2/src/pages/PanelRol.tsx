import { Link } from 'react-router-dom';
import { useDatos } from '../context/DatosContext';
import { useSesion } from '../context/SesionContext';
import { useOrientacion } from '../context/OrientacionContext';

export function PanelRol() {
  const { sesion } = useSesion();
  const { ofertas, usuarios } = useDatos();
  const { solicitudes, notificaciones } = useOrientacion();
  if (!sesion) return null;
  const estudiante = sesion.rol === 'Estudiante';
  const orientador = sesion.rol === 'Orientador';
  const propias = solicitudes.filter((item) => estudiante ? item.correo === sesion.correo : item.orientador === sesion.correo);
  const disponibles = solicitudes.filter((item) => !item.orientador && ['PENDIENTE', 'REPROGRAMADA'].includes(item.estado));
  const enlaces = estudiante ? [
    { nombre: 'Solicitar orientación', ruta: '/solicitar' },
    { nombre: 'Mis solicitudes', ruta: '/estudiante/solicitudes' },
    { nombre: 'Notificaciones', ruta: '/estudiante/notificaciones' },
    { nombre: 'Mi perfil', ruta: '/estudiante/perfil' },
  ] : orientador ? [
    { nombre: 'Solicitudes disponibles', ruta: '/orientador/solicitudes' },
    { nombre: 'Historial de orientaciones', ruta: '/orientador/historial' },
    { nombre: 'Mi perfil', ruta: '/orientador/perfil' },
    { nombre: 'Explorar carreras', ruta: '/carreras' },
  ] : [
    { nombre: 'Administrar ofertas', ruta: '/admin/ofertas' },
    { nombre: 'Administrar usuarios', ruta: '/admin/usuarios' },
    { nombre: 'Revisar solicitudes', ruta: '/admin/solicitudes' },
    { nombre: 'Explorar carreras', ruta: '/carreras' },
  ];
  return <main className="container page-container section-space admin-page">
    <div className="eyebrow">EDUBÍO 360</div>
    <h1>{estudiante ? 'Panel del estudiante' : orientador ? 'Panel del orientador' : 'Panel de administración'}</h1>
    <p className="page-lead">Bienvenido, {sesion.nombre}.</p>
    <div className="row g-3 my-4">
      <div className="col-md-4"><div className="form-surface"><strong className="fs-2">{estudiante || orientador ? propias.length : ofertas.length}</strong><p className="mb-0">{estudiante || orientador ? 'Mis solicitudes' : 'Ofertas disponibles'}</p></div></div>
      <div className="col-md-4"><div className="form-surface"><strong className="fs-2">{estudiante ? notificaciones(sesion.correo).filter((item) => !item.leida).length : orientador ? disponibles.length : usuarios.length}</strong><p className="mb-0">{estudiante ? 'Notificaciones nuevas' : orientador ? 'Solicitudes disponibles' : 'Usuarios registrados'}</p></div></div>
      <div className="col-md-4"><div className="form-surface"><strong className="fs-2">{ofertas.length}</strong><p className="mb-0">Ofertas académicas</p></div></div>
    </div>
    <div className="row g-3">{enlaces.map((enlace) => <div className="col-md-6" key={enlace.ruta}>
      <Link className="form-surface d-block text-decoration-none text-dark fw-semibold" to={enlace.ruta}>{enlace.nombre} →</Link>
    </div>)}</div>
  </main>;
}
