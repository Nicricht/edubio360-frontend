import { render, screen } from '@testing-library/react';
import { act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { DatosProvider, useDatos } from './DatosContext';

function Probe() {
  const { ofertas, comparadasIds, toggleComparar, createOferta } = useDatos();
  return (
    <>
      <output aria-label="total ofertas">{ofertas.length}</output>
      <output aria-label="total comparadas">{comparadasIds.length}</output>
      <button onClick={() => toggleComparar(ofertas[0].id)}>Comparar primera</button>
      <button onClick={() => createOferta({ ...ofertas[0], id: 'of-nueva' })}>Crear prueba</button>
    </>
  );
}

function ProbeGrupo() {
  const { ofertas, comparadasIds, toggleComparar } = useDatos();
  return <>
    <output aria-label="cantidad comparación">{comparadasIds.length}</output>
    {[0, 1, 2, 3].map((indice) => <button key={indice} onClick={() => toggleComparar(ofertas[indice].id)}>Agregar {indice}</button>)}
  </>;
}

describe('DatosProvider', () => {
  it('agrega a comparar y evita duplicados al pulsar dos veces', async () => {
    const user = userEvent.setup();
    render(
      <DatosProvider>
        <Probe />
      </DatosProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Comparar primera' }));
    expect(screen.getByLabelText('total comparadas')).toHaveTextContent('1');
    await user.click(screen.getByRole('button', { name: 'Comparar primera' }));
    expect(screen.getByLabelText('total comparadas')).toHaveTextContent('0');
  });

  it('actualiza inmediatamente las listas al crear una oferta', async () => {
    const user = userEvent.setup();
    render(
      <DatosProvider>
        <Probe />
      </DatosProvider>,
    );
    const before = Number(screen.getByLabelText('total ofertas').textContent);
    await user.click(screen.getByRole('button', { name: 'Crear prueba' }));
    expect(screen.getByLabelText('total ofertas')).toHaveTextContent(String(before + 1));
  });

  it('persiste selección de comparación en LocalStorage', async () => {
    const user = userEvent.setup();
    render(
      <DatosProvider>
        <Probe />
      </DatosProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Comparar primera' }));
    expect(JSON.parse(localStorage.getItem('edubio360:comparadas') || '[]')).toHaveLength(1);
  });

  it('permite comparar como máximo tres ofertas equivalentes como en EP1', async () => {
    const user = userEvent.setup();
    render(<DatosProvider><ProbeGrupo /></DatosProvider>);
    await user.click(screen.getByRole('button', { name: 'Agregar 0' }));
    await user.click(screen.getByRole('button', { name: 'Agregar 1' }));
    await user.click(screen.getByRole('button', { name: 'Agregar 2' }));
    expect(screen.getByLabelText('cantidad comparación')).toHaveTextContent('3');
    await user.click(screen.getByRole('button', { name: 'Agregar 3' }));
    expect(screen.getByLabelText('cantidad comparación')).toHaveTextContent('3');
  });

  it('no mezcla carreras de distintos grupos de comparación', async () => {
    const user = userEvent.setup();
    render(<DatosProvider><ProbeGrupo /></DatosProvider>);
    await user.click(screen.getByRole('button', { name: 'Agregar 0' }));
    await user.click(screen.getByRole('button', { name: 'Agregar 3' }));
    expect(screen.getByLabelText('cantidad comparación')).toHaveTextContent('1');
  });

  it('actualiza las ofertas cuando otra pestaña modifica el almacenamiento', () => {
    render(<DatosProvider><Probe /></DatosProvider>);
    expect(screen.getByLabelText('total ofertas')).toHaveTextContent('21');
    act(() => {
      localStorage.setItem('edubio360:ofertas', '[]');
      window.dispatchEvent(new StorageEvent('storage', { key: 'edubio360:ofertas' }));
    });
    expect(screen.getByLabelText('total ofertas')).toHaveTextContent('0');
  });
});
