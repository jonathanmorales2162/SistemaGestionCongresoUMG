export interface Competencia {
  id_competencia: number;
  titulo: string;
  descripcion: string;
  cupo: number;
  horario: string; // ISO date string
  id_categoria: number;
  id_staff_responsable?: number; // Nuevo campo según EndpointsDocu
  anio_evento?: number; // Nuevo campo según EndpointsDocu (2020-2030)
  imagen_url?: string; // Nuevo campo según EndpointsDocu (máximo 255 caracteres)
  categoria?: {
    id_categoria: number;
    nombre: string;
    descripcion?: string;
  };
  inscritos?: number;
  disponibles?: number;
}

export interface CompetenciaCreacion {
  titulo: string;
  descripcion: string;
  cupo: number;
  horario: string;
  id_categoria: number;
  id_staff_responsable?: number; // Nuevo campo opcional
  anio_evento?: number; // Nuevo campo opcional (2020-2030)
  imagen_url?: string; // Nuevo campo opcional (máximo 255 caracteres)
}

export interface CompetenciaActualizacion {
  titulo?: string;
  descripcion?: string;
  cupo?: number;
  horario?: string;
  id_categoria?: number;
  id_staff_responsable?: number; // Nuevo campo opcional
  anio_evento?: number; // Nuevo campo opcional (2020-2030)
  imagen_url?: string; // Nuevo campo opcional (máximo 255 caracteres)
}

export interface CompetenciaResponse {
  success: boolean;
  data: Competencia | Competencia[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  message?: string;
}