export interface Foro {
  id_foro: number;
  titulo: string;
  descripcion: string;
  id_usuario_creador: number;
  fecha_creacion: string; // ISO date string
  activo: boolean;
  anio_evento?: number; // Nuevo campo según EndpointsDocu (2020-2030)
  imagen_url?: string; // Nuevo campo según EndpointsDocu (máximo 255 caracteres)
  usuario_creador?: {
    id_usuario: number;
    nombre: string;
    apellido: string;
  };
  total_mensajes?: number;
}

export interface ForoCreacion {
  titulo: string;
  descripcion: string;
  anio_evento?: number; // Nuevo campo opcional (2020-2030)
  imagen_url?: string; // Nuevo campo opcional (máximo 255 caracteres)
}

export interface ForoActualizacion {
  titulo?: string;
  descripcion?: string;
  activo?: boolean;
  anio_evento?: number; // Nuevo campo opcional (2020-2030)
  imagen_url?: string; // Nuevo campo opcional (máximo 255 caracteres)
}

export interface MensajeForo {
  id_mensaje: number;
  id_foro: number;
  id_usuario: number;
  contenido: string;
  fecha_mensaje: string; // ISO date string
  usuario?: {
    id_usuario: number;
    nombre: string;
    apellido: string;
  };
}

export interface MensajeCreacion {
  contenido: string;
}

export interface ForoResponse {
  success: boolean;
  data: Foro | Foro[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  message?: string;
}

export interface MensajeResponse {
  success: boolean;
  data: MensajeForo | MensajeForo[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  message?: string;
}