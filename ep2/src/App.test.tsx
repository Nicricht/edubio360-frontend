import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { DatosProvider } from './context/DatosContext';
import { App } from './App';

function at(url: string) {
  render(
    <MemoryRouter initialEntries={[url]}>
      <DatosProvider>
        <App />
      </DatosProvider>
    </MemoryRouter>,
  );
}

describe('Navegación React Router', () => {
  it('muestra la portada y la navegación principal', () => {
    at('/');
    expect(screen.getByRole('heading', { name: /tu futuro comienza/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /explorar carreras/i })).toHaveAttribute(
      'href',
      '/carreras',
    );
  });

  it('muestra la página Nosotros', () => {
    at('/nosotros');
    expect(screen.getByRole('heading', { name: /conoce edubío/i })).toBeInTheDocument();
  });

  it('muestra ambas novedades y acceso a detalles', () => {
    at('/novedades');
    expect(screen.getAllByRole('link', { name: /leer artículo/i })).toHaveLength(2);
  });

  it('muestra ruta de página inexistente', () => {
    at('/ruta-que-no-existe');
    expect(screen.getByRole('heading', { name: /página no encontrada/i })).toBeInTheDocument();
  });
});
