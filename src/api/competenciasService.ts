import api from './axiosConfig';
import type { Competencia, CompetenciaCreacion, CompetenciaActualizacion, CompetenciaResponse } from '../types/Competencia';

export const competenciasService = {
  // Obtener todas las competencias
  obtenerCompetencias: async (page?: number, limit?: number): Promise<{ competencias: Competencia[]; pagination?: { currentPage: number; totalPages: number; totalItems: number; itemsPerPage: number } }> => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    const response = await api.get<CompetenciaResponse>(`/competencias?${params.toString()}`);
    return {
      competencias: Array.isArray(response.data.data) ? response.data.data : [response.data.data],
      pagination: response.data.pagination
    };
  },

  // Obtener competencia por ID
  obtenerCompetenciaPorId: async (id: number): Promise<Competencia> => {
    const response = await api.get<CompetenciaResponse>(`/competencias/${id}`);
    return response.data.data as Competencia;
  },

  // Obtener competencias por categoría
  obtenerCompetenciasPorCategoria: async (idCategoria: number): Promise<Competencia[]> => {
    const response = await api.get<CompetenciaResponse>(`/competencias/categoria/${idCategoria}`);
    return Array.isArray(response.data.data) ? response.data.data : [response.data.data];
  },

  // Crear nueva competencia (solo admin)
  crearCompetencia: async (competencia: CompetenciaCreacion): Promise<Competencia> => {
    const response = await api.post<CompetenciaResponse>('/competencias', competencia);
    return response.data.data as Competencia;
  },

  // Actualizar competencia (solo admin)
  actualizarCompetencia: async (id: number, competencia: CompetenciaActualizacion): Promise<Competencia> => {
    const response = await api.put<CompetenciaResponse>(`/competencias/${id}`, competencia);
    return response.data.data as Competencia;
  },

  // Eliminar competencia (solo admin)
  eliminarCompetencia: async (id: number): Promise<void> => {
    await api.delete(`/competencias/${id}`);
  },

  // Obtener participantes de una competencia (solo admin)
  obtenerParticipantes: async (id: number): Promise<{ id_usuario: number; nombre: string; apellido: string; correo: string }[]> => {
    const response = await api.get(`/competencias/${id}/participantes`);
    return response.data.data;
  }
};