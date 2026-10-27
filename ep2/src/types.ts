export interface Oferta {
  id: string;
  carrera: string;
  institucion: string;
  comuna: string;
  area: string;
  modalidad: string;
  jornada: string;
  duracion: number;
  matricula: number;
  arancel: number;
  nivel: string;
  descripcion: string;
  grupoComparacion?: string;
  imagen?: string;
  cupos?: number;
  cupoCritico?: number;
}

export interface Usuario {
  id: string;
  run: string;
  nombre: string;
  apellidos: string;
  correo: string;
  rol: 'Estudiante' | 'Orientador' | 'Administrador';
  estado?: 'ACTIVO' | 'INACTIVO';
  region: string;
  comuna: string;
  direccion: string;
}

export interface Repository<T extends { id: string }> {
  list(): T[];
  get(id: string): T | undefined;
  create(item: T): T;
  update(id: string, changes: Partial<Omit<T, 'id'>>): T | undefined;
  remove(id: string): boolean;
}
