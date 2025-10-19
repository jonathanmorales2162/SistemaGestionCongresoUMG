import api from './axiosConfig';
import type { Categoria, CategoriaResponse } from '../types/Categoria';

export const categoriasService = {
  // Obtener todas las categorías
  obtenerCategorias: async (): Promise<Categoria[]> => {
    const response = await api.get<CategoriaResponse>('/categorias');
    return Array.isArray(response.data.data) ? response.data.data : [response.data.data];
  },

  // Obtener categoría por ID
  obtenerCategoriaPorId: async (id: number): Promise<Categoria> => {
    const response = await api.get<CategoriaResponse>(`/categorias/${id}`);
    return response.data.data as Categoria;
  },

  // Crear nueva categoría (solo admin)
  crearCategoria: async (categoria: { nombre: string; descripcion?: string }): Promise<Categoria> => {
    const response = await api.post<CategoriaResponse>('/categorias', categoria);
    return response.data.data as Categoria;
  },

  // Actualizar categoría (solo admin)
  actualizarCategoria: async (id: number, categoria: { nombre?: string; descripcion?: string }): Promise<Categoria> => {
    const response = await api.put<CategoriaResponse>(`/categorias/${id}`, categoria);
    return response.data.data as Categoria;
  },

  // Eliminar categoría (solo admin)
  eliminarCategoria: async (id: number): Promise<void> => {
    await api.delete(`/categorias/${id}`);
  }
};