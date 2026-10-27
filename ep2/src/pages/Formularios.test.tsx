import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { Contacto } from './Contacto';
import { Login } from './Login';
import { DatosProvider } from '../context/DatosContext';
import { SesionProvider } from '../context/SesionContext';

describe('Formularios controlados', () => {
  it('muestra error contextual al enviar Contacto vacío', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Contacto />
      </MemoryRouter>,
    );
    await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));
    expect(screen.getAllByRole('alert')).toHaveLength(3);
  });

  it('muestra éxito al ingresar datos correctos en Contacto', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Contacto />
      </MemoryRouter>,
    );
    await user.type(screen.getByLabelText(/^nombre$/i), 'Ana');
    await user.type(screen.getByLabelText(/^correo/i), 'ana@example.com');
    await user.type(screen.getByLabelText(/^comentario/i), 'Necesito información sobre carreras.');
    await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));
    expect(screen.getByText(/mensaje validado correctamente/i)).toBeInTheDocument();
  });

  it('no simula un login exitoso con correo inválido', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <DatosProvider><SesionProvider><Login /></SesionProvider></DatosProvider>
      </MemoryRouter>,
    );
    await user.type(screen.getByLabelText(/^correo/i), 'invalido');
    await user.type(screen.getByLabelText(/contraseña/i), 'abc12345');
    await user.click(screen.getByRole('button', { name: /^ingresar$/i }));
    expect(screen.getByText(/correo electrónico válido/i)).toBeInTheDocument();
    expect(screen.queryByText(/datos validados/i)).not.toBeInTheDocument();
  });
});
