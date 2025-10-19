export interface Resultado {
  id_resultado: number;
  titulo: string;
  descripcion: string;
  id_categoria: number;
  categoria?: {
    id_categoria: number;
    nombre: string;
    descripcion?: string;
  };
  tipo: 'taller' | 'competencia' | 'general';
  id_referencia?: number; // ID del taller o competencia relacionada
  anio_evento?: number; // Nuevo campo según EndpointsDocu (2020-2030)
  imagen_url?: string; // Nuevo campo según EndpointsDocu (máximo 255 caracteres)
  ganadores: {
    posicion: number;
    id_usuario: number;
    usuario?: {
      nombre: string;
      apellido: string;
      correo: string;
    };
    proyecto?: string;
    puntuacion?: number;
  }[];
  menciones?: {
    id_usuario: number;
    usuario?: {
      nombre: string;
      apellido: string;
      correo: string;
    };
    tipo_mencion: string;
    descripcion?: string;
  }[];
  publicado: boolean;
  fecha_publicacion?: string;
  visualizaciones: number;
  archivo_adjunto?: string;
  creado_en: string;
  actualizado_en: string;
}

export interface ResultadoCreacion {
  titulo: string;
  descripcion: string;
  id_categoria: number;
  tipo: 'taller' | 'competencia' | 'general';
  id_referencia?: number;
  anio_evento?: number; // Nuevo campo opcional (2020-2030)
  imagen_url?: string; // Nuevo campo opcional (máximo 255 caracteres)
  ganadores: {
    posicion: number;
    id_usuario: number;
    proyecto?: string;
    puntuacion?: number;
  }[];
  menciones?: {
    id_usuario: number;
    tipo_mencion: string;
    descripcion?: string;
  }[];
  publicado?: boolean;
  archivo_adjunto?: string;
}

export interface ResultadoActualizacion {
  titulo?: string;
  descripcion?: string;
  id_categoria?: number;
  anio_evento?: number; // Nuevo campo opcional (2020-2030)
  imagen_url?: string; // Nuevo campo opcional (máximo 255 caracteres)
  ganadores?: {
    posicion: number;
    id_usuario: number;
    proyecto?: string;
    puntuacion?: number;
  }[];
  menciones?: {
    id_usuario: number;
    tipo_mencion: string;
    descripcion?: string;
  }[];
  archivo_adjunto?: string;
}

export interface ResultadoResponse {
  success: boolean;
  message: string;
  data: Resultado | Resultado[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}