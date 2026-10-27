import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { DatosProvider } from '../../context/DatosContext';
import { seedOfertas } from '../../data/seed';
import { OfertaCard } from './OfertaCard';

describe('OfertaCard', () => {
  it('muestra las propiedades tipadas de una oferta', () => {
    render(
      <MemoryRouter>
        <DatosProvider>
          <OfertaCard oferta={seedOfertas[0]} />
        </DatosProvider>
      </MemoryRouter>,
    );
    expect(screen.getByText('Ingeniería en Informática')).toBeInTheDocument();
    expect(screen.getByText('IP DUOC UC')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ver detalle/i })).toHaveAttribute(
      'href',
      '/carreras/of-001',
    );
  });

  it('marca y desmarca una oferta al comparar', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <DatosProvider>
          <OfertaCard oferta={seedOfertas[0]} />
        </DatosProvider>
      </MemoryRouter>,
    );
    const button = screen.getByRole('button', { name: /comparar/i });
    expect(button).toHaveAttribute('aria-pressed', 'false');
    await user.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });
});
