export interface Categoria {
  id_categoria: number;
  nombre: string;
  descripcion: string;
  fecha_creacion: string;
  activo: boolean;
}

export interface CategoriaResponse {
  success: boolean;
  data: Categoria | Categoria[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  message?: string;
}