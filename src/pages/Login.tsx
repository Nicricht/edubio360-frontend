import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LockKeyhole, ShieldCheck } from 'lucide-react';
import { FormField } from '../components/atoms/FormField';
import { validateLogin, type LoginInput } from '../utils/validations';
import { useSesion } from '../context/SesionContext';
import { destinoRol } from '../services/auth';
import { realApi } from '../services/authApi';

export function Login() {
  const [form, setForm] = useState<LoginInput>({ correo: '', contrasena: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginInput, string>>>({});
  const [success, setSuccess] = useState(false);
  const [authError, setAuthError] = useState('');
  const { ingresar } = useSesion();
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();
  const change = (field: keyof LoginInput, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSuccess(false);
    setAuthError('');
  };
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (enviando) return;
    const next = validateLogin(form);
    if (realApi && form.contrasena.length >= 8 && form.contrasena.length <= 100) delete next.contrasena;
    setErrors(next);
    if (Object.keys(next).length) return;
    setEnviando(true);
    try {
      const sesion = await ingresar(form.correo, form.contrasena);
      if (!sesion) throw new Error('Credenciales inválidas');
      setSuccess(true);
      navigate(destinoRol(sesion.rol));
    } catch {
      setAuthError('No fue posible iniciar sesión. Revisa tus credenciales y la conexión.');
    } finally {
      setEnviando(false);
    }
  };
  return (
    <main className="container page-container section-space auth-page">
      <div className="auth-card">
        <div className="form-icon">
          <LockKeyhole size={25} />
        </div>
        <div className="eyebrow">BIENVENIDO DE VUELTA</div>
        <h1>Iniciar sesión</h1>
        <p>Accede a tu panel de estudiante, orientador o administrador.</p>
        <form onSubmit={submit} noValidate>
          <FormField
            label="Correo electrónico"
            name="correo"
            type="email"
            autoComplete="email"
            value={form.correo}
            error={errors.correo}
            onChange={(e) => change('correo', e.target.value)}
          />
          <FormField
            label="Contraseña"
            name="contrasena"
            type="password"
            autoComplete="current-password"
            value={form.contrasena}
            error={errors.contrasena}
            onChange={(e) => change('contrasena', e.target.value)}
          />
          {success && (
            <div className="success-message" role="status">
              Sesión iniciada correctamente.
            </div>
          )}
          {authError && <p role="alert" className="field-error">{authError}</p>}
          <button type="submit" disabled={enviando} className="btn btn-dark btn-lg rounded-pill w-100">
            {enviando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
        <div className="auth-footer">
          ¿Aún no tienes cuenta? <Link to="/registro">Crear cuenta</Link>
        </div>
        <div className="auth-privacy">
          <ShieldCheck size={18} /> {realApi ? 'Autenticación mediante el servidor.' : 'Modo demostración: estudiante@duoc.cl, orientador@duoc.cl o admin@duoc.cl con clave 1234. No uses contraseñas reales.'}
        </div>
      </div>
    </main>
  );
}
