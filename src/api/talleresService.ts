import api from './axiosConfig';
import type { Taller, TallerCreacion, TallerActualizacion, TallerResponse } from '../types/Taller';

export const talleresService = {
  // Obtener todos los talleres
  obtenerTalleres: async (page?: number, limit?: number): Promise<{ talleres: Taller[]; pagination?: { currentPage: number; totalPages: number; totalItems: number; itemsPerPage: number } }> => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    const response = await api.get<TallerResponse>(`/talleres?${params.toString()}`);
    return {
      talleres: Array.isArray(response.data.data) ? response.data.data : [response.data.data],
      pagination: response.data.pagination
    };
  },

  // Obtener taller por ID
  obtenerTallerPorId: async (id: number): Promise<Taller> => {
    const response = await api.get<TallerResponse>(`/talleres/${id}`);
    return response.data.data as Taller;
  },

  // Obtener talleres por categoría
  obtenerTalleresPorCategoria: async (idCategoria: number): Promise<Taller[]> => {
    const response = await api.get<TallerResponse>(`/talleres/categoria/${idCategoria}`);
    return Array.isArray(response.data.data) ? response.data.data : [response.data.data];
  },

  // Crear nuevo taller (solo admin)
  crearTaller: async (taller: TallerCreacion): Promise<Taller> => {
    const response = await api.post<TallerResponse>('/talleres', taller);
    return response.data.data as Taller;
  },

  // Actualizar taller (solo admin)
  actualizarTaller: async (id: number, taller: TallerActualizacion): Promise<Taller> => {
    const response = await api.put<TallerResponse>(`/talleres/${id}`, taller);
    return response.data.data as Taller;
  },

  // Eliminar taller (solo admin)
  eliminarTaller: async (id: number): Promise<void> => {
    await api.delete(`/talleres/${id}`);
  },

  // Obtener participantes de un taller (solo admin)
  obtenerParticipantes: async (id: number): Promise<{ id_usuario: number; nombre: string; apellido: string; correo: string }[]> => {
    const response = await api.get(`/talleres/${id}/participantes`);
    return response.data.data;
  }
};