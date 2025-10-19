export interface Taller {
  id_taller: number;
  titulo: string;
  descripcion: string;
  instructor?: string;
  cupo: number;
  horario: string; // ISO date string
  duracion?: number;
  id_categoria: number;
  id_staff_ponente?: number; // Nuevo campo según EndpointsDocu
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

export interface TallerCreacion {
  titulo: string;
  descripcion: string;
  cupo: number;
  horario: string;
  id_categoria: number;
  id_staff_ponente?: number; // Nuevo campo opcional
  anio_evento?: number; // Nuevo campo opcional (2020-2030)
  imagen_url?: string; // Nuevo campo opcional (máximo 255 caracteres)
}

export interface TallerActualizacion {
  titulo?: string;
  descripcion?: string;
  cupo?: number;
  horario?: string;
  id_categoria?: number;
  id_staff_ponente?: number; // Nuevo campo opcional
  anio_evento?: number; // Nuevo campo opcional (2020-2030)
  imagen_url?: string; // Nuevo campo opcional (máximo 255 caracteres)
}

export interface TallerResponse {
  success: boolean;
  data: Taller | Taller[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  message?: string;
}