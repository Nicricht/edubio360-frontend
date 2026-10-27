import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { DatosProvider } from '../context/DatosContext';
import { AdminOfertas } from './AdminOfertas';
import { AdminOfertaForm } from './AdminOfertaForm';

function show(initial: string) {
  return render(
    <MemoryRouter initialEntries={[initial]}>
      <DatosProvider>
        <Routes>
          <Route path="/admin/ofertas" element={<AdminOfertas />} />
          <Route path="/admin/ofertas/nueva" element={<AdminOfertaForm />} />
          <Route path="/admin/ofertas/:id/editar" element={<AdminOfertaForm />} />
        </Routes>
      </DatosProvider>
    </MemoryRouter>,
  );
}

describe('Administración de ofertas (CRUD visual)', () => {
  it('muestra el listado e inicia el flujo de eliminación confirmado', async () => {
    const user = userEvent.setup();
    show('/admin/ofertas');
    expect(screen.getAllByTestId('admin-oferta-row')).toHaveLength(21);
    const row = screen.getAllByTestId('admin-oferta-row')[0];
    await user.click(within(row).getByRole('button', { name: /eliminar/i }));
    expect(
      screen.getByRole('alertdialog', { name: /confirmación de eliminación/i }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /confirmar eliminación/i }));
    expect(screen.getAllByTestId('admin-oferta-row')).toHaveLength(20);
  });

  it('impide guardar una oferta con datos inválidos', async () => {
    const user = userEvent.setup();
    show('/admin/ofertas/nueva');
    await user.click(screen.getByRole('button', { name: /guardar oferta/i }));
    expect(screen.getAllByRole('alert').length).toBeGreaterThan(1);
  });

  it('organiza el formulario con columnas responsivas de Bootstrap', () => {
    show('/admin/ofertas/nueva');
    expect(screen.getByLabelText(/^carrera$/i).closest('.col-md-6')).toBeInTheDocument();
    expect(screen.getByLabelText(/^modalidad$/i).closest('.col-md-4')).toBeInTheDocument();
    expect(screen.getByLabelText(/^descripción$/i).closest('.col-12')).toBeInTheDocument();
  });

  it('crea una oferta desde el formulario y actualiza el listado', async () => {
    const user = userEvent.setup();
    show('/admin/ofertas/nueva');
    await user.type(screen.getByLabelText(/^carrera$/i), 'Técnico en Redes');
    await user.type(screen.getByLabelText(/^institución$/i), 'Institución de demostración');
    await user.type(screen.getByLabelText(/^comuna$/i), 'Concepción');
    await user.type(screen.getByLabelText(/^área$/i), 'Tecnología');
    await user.type(screen.getByLabelText(/^modalidad$/i), 'Presencial');
    await user.type(screen.getByLabelText(/^jornada$/i), 'Vespertino');
    await user.type(screen.getByLabelText(/^nivel$/i), 'Pregrado');
    await user.clear(screen.getByLabelText(/duración/i));
    await user.type(screen.getByLabelText(/duración/i), '5');
    await user.type(screen.getByLabelText(/^matrícula/i), '100000');
    await user.type(screen.getByLabelText(/^arancel/i), '1800000');
    await user.type(screen.getByLabelText(/^descripción$/i), 'Programa de demostración para EP2.');
    await user.click(screen.getByRole('button', { name: /guardar oferta/i }));
    expect(screen.getByText('Técnico en Redes')).toBeInTheDocument();
    expect(screen.getAllByTestId('admin-oferta-row')).toHaveLength(22);
  }, 15000);

  it('edita una oferta existente y refleja el nombre actualizado', async () => {
    const user = userEvent.setup();
    show('/admin/ofertas/of-001/editar');
    const carrera = screen.getByLabelText(/^carrera$/i);
    await user.clear(carrera);
    await user.type(carrera, 'Informática Actualizada');
    await user.click(screen.getByRole('button', { name: /guardar cambios/i }));
    expect(screen.getByText('Informática Actualizada')).toBeInTheDocument();
  });

  it('permite actualizar los cupos disponibles de una oferta original', async () => {
    const user = userEvent.setup();
    show('/admin/ofertas/of-001/editar');
    const cupos = screen.getByLabelText(/cupos disponibles/i);
    await user.clear(cupos);
    await user.type(cupos, '4');
    await user.click(screen.getByRole('button', { name: /guardar cambios/i }));
    expect(JSON.parse(localStorage.getItem('edubio360:ofertas') || '[]')[0].cupos).toBe(4);
  });
});
