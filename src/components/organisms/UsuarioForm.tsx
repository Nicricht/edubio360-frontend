import { useState, type FormEvent } from 'react';
import { Save } from 'lucide-react';
import type { Usuario } from '../../types';
import { regiones } from '../../data/regiones';
import { validateRegistro, type RegistroInput } from '../../utils/validations';
import { FormField, SelectField } from '../atoms/FormField';

export type UsuarioFormData = RegistroInput & { rol: Usuario['rol'] };
const blank: UsuarioFormData = {
  run: '',
  nombre: '',
  apellidos: '',
  correo: '',
  region: '',
  comuna: '',
  direccion: '',
  rol: 'Estudiante',
};

export function UsuarioForm({
  initial,
  admin = false,
  onSave,
  submitLabel,
}: {
  initial?: Usuario;
  admin?: boolean;
  onSave(data: UsuarioFormData): void;
  submitLabel: string;
}) {
  const [form, setForm] = useState<UsuarioFormData>(() =>
    initial
      ? {
          run: initial.run,
          nombre: initial.nombre,
          apellidos: initial.apellidos,
          correo: initial.correo,
          region: initial.region,
          comuna: initial.comuna,
          direccion: initial.direccion,
          rol: initial.rol,
        }
      : { ...blank },
  );
  const [errors, setErrors] = useState<Partial<Record<keyof RegistroInput, string>>>({});
  const update = (key: keyof UsuarioFormData, value: string) => {
    setForm((prev) =>
      key === 'region' ? { ...prev, region: value, comuna: '' } : { ...prev, [key]: value },
    );
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next = validateRegistro(form);
    setErrors(next);
    if (!Object.keys(next).length) onSave(form);
  };
  return (
    <form onSubmit={submit} noValidate className="form-surface">
      <div className="row g-3">
        <div className="col-md-6">
          <FormField
            label="RUN"
            name="run"
            placeholder="12345678-5"
            value={form.run}
            error={errors.run}
            onChange={(e) => update('run', e.target.value)}
            hint="Con o sin puntos, incluyendo dígito verificador"
          />
        </div>
        <div className="col-md-6">
          <FormField
            label="Correo electrónico"
            name="correo"
            type="email"
            autoComplete="email"
            value={form.correo}
            error={errors.correo}
            onChange={(e) => update('correo', e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <FormField
            label="Nombre"
            name="nombre"
            autoComplete="given-name"
            value={form.nombre}
            error={errors.nombre}
            onChange={(e) => update('nombre', e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <FormField
            label="Apellidos"
            name="apellidos"
            autoComplete="family-name"
            value={form.apellidos}
            error={errors.apellidos}
            onChange={(e) => update('apellidos', e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <SelectField
            label="Región"
            name="region"
            value={form.region}
            error={errors.region}
            onChange={(e) => update('region', e.target.value)}
          >
            <option value="">Selecciona una región</option>
            {Object.keys(regiones).map((region) => (
              <option value={region} key={region}>
                {region}
              </option>
            ))}
          </SelectField>
        </div>
        <div className="col-md-6">
          <SelectField
            label="Comuna"
            name="comuna"
            value={form.comuna}
            error={errors.comuna}
            disabled={!form.region}
            onChange={(e) => update('comuna', e.target.value)}
          >
            <option value="">Selecciona una comuna</option>
            {(regiones[form.region] || []).map((comuna) => (
              <option key={comuna} value={comuna}>
                {comuna}
              </option>
            ))}
          </SelectField>
        </div>
        <div className={admin ? 'col-md-8' : 'col-12'}>
          <FormField
            label="Dirección"
            name="direccion"
            autoComplete="street-address"
            value={form.direccion}
            error={errors.direccion}
            onChange={(e) => update('direccion', e.target.value)}
          />
        </div>
        {admin && (
          <div className="col-md-4">
            <SelectField
              label="Rol"
              name="rol"
              value={form.rol}
              onChange={(e) => update('rol', e.target.value)}
            >
              <option value="Estudiante">Estudiante</option>
              <option value="Orientador">Orientador</option>
              <option value="Administrador">Administrador</option>
            </SelectField>
          </div>
        )}
      </div>
      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-dark rounded-pill px-4 d-flex gap-2 align-items-center"
        >
          <Save size={18} />
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
