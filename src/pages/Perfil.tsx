import { useState } from 'react';
import { Link } from 'react-router-dom';
import { realApi } from '../services/authApi';
import { usuariosApi } from '../services/usuariosApi';
import { useDatos } from '../context/DatosContext';
import { useSesion } from '../context/SesionContext';
import { UsuarioForm, type UsuarioFormData } from '../components/organisms/UsuarioForm';

export function Perfil() {
  const { sesion } = useSesion();
  const { usuarios, usuariosCargando, usuariosError, updateUsuario, sincronizarUsuarios } = useDatos();
  const [mensaje, setMensaje] = useState('');
  const usuario = usuarios.find((item) => item.correo === sesion?.correo);
  if (usuariosCargando) return <main role="status">Cargando perfil...</main>;
  if (usuariosError) return <main role="alert">{usuariosError}</main>;
  if (!usuario || !sesion) return <main className="container page-container section-space"><h1>Perfil no disponible</h1></main>;
  const guardar = async (datos: UsuarioFormData) => {
    if (realApi && sesion.token) {
      await usuariosApi.actualizarPerfil(datos, sesion.token);
      await sincronizarUsuarios(sesion.token, sesion.rol);
    } else await updateUsuario(usuario.id, { ...datos, rol: usuario.rol, correo: usuario.correo });
    setMensaje('Perfil actualizado.');
  };
  return <main className="container page-container section-space form-page">
    <Link className="back-link" to={sesion.rol === 'Orientador' ? '/orientador' : '/estudiante'}>Volver al panel</Link>
    <div className="eyebrow">MI CUENTA</div>
    <h1>Mi perfil</h1>
    <p className="page-lead">Puedes actualizar tus datos de contacto.</p>
    {mensaje && <p role="status" className="success-message">{mensaje}</p>}
    <UsuarioForm initial={usuario} onSave={guardar} submitLabel="Guardar perfil" />
  </main>;
}
