import type { Oferta, Usuario } from '../types';

type FilaOferta = readonly [string, string, string, string, string, string, number, number, number, string];

const filas: FilaOferta[] = [
  ['Ingeniería en Informática', 'Ingeniería en Informática', 'IP DUOC UC', 'Concepción', 'Tecnología', 'Diurno', 8, 216000, 2190000, 'oferta-01-informatica-duoc.jpg'],
  ['Ingeniería en Informática', 'Ingeniería en Informática', 'IP Santo Tomás', 'Concepción', 'Tecnología', 'Diurno', 8, 89000, 1827000, 'oferta-02-informatica-santo-tomas.jpg'],
  ['Ingeniería en Informática', 'Ingeniería en Informática', 'IP INACAP', 'Talcahuano', 'Tecnología', 'Diurno', 8, 220000, 2066000, 'oferta-03-informatica-inacap.jpg'],
  ['Enfermería', 'Enfermería', 'Universidad de Concepción', 'Concepción', 'Salud', 'Diurno', 10, 120000, 4243207, 'oferta-04-enfermeria-udec.jpg'],
  ['Enfermería', 'Enfermería', 'Universidad San Sebastián', 'Concepción', 'Salud', 'Diurno', 10, 185300, 4643800, 'oferta-05-enfermeria-uss.jpg'],
  ['Enfermería', 'Enfermería', 'Universidad Santo Tomás', 'Los Ángeles', 'Salud', 'Diurno', 10, 134000, 3662000, 'oferta-06-enfermeria-ust.jpg'],
  ['Psicología', 'Psicología', 'Universidad de Concepción', 'Concepción', 'Ciencias Sociales', 'Diurno', 11, 120000, 4155549, 'oferta-07-psicologia-udec.jpg'],
  ['Psicología', 'Psicología', 'Universidad San Sebastián', 'Concepción', 'Ciencias Sociales', 'Diurno', 10, 185300, 4799100, 'oferta-08-psicologia-uss.jpg'],
  ['Psicología', 'Psicología', 'Universidad Santo Tomás', 'Concepción', 'Ciencias Sociales', 'Diurno', 10, 134000, 3987000, 'oferta-09-psicologia-ust.jpg'],
  ['Ingeniería Comercial', 'Ingeniería Comercial', 'Universidad del Bío-Bío', 'Concepción', 'Administración y Comercio', 'Diurno', 10, 105000, 3255000, 'oferta-10-comercial-ubb.jpg'],
  ['Ingeniería Comercial', 'Ingeniería Comercial', 'Universidad de Concepción', 'Concepción', 'Administración y Comercio', 'Diurno', 10, 120000, 4584271, 'oferta-11-comercial-udec.jpg'],
  ['Ingeniería Comercial', 'Ingeniería Comercial', 'Universidad Católica de la Santísima Concepción', 'Concepción', 'Administración y Comercio', 'Diurno', 10, 90000, 3325000, 'oferta-12-comercial-ucsc.jpg'],
  ['Trabajo Social', 'Trabajo Social', 'Universidad Católica de la Santísima Concepción', 'Concepción', 'Ciencias Sociales', 'Diurno', 9, 90000, 2488000, 'oferta-13-trabajo-social-ucsc.jpg'],
  ['Trabajo Social', 'Trabajo Social', 'Universidad de Concepción', 'Concepción', 'Ciencias Sociales', 'Diurno', 10, 120000, 3530746, 'oferta-14-trabajo-social-udec.jpg'],
  ['Trabajo Social', 'Trabajo Social', 'Universidad Santo Tomás', 'Los Ángeles', 'Ciencias Sociales', 'Diurno', 9, 134000, 2245000, 'oferta-15-trabajo-social-ust.jpg'],
  ['Analista Programador', 'Programación', 'CFT INACAP', 'Talcahuano', 'Tecnología', 'Diurno', 4, 220000, 2066000, 'oferta-16-programacion-inacap-talcahuano.jpg'],
  ['Analista Programador', 'Programación', 'CFT INACAP', 'Los Ángeles', 'Tecnología', 'Vespertino', 4, 220000, 1988000, 'oferta-17-programacion-inacap-los-angeles.jpg'],
  ['Técnico Analista Programador', 'Programación', 'IP Dr. Virginio Gómez G.', 'Concepción', 'Tecnología', 'Vespertino', 4, 144000, 1558000, 'oferta-18-programacion-virginio-gomez.jpg'],
  ['Técnico en Automatización y Control Industrial', 'Automatización', 'IP AIEP', 'Concepción', 'Tecnología', 'Vespertino', 5, 190000, 1840000, 'oferta-19-automatizacion-aiep.jpg'],
  ['Técnico en Automatización y Robótica', 'Automatización', 'CFT INACAP', 'San Pedro de la Paz', 'Tecnología', 'Diurno', 4, 220000, 2214000, 'oferta-20-robotica-inacap.jpg'],
  ['Técnico Universitario en Automatización y Control', 'Automatización', 'Universidad Técnica Federico Santa María', 'Hualpén', 'Tecnología', 'Diurno', 5, 186000, 2150000, 'oferta-21-automatizacion-usm.jpg'],
];

export const seedOfertas: Oferta[] = filas.map((fila, index) => ({
  id: `of-${String(index + 1).padStart(3, '0')}`,
  carrera: fila[0],
  grupoComparacion: fila[1],
  institucion: fila[2],
  comuna: fila[3],
  area: fila[4],
  jornada: fila[5],
  duracion: fila[6],
  matricula: fila[7],
  arancel: fila[8],
  imagen: `/img/ofertas/${fila[9]}`,
  modalidad: 'Presencial',
  nivel: fila[0].startsWith('Técnico') || fila[0].startsWith('Analista') ? 'Técnico' : 'Profesional',
  descripcion: 'Oferta de educación superior de la Región del Biobío. Consulta los valores y requisitos actuales con la institución.',
  cupos: [8, 24, 36, 12, 30][index % 5],
  cupoCritico: 10,
}));

export const seedUsuarios: Usuario[] = [
  {
    id: 'us-001', run: '12345678-5', nombre: 'Estudiante', apellidos: 'Demo',
    correo: 'estudiante@duoc.cl', rol: 'Estudiante', estado: 'ACTIVO',
    region: 'Biobío', comuna: 'Concepción', direccion: 'Concepción',
  },
  {
    id: 'us-002', run: '11111111-1', nombre: 'Orientador', apellidos: 'Demo',
    correo: 'orientador@duoc.cl', rol: 'Orientador', estado: 'ACTIVO',
    region: 'Biobío', comuna: 'Talcahuano', direccion: 'Talcahuano',
  },
  {
    id: 'us-003', run: '22222222-2', nombre: 'Administrador', apellidos: 'Demo',
    correo: 'admin@duoc.cl', rol: 'Administrador', estado: 'ACTIVO',
    region: 'Biobío', comuna: 'Concepción', direccion: 'Concepción',
  },
];
