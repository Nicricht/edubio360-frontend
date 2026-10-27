import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { DatosProvider } from '../context/DatosContext';
import { Registro } from './Registro';
import { AdminUsuarios } from './AdminUsuarios';
import { AdminUsuarioForm } from './AdminUsuarioForm';
import { SesionProvider } from '../context/SesionContext';

const renderUsers = (route: string) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <DatosProvider>
        <SesionProvider>
        <Routes>
          <Route path="/registro" element={<Registro />} />
          <Route path="/admin/usuarios" element={<AdminUsuarios />} />
          <Route path="/admin/usuarios/nuevo" element={<AdminUsuarioForm />} />
          <Route path="/admin/usuarios/:id/editar" element={<AdminUsuarioForm />} />
        </Routes>
        </SesionProvider>
      </DatosProvider>
    </MemoryRouter>,
  );

describe('Registro y usuarios', () => {
  it('cambia las comunas al elegir región', async () => {
    const user = userEvent.setup();
    renderUsers('/registro');
    await user.selectOptions(screen.getByLabelText(/^región$/i), 'Biobío');
    const comuna = screen.getByLabelText(/^comuna$/i);
    expect(within(comuna).getByRole('option', { name: 'Concepción' })).toBeInTheDocument();
    expect(within(comuna).getByRole('option', { name: 'Lota' })).toBeInTheDocument();
  });

  it('bloquea registro con RUN inválido y muestra mensaje contextual', async () => {
    const user = userEvent.setup();
    renderUsers('/registro');
    await user.type(screen.getByLabelText(/^RUN$/i), '12345678-9');
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }));
    expect(screen.getByText(/el RUN ingresado no es válido/i)).toBeInTheDocument();
  });

  it('muestra usuarios y elimina uno con confirmación', async () => {
    const user = userEvent.setup();
    renderUsers('/admin/usuarios');
    expect(screen.getAllByTestId('admin-usuario-row')).toHaveLength(3);
    await user.click(within(screen.getAllByTestId('admin-usuario-row')[0]).getByRole('button', { name: /eliminar usuario/i }));
    await user.click(screen.getByRole('button', { name: /confirmar eliminación/i }));
    expect(screen.getAllByTestId('admin-usuario-row')).toHaveLength(2);
  });

  it('edita el rol de un usuario en el mantenedor', async () => {
    const user = userEvent.setup();
    renderUsers('/admin/usuarios/us-001/editar');
    await user.selectOptions(screen.getByLabelText(/^rol$/i), 'Administrador');
    await user.click(screen.getByRole('button', { name: /guardar cambios/i }));
    expect(within(screen.getAllByTestId('admin-usuario-row')[0]).getByText('Administrador')).toBeInTheDocument();
  });

  it('permite desactivar y volver a activar un usuario', async () => {
    const user = userEvent.setup();
    renderUsers('/admin/usuarios');
    const orientador = screen.getAllByTestId('admin-usuario-row')[1];
    await user.click(within(orientador).getByRole('button', { name: /desactivar/i }));
    expect(within(orientador).getByText('INACTIVO')).toBeInTheDocument();
    await user.click(within(orientador).getByRole('button', { name: /activar/i }));
    expect(within(orientador).getByText('ACTIVO')).toBeInTheDocument();
  });
});
