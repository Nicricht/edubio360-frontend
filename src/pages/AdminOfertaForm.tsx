import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useDatos } from '../context/DatosContext';
import { FormField, TextareaField } from '../components/atoms/FormField';
import { validateOferta } from '../utils/validations';
import type { Oferta } from '../types';

const empty: Oferta = {
  id: '',
  carrera: '',
  institucion: '',
  comuna: '',
  area: '',
  modalidad: '',
  jornada: '',
  nivel: '',
  duracion: 0,
  matricula: 0,
  arancel: 0,
  descripcion: '',
  cupos: 0,
  cupoCritico: 10,
};

export function AdminOfertaForm() {
  const { id } = useParams();
  const editing = useLocation().pathname.endsWith('/editar');
  const navigate = useNavigate();
  const { ofertas, createOferta, updateOferta } = useDatos();
  const found = ofertas.find((o) => o.id === id);
  const [form, setForm] = useState<Oferta>(() => (editing && found ? { ...found } : { ...empty }));
  const [errors, setErrors] = useState<Partial<Record<keyof Oferta, string>>>({});
  const [saveError, setSaveError] = useState('');

  if (editing && !found)
    return (
      <main className="container page-container section-space">
        <h1>Oferta no encontrada</h1>
        <Link to="/admin/ofertas">Volver al listado</Link>
      </main>
    );

  const change = (key: keyof Oferta, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const nextErrors = validateOferta(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    try {
      if (editing && id) updateOferta(id, form);
      else
        createOferta({
          ...form,
          id: `of-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
        });
      navigate('/admin/ofertas');
    } catch {
      setSaveError('No se pudo guardar en el almacenamiento local. Revisa el espacio disponible.');
    }
  };
  const text = (
    key: 'carrera' | 'institucion' | 'comuna' | 'area' | 'modalidad' | 'jornada' | 'nivel',
    label: string,
  ) => (
    <FormField
      key={key}
      label={label}
      name={key}
      value={form[key]}
      error={errors[key]}
      onChange={(e) => change(key, e.target.value)}
    />
  );
  return (
    <main className="container page-container section-space admin-page form-page">
      <Link to="/admin/ofertas" className="back-link">
        <ArrowLeft size={17} /> Volver a ofertas
      </Link>
      <div className="eyebrow">ADMINISTRACIÓN</div>
      <h1>{editing ? 'Editar oferta' : 'Nueva oferta académica'}</h1>
      <p className="page-lead">Completa los datos que se mostrarán en el catálogo.</p>
      <form onSubmit={submit} noValidate className="form-surface">
        <div className="row g-4">
          <div className="col-md-6">{text('carrera', 'Carrera')}</div>
          <div className="col-md-6">{text('institucion', 'Institución')}</div>
          <div className="col-md-6">{text('comuna', 'Comuna')}</div>
          <div className="col-md-6">{text('area', 'Área')}</div>
          <div className="col-md-4">{text('modalidad', 'Modalidad')}</div>
          <div className="col-md-4">{text('jornada', 'Jornada')}</div>
          <div className="col-md-4">{text('nivel', 'Nivel')}</div>
          <div className="col-md-4">
            <FormField
              type="number"
              min={1}
              max={24}
              label="Duración (semestres)"
              name="duracion"
              value={form.duracion || ''}
              error={errors.duracion}
              onChange={(e) => change('duracion', Number(e.target.value))}
            />
          </div>
          <div className="col-md-4">
            <FormField
              type="number"
              min={0}
              label="Matrícula (CLP)"
              name="matricula"
              value={form.matricula}
              error={errors.matricula}
              onChange={(e) => change('matricula', Number(e.target.value))}
            />
          </div>
          <div className="col-md-4">
            <FormField
              type="number"
              min={0}
              label="Arancel (CLP)"
              name="arancel"
              value={form.arancel}
              error={errors.arancel}
              onChange={(e) => change('arancel', Number(e.target.value))}
            />
          </div>
          <div className="col-md-6">
            <FormField
              type="number"
              min={0}
              label="Cupos disponibles"
              name="cupos"
              value={form.cupos ?? ''}
              error={errors.cupos}
              onChange={(e) => change('cupos', Number(e.target.value))}
            />
          </div>
          <div className="col-md-6">
            <FormField
              type="number"
              min={0}
              label="Umbral de cupos críticos"
              name="cupoCritico"
              value={form.cupoCritico ?? ''}
              error={errors.cupoCritico}
              onChange={(e) => change('cupoCritico', Number(e.target.value))}
            />
          </div>
          <div className="col-12">
            <TextareaField
              label="Descripción"
              name="descripcion"
              rows={4}
              value={form.descripcion}
              error={errors.descripcion}
              onChange={(e) => change('descripcion', e.target.value)}
            />
          </div>
        </div>
        {saveError && (
          <p className="field-error mt-3" role="alert">
            {saveError}
          </p>
        )}
        <div className="form-actions">
          <Link to="/admin/ofertas" className="btn btn-outline-secondary rounded-pill px-4">
            Cancelar
          </Link>
          <button
            type="submit"
            className="btn btn-dark rounded-pill px-4 d-flex align-items-center gap-2"
          >
            <Save size={18} />
            {editing ? 'Guardar cambios' : 'Guardar oferta'}
          </button>
        </div>
      </form>
    </main>
  );
}
