export interface Inscripcion {
  id_inscripcion: number;
  id_usuario: number;
  id_taller?: number;
  id_competencia?: number;
  fecha_inscripcion: string; // ISO date string
  observaciones?: string;
  tipo_evento: 1 | 2 | 3; // 1=taller, 2=competencia, 3=foro
  usuario?: {
    id_usuario: number;
    nombre: string;
    apellido: string;
    correo: string;
    telefono?: string;
    institucion?: string;
  };
  taller?: {
    id_taller: number;
    titulo: string;
    horario: string;
    cupo: number;
    descripcion: string;
  };
  competencia?: {
    id_competencia: number;
    titulo: string;
    horario: string;
    cupo: number;
    descripcion: string;
  };
}

export interface InscripcionCreacion {
  id_usuario: number;
  tipo_evento: 1 | 2 | 3; // 1=taller, 2=competencia, 3=foro
  id_evento: number;
  observaciones?: string;
}

export interface InscripcionActualizacion {
  observaciones?: string;
}

export interface InscripcionResponse {
  success: boolean;
  data: Inscripcion | Inscripcion[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  message?: string;
}