export interface Diploma {
  id_diploma: number;
  id_usuario: number;
  id_taller?: number;
  id_competencia?: number;
  fecha_generacion: string; // ISO date string
  codigo_verificacion: string;
  url_diploma?: string;
  anio_evento?: number; // Nuevo campo según EndpointsDocu (2020-2030)
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
    ponente?: {
      nombre: string;
      apellido: string;
    };
  };
  competencia?: {
    id_competencia: number;
    titulo: string;
    descripcion: string;
    responsable?: {
      nombre: string;
      apellido: string;
    };
  };
}

export interface DiplomaGeneracion {
  id_usuario: number;
  id_taller?: number;
  id_competencia?: number;
  anio_evento?: number; // Nuevo campo opcional (2020-2030)
}

export interface DiplomaResponse {
  success: boolean;
  data: Diploma | Diploma[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  message?: string;
}