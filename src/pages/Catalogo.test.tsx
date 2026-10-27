import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { DatosProvider } from '../context/DatosContext';
import { Catalogo } from './Catalogo';
import { DetalleOferta } from './DetalleOferta';

const renderCatalog = () =>
  render(
    <MemoryRouter initialEntries={['/carreras']}>
      <DatosProvider>
        <Routes>
          <Route path="/carreras" element={<Catalogo />} />
        </Routes>
      </DatosProvider>
    </MemoryRouter>,
  );

describe('Catálogo y detalle', () => {
  it('renderiza todas las ofertas iniciales', () => {
    renderCatalog();
    expect(screen.getAllByTestId('oferta-card')).toHaveLength(21);
  });

  it('filtra por texto y actualiza las tarjetas', async () => {
    const user = userEvent.setup();
    renderCatalog();
    await user.type(
      screen.getByRole('searchbox', { name: /buscar carrera/i }),
      'tecnico universitario en automatizacion y control',
    );
    expect(screen.getAllByTestId('oferta-card')).toHaveLength(1);
    expect(screen.getByText('Técnico Universitario en Automatización y Control')).toBeInTheDocument();
  });

  it('muestra estado vacío y permite limpiar filtros', async () => {
    const user = userEvent.setup();
    renderCatalog();
    await user.type(
      screen.getByRole('searchbox', { name: /buscar carrera/i }),
      'no existe una carrera',
    );
    expect(screen.getByText(/no encontramos ofertas/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /limpiar filtros/i })).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: /limpiar filtros/i }));
    expect(screen.getAllByTestId('oferta-card')).toHaveLength(21);
  });

  it('muestra estado no encontrado para identificador inexistente', () => {
    render(
      <MemoryRouter initialEntries={['/carreras/no-existe']}>
        <DatosProvider>
          <Routes>
            <Route path="/carreras/:id" element={<DetalleOferta />} />
          </Routes>
        </DatosProvider>
      </MemoryRouter>,
    );
    expect(screen.getByText(/oferta no encontrada/i)).toBeInTheDocument();
  });
});
