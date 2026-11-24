import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { realApi } from '../services/authApi';
import { useDatos } from '../context/DatosContext';
import { UsuarioForm, type UsuarioFormData } from '../components/organisms/UsuarioForm';

export function AdminUsuarioForm() {
  const { id } = useParams();
  const editing = useLocation().pathname.endsWith('/editar');
  const navigate = useNavigate();
  const { usuarios, usuariosCargando, usuariosError, createUsuario, updateUsuario } = useDatos();
  const existing = usuarios.find((u) => u.id === id);
  if (usuariosCargando) return <main role="status">Cargando usuarios...</main>;
  if (usuariosError) return <main role="alert">{usuariosError}</main>;
  if (editing && !existing)
    return (
      <main className="container page-container section-space">
        <h1>Usuario no encontrado</h1>
        <Link to="/admin/usuarios">Volver a usuarios</Link>
      </main>
    );
  const save = async (data: UsuarioFormData, password?: string) => {
    if (editing && id) await updateUsuario(id, data, password);
    else
      await createUsuario({
        ...data,
        id: `us-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      }, password);
    navigate('/admin/usuarios');
  };
  return (
    <main className="container page-container section-space admin-page form-page">
      <Link to="/admin/usuarios" className="back-link">
        <ArrowLeft size={17} /> Volver a usuarios
      </Link>
      <div className="eyebrow">ADMINISTRACIÓN</div>
      <h1>{editing ? 'Editar usuario' : 'Nuevo usuario'}</h1>
      <p className="page-lead">Administra los datos de las cuentas.</p>
      <UsuarioForm
        initial={existing}
        admin
        passwordMode={realApi ? (editing ? 'optional' : 'required') : 'none'}
        onSave={save}
        submitLabel={editing ? 'Guardar cambios' : 'Guardar usuario'}
      />
    </main>
  );
}
