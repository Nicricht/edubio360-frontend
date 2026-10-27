import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from '../App';
import { DatosProvider } from '../context/DatosContext';
import { crearSolicitud, listarNotificaciones, listarSolicitudes } from '../services/orientacion';

const estudiante = { correo: 'estudiante@duoc.cl', rol: 'Estudiante' as const, nombre: 'Estudiante Demo' };
const orientador = { correo: 'orientador@duoc.cl', rol: 'Orientador' as const, nombre: 'Orientador Demo' };

function sesion(rol: 'Estudiante' | 'Orientador' | 'Administrador') {
  const correo = rol === 'Estudiante' ? estudiante.correo : rol === 'Orientador' ? orientador.correo : 'admin@duoc.cl';
  sessionStorage.setItem('edubio360:sesion', JSON.stringify({ correo, nombre: rol, rol }));
}

function mostrar(ruta: string) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <DatosProvider><App /></DatosProvider>
    </MemoryRouter>,
  );
}

describe('Vistas migradas de EP1', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('protege la vista de estudiante cuando no existe sesión', () => {
    mostrar('/estudiante');
    expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it('permite iniciar sesión como estudiante y abrir su panel', async () => {
    const user = userEvent.setup();
    mostrar('/login');
    await user.type(screen.getByLabelText(/correo electrónico/i), 'estudiante@duoc.cl');
    await user.type(screen.getByLabelText(/contraseña/i), '1234');
    await user.click(screen.getByRole('button', { name: /ingresar/i }));
    expect(screen.getByRole('heading', { name: /panel del estudiante/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /solicitar orientación/i })).toBeInTheDocument();
  });

  it('muestra las sedes que ya existían en el mapa EP1', () => {
    mostrar('/mapa');
    expect(screen.getByRole('heading', { name: /mapa de sedes/i })).toBeInTheDocument();
    expect(screen.getByText('San Pedro de la Paz')).toBeInTheDocument();
    expect(screen.getByText('Los Ángeles')).toBeInTheDocument();
  });

  it('envía una consulta desde la vista de estudiante y muestra el historial', async () => {
    const user = userEvent.setup();
    sesion('Estudiante');
    mostrar('/solicitar?oferta=of-004');
    await user.type(screen.getByLabelText(/motivo de consulta/i), 'Necesito conocer los requisitos');
    await user.type(screen.getByLabelText(/fecha preferida/i), '2099-12-30');
    await user.click(screen.getByRole('button', { name: /enviar solicitud/i }));
    expect(screen.getByText('Solicitud enviada')).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: /ver mis solicitudes/i }));
    expect(screen.getByText('Enfermería')).toBeInTheDocument();
    expect(screen.getByText(/necesito conocer los requisitos/i)).toBeInTheDocument();
    expect(listarSolicitudes(localStorage)).toHaveLength(1);
  });

  it('permite que el orientador tome una solicitud y cierre la atención', async () => {
    const user = userEvent.setup();
    crearSolicitud(localStorage, estudiante, { ofertaId: 'of-001', oferta: 'Ingeniería en Informática', motivo: 'Consulta académica', fecha: '2099-12-30' });
    sesion('Orientador');
    mostrar('/orientador/solicitudes');
    await user.click(screen.getByRole('button', { name: /tomar solicitud/i }));
    await user.click(screen.getByRole('link', { name: /gestionar orientación/i }));
    await user.selectOptions(screen.getByLabelText(/^estado$/i), 'ATENDIDA');
    await user.type(screen.getByLabelText(/resultado de orientación/i), 'Se entregó información sobre el programa');
    await user.click(screen.getByRole('button', { name: /guardar cambios/i }));
    expect(screen.getByText(/cambios guardados/i)).toBeInTheDocument();
    expect(listarSolicitudes(localStorage)[0].estado).toBe('ATENDIDA');
    expect(listarNotificaciones(localStorage, estudiante.correo)).toHaveLength(3);
  });

  it('impide que un estudiante entre al panel administrativo', () => {
    sesion('Estudiante');
    mostrar('/admin/ofertas');
    expect(screen.getByRole('heading', { name: /panel del estudiante/i })).toBeInTheDocument();
  });

  it('actualiza el mapa y el enlace al catálogo al seleccionar una sede', async () => {
    const user = userEvent.setup();
    mostrar('/mapa');
    await user.click(screen.getByRole('button', { name: /hualpén/i }));
    expect(screen.getByText(/1 ofertas en hualpén/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ver ofertas de esta sede/i })).toHaveAttribute('href', '/carreras?sede=Hualp%C3%A9n');
  });

  it('mantiene las dos alternativas del comparador dentro de la solicitud', async () => {
    const user = userEvent.setup();
    sesion('Estudiante');
    localStorage.setItem('edubio360:comparadas', JSON.stringify(['of-001', 'of-002']));
    mostrar('/comparar');
    await user.click(screen.getByRole('link', { name: /solicitar orientación sobre esta comparación/i }));
    expect(screen.getByText('Alternativas comparadas')).toBeInTheDocument();
    await user.type(screen.getByLabelText(/motivo de consulta/i), 'Comparar los programas');
    await user.type(screen.getByLabelText(/fecha preferida/i), '2099-12-30');
    await user.click(screen.getByRole('button', { name: /enviar solicitud/i }));
    expect(listarSolicitudes(localStorage)[0].ofertasComparadas).toHaveLength(2);
  });
});
