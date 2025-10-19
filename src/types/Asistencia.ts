export interface Asistencia {
  id_asistencia: number;
  id_usuario: number;
  id_taller?: number;
  id_competencia?: number;
  fecha_asistencia: string; // ISO date string
  presente: boolean;
  observaciones?: string;
  usuario?: {
    id_usuario: number;
    nombre: string;
    apellido: string;
    correo: string;
  };
  taller?: {
    id_taller: number;
    titulo: string;
    descripcion: string;
    cupo: number;
    horario: string;
  };
  competencia?: {
    id_competencia: number;
    titulo: string;
    descripcion: string;
    cupo: number;
    horario: string;
  };
}

export interface AsistenciaCreacion {
  id_usuario: number;
  id_taller?: number;
  id_competencia?: number;
  presente: boolean;
  observaciones?: string;
}

export interface AsistenciaActualizacion {
  presente?: boolean;
  observaciones?: string;
}

export interface AsistenciaResponse {
  success: boolean;
  data: Asistencia | Asistencia[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  message?: string;
}