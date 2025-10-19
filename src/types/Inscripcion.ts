export interface Inscripcion {
  id_inscripcion: number;
  id_usuario: number;
  id_taller?: number;
  id_competencia?: number;
  fecha_inscripcion: string; // ISO date string
  estado: 'activa' | 'cancelada' | 'completada';
  usuario?: {
    id_usuario: number;
    nombre: string;
    apellido: string;
    correo: string;
  };
  taller?: {
    id_taller: number;
    titulo: string;
    horario: string;
  };
  competencia?: {
    id_competencia: number;
    titulo: string;
    horario: string;
  };
}

export interface InscripcionCreacion {
  id_taller?: number;
  id_competencia?: number;
}

export interface InscripcionActualizacion {
  estado?: 'activa' | 'cancelada' | 'completada';
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