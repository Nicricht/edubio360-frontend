import { useState, type FormEvent } from 'react';
import { Mail, MapPin, MessageCircle } from 'lucide-react';
import { FormField, TextareaField } from '../components/atoms/FormField';
import { validateContacto, type ContactoInput } from '../utils/validations';

export function Contacto() {
  const [form, setForm] = useState<ContactoInput>({ nombre: '', correo: '', comentario: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactoInput, string>>>({});
  const [success, setSuccess] = useState(false);
  const change = (field: keyof ContactoInput, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSuccess(false);
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next = validateContacto(form);
    setErrors(next);
    setSuccess(Object.keys(next).length === 0);
  };
  return (
    <main className="container page-container section-space">
      <div className="split-layout">
        <div className="split-aside">
          <span className="eyebrow">CONVERSEMOS</span>
          <h1>¿Tienes alguna pregunta?</h1>
          <p>
            Estamos aquí para ayudarte a explorar tus alternativas académicas. Escríbenos y prueba
            nuestro formulario interactivo.
          </p>
          <div className="contact-feature">
            <Mail size={22} />
            <span>
              Formulario de contacto
              <br />
              <small>Validaciones específicas en cada campo</small>
            </span>
          </div>
          <div className="contact-feature">
            <MapPin size={22} />
            <span>
              Región del Biobío
              <br />
              <small>Proyecto académico de demostración</small>
            </span>
          </div>
        </div>
        <form className="form-surface" onSubmit={submit} noValidate>
          <div className="form-icon">
            <MessageCircle size={24} />
          </div>
          <h2>Envíanos un mensaje</h2>
          <p>Completa los campos para validar tus datos.</p>
          <FormField
            label="Nombre"
            name="nombre"
            autoComplete="name"
            value={form.nombre}
            error={errors.nombre}
            onChange={(e) => change('nombre', e.target.value)}
          />
          <FormField
            label="Correo electrónico"
            name="correo"
            type="email"
            autoComplete="email"
            value={form.correo}
            error={errors.correo}
            onChange={(e) => change('correo', e.target.value)}
          />
          <TextareaField
            label="Comentario"
            name="comentario"
            rows={5}
            value={form.comentario}
            error={errors.comentario}
            onChange={(e) => change('comentario', e.target.value)}
          />
          {success && (
            <div className="success-message" role="status">
              Mensaje validado correctamente. En EP2 el envío es una demostración local sin
              servidor.
            </div>
          )}
          <button className="btn btn-dark btn-lg w-100 rounded-pill" type="submit">
            Enviar mensaje
          </button>
        </form>
      </div>
    </main>
  );
}
