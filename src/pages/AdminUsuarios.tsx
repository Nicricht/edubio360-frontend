import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Edit3, Plus, Trash2 } from 'lucide-react';
import { useDatos } from '../context/DatosContext';
import { useSesion } from '../context/SesionContext';

export function AdminUsuarios() {
  const { usuarios, removeUsuario, updateUsuario } = useDatos();
  const { sesion } = useSesion();
  const [pending, setPending] = useState<string | null>(null);
  const selected = usuarios.find((u) => u.id === pending);
  return (
    <main className="container page-container section-space admin-page">
      <Link to="/admin" className="back-link">
        <ArrowLeft size={17} /> Panel administrativo
      </Link>
      <div className="page-topline">
        <div>
          <div className="eyebrow">ADMINISTRACIÓN</div>
          <h1>Usuarios</h1>
          <p>Registros de ejemplo guardados localmente, sin autenticación real.</p>
        </div>
        <Link
          to="/admin/usuarios/nuevo"
          className="btn btn-dark rounded-pill px-4 d-flex gap-2 align-items-center"
        >
          <Plus size={18} /> Nuevo usuario
        </Link>
      </div>
      {selected && (
        <section
          className="confirm-panel"
          role="alertdialog"
          aria-label="Confirmación de eliminación"
        >
          <strong>Eliminar usuario</strong>
          <p>
            ¿Eliminar a {selected.nombre} {selected.apellidos}?
          </p>
          <button
            className="btn btn-danger me-2"
            onClick={() => {
              removeUsuario(selected.id);
              setPending(null);
            }}
          >
            Confirmar eliminación
          </button>
          <button className="btn btn-outline-secondary" onClick={() => setPending(null)}>
            Cancelar
          </button>
        </section>
      )}
      <div className="admin-table-wrap">
        <table className="table align-middle admin-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>RUN</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} data-testid="admin-usuario-row">
                <td>
                  <strong>
                    {u.nombre} {u.apellidos}
                  </strong>
                  <small>{u.correo}</small>
                </td>
                <td>{u.run}</td>
                <td>
                  <span className="pill-soft">{u.rol}</span>
                </td>
                <td>{u.estado || 'ACTIVO'}</td>
                <td>
                  <div className="table-actions">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      disabled={u.correo === sesion?.correo}
                      onClick={() => updateUsuario(u.id, { estado: u.estado === 'INACTIVO' ? 'ACTIVO' : 'INACTIVO' })}
                    >
                      {u.estado === 'INACTIVO' ? 'Activar' : 'Desactivar'}
                    </button>
                    <Link
                      className="icon-action"
                      aria-label={`Editar usuario ${u.nombre}`}
                      to={`/admin/usuarios/${u.id}/editar`}
                    >
                      <Edit3 size={18} />
                    </Link>
                    <button
                      className="icon-action icon-danger"
                      aria-label={`Eliminar usuario ${u.nombre}`}
                      disabled={u.correo === sesion?.correo}
                      onClick={() => setPending(u.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!usuarios.length && (
          <p className="p-4">No hay usuarios registrados. Crea uno para empezar.</p>
        )}
      </div>
    </main>
  );
}
