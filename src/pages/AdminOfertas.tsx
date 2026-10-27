import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Edit3, Plus, Trash2 } from 'lucide-react';
import { useDatos } from '../context/DatosContext';
import { pesoCL } from '../components/atoms/Price';

export function AdminOfertas() {
  const { ofertas, removeOferta } = useDatos();
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const selected = ofertas.find((o) => o.id === pendingDelete);
  return (
    <main className="container page-container section-space admin-page">
      <Link to="/admin" className="back-link">
        <ArrowLeft size={17} /> Panel administrativo
      </Link>
      <div className="page-topline">
        <div>
          <div className="eyebrow">ADMINISTRACIÓN</div>
          <h1>Ofertas académicas</h1>
          <p>Gestiona las carreras que aparecen en el catálogo de demostración.</p>
        </div>
        <Link
          className="btn btn-dark rounded-pill px-4 d-inline-flex gap-2 align-items-center"
          to="/admin/ofertas/nueva"
        >
          <Plus size={18} /> Crear oferta
        </Link>
      </div>
      {selected && (
        <section
          className="confirm-panel"
          role="alertdialog"
          aria-label="Confirmación de eliminación"
        >
          <strong>Confirmar eliminación</strong>
          <p>
            ¿Eliminar “{selected.carrera}”? Esta acción se refleja inmediatamente en el catálogo
            local.
          </p>
          <div className="d-flex gap-2">
            <button
              className="btn btn-danger"
              onClick={() => {
                removeOferta(selected.id);
                setPendingDelete(null);
              }}
            >
              Confirmar eliminación
            </button>
            <button className="btn btn-outline-secondary" onClick={() => setPendingDelete(null)}>
              Cancelar
            </button>
          </div>
        </section>
      )}
      <div className="admin-table-wrap">
        <table className="table align-middle admin-table">
          <thead>
            <tr>
              <th>Carrera / institución</th>
              <th>Área</th>
              <th>Arancel</th>
              <th>Cupos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ofertas.map((o) => (
              <tr key={o.id} data-testid="admin-oferta-row">
                <td>
                  <strong>{o.carrera}</strong>
                  <small>
                    {o.institucion} · {o.comuna}
                  </small>
                </td>
                <td>
                  <span className="pill-soft">{o.area}</span>
                </td>
                <td>{pesoCL(o.arancel)}</td>
                <td>{o.cupos ?? '—'}</td>
                <td>
                  <div className="table-actions">
                    <Link
                      className="icon-action"
                      title="Editar"
                      aria-label={`Editar ${o.carrera}`}
                      to={`/admin/ofertas/${o.id}/editar`}
                    >
                      <Edit3 size={18} />
                    </Link>
                    <button
                      className="icon-action icon-danger"
                      aria-label={`Eliminar ${o.carrera}`}
                      onClick={() => setPendingDelete(o.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!ofertas.length && <p className="p-4">Aún no hay ofertas. Crea una para comenzar.</p>}
      </div>
    </main>
  );
}
