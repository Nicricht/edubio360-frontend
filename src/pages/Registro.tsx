import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserRoundPlus } from 'lucide-react';
import { useDatos } from '../context/DatosContext';
import { UsuarioForm, type UsuarioFormData } from '../components/organisms/UsuarioForm';

export function Registro() {
  const { createUsuario } = useDatos();
  const [message, setMessage] = useState('');
  const save = (data: UsuarioFormData) => {
    try {
      createUsuario({
        ...data,
        rol: 'Estudiante',
        id: `us-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      });
      setMessage(
        'Cuenta de demostración registrada. No se creó una cuenta real ni se envió información a un servidor.',
      );
    } catch {
      setMessage('No se pudo guardar el registro local. Revisa el almacenamiento del navegador.');
    }
  };
  return (
    <main className="container page-container section-space form-page registration-page">
      <div className="registration-top">
        <span className="form-icon">
          <UserRoundPlus size={23} />
        </span>
        <span className="eyebrow">ÚNETE A EDUBÍO</span>
        <h1>Crea tu cuenta</h1>
        <p>Completa tus datos para probar el registro local de estudiantes.</p>
      </div>
      {message && (
        <div className="success-message" role="status">
          {message}
        </div>
      )}
      <UsuarioForm onSave={save} submitLabel="Crear cuenta" />
      <p className="text-center mt-4">
        ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
      </p>
    </main>
  );
}
