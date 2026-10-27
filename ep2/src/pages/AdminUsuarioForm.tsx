import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useDatos } from '../context/DatosContext';
import { UsuarioForm, type UsuarioFormData } from '../components/organisms/UsuarioForm';

export function AdminUsuarioForm() {
  const { id } = useParams();
  const editing = useLocation().pathname.endsWith('/editar');
  const navigate = useNavigate();
  const { usuarios, createUsuario, updateUsuario } = useDatos();
  const existing = usuarios.find((u) => u.id === id);
  if (editing && !existing)
    return (
      <main className="container page-container section-space">
        <h1>Usuario no encontrado</h1>
        <Link to="/admin/usuarios">Volver a usuarios</Link>
      </main>
    );
  const save = (data: UsuarioFormData) => {
    if (editing && id) updateUsuario(id, data);
    else
      createUsuario({
        ...data,
        id: `us-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      });
    navigate('/admin/usuarios');
  };
  return (
    <main className="container page-container section-space admin-page form-page">
      <Link to="/admin/usuarios" className="back-link">
        <ArrowLeft size={17} /> Volver a usuarios
      </Link>
      <div className="eyebrow">ADMINISTRACIÓN</div>
      <h1>{editing ? 'Editar usuario' : 'Nuevo usuario'}</h1>
      <p className="page-lead">Administra los datos de ejemplo del mantenedor local.</p>
      <UsuarioForm
        initial={existing}
        admin
        onSave={save}
        submitLabel={editing ? 'Guardar cambios' : 'Guardar usuario'}
      />
    </main>
  );
}
