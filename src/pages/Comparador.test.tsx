import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { DatosProvider, useDatos } from '../context/DatosContext';
import { Comparador } from './Comparador';

function WithOffer() {
  const { ofertas, toggleComparar } = useDatos();
  return (
    <>
      <button onClick={() => toggleComparar(ofertas[0].id)}>Seleccionar prueba</button>
      <Comparador />
    </>
  );
}

describe('Comparador', () => {
  it('explica qué hacer cuando aún no hay ofertas seleccionadas', () => {
    render(
      <MemoryRouter>
        <DatosProvider>
          <Comparador />
        </DatosProvider>
      </MemoryRouter>,
    );
    expect(screen.getByText(/aún no has agregado carreras/i)).toBeInTheDocument();
  });

  it('permite eliminar una oferta previamente agregada', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <DatosProvider>
          <WithOffer />
        </DatosProvider>
      </MemoryRouter>,
    );
    await user.click(screen.getByRole('button', { name: /seleccionar prueba/i }));
    expect(screen.getByText('Ingeniería en Informática')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /quitar ingeniería en informática/i }));
    expect(screen.getByText(/aún no has agregado carreras/i)).toBeInTheDocument();
  });
});
