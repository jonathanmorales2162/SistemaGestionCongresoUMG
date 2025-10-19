import api from './axiosConfig';
import type { Diploma, DiplomaGeneracion, DiplomaResponse } from '../types/Diploma';

export const diplomasService = {
  // Obtener todos los diplomas (solo admin)
  obtenerDiplomas: async (page?: number, limit?: number): Promise<{ diplomas: Diploma[]; pagination?: { currentPage: number; totalPages: number; totalItems: number; itemsPerPage: number } }> => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    const response = await api.get<DiplomaResponse>(`/diplomas?${params.toString()}`);
    return {
      diplomas: Array.isArray(response.data.data) ? response.data.data : [response.data.data],
      pagination: response.data.pagination
    };
  },

  // Obtener diplomas del usuario autenticado
  obtenerMisDiplomas: async (): Promise<Diploma[]> => {
    const response = await api.get<DiplomaResponse>('/diplomas/mis-diplomas');
    return Array.isArray(response.data.data) ? response.data.data : [response.data.data];
  },

  // Obtener diploma por ID
  obtenerDiplomaPorId: async (id: number): Promise<Diploma> => {
    const response = await api.get<DiplomaResponse>(`/diplomas/${id}`);
    return response.data.data as Diploma;
  },

  // Generar diploma (solo admin)
  generarDiploma: async (diploma: DiplomaGeneracion): Promise<Diploma> => {
    const response = await api.post<DiplomaResponse>('/diplomas', diploma);
    return response.data.data as Diploma;
  },

  // Eliminar diploma (solo admin)
  eliminarDiploma: async (id: number): Promise<void> => {
    await api.delete(`/diplomas/${id}`);
  },

  // Verificar diploma por código
  verificarDiploma: async (codigo: string): Promise<Diploma> => {
    const response = await api.get<DiplomaResponse>(`/diplomas/verificar/${codigo}`);
    return response.data.data as Diploma;
  },

  // Descargar diploma
  descargarDiploma: async (id: number): Promise<Blob> => {
    const response = await api.get(`/diplomas/${id}/descargar`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Obtener diplomas por usuario (solo admin)
  obtenerDiplomasPorUsuario: async (idUsuario: number): Promise<Diploma[]> => {
    const response = await api.get<DiplomaResponse>(`/diplomas/usuario/${idUsuario}`);
    return Array.isArray(response.data.data) ? response.data.data : [response.data.data];
  },

  // Obtener estadísticas de diplomas
  obtenerEstadisticas: async (): Promise<{
    diplomasGenerados: number;
    enviados: number;
    pendientes: number;
    elegibles: number;
  }> => {
    const response = await api.get('/diplomas/estadisticas');
    return response.data;
  },

  // Generar diplomas masivo
  generarDiplomasMasivo: async (): Promise<{ generados: number; message: string }> => {
    const response = await api.post('/diplomas/generar-masivo');
    return response.data;
  },

  // Enviar diplomas masivo por email
  enviarDiplomasMasivo: async (): Promise<{ enviados: number; message: string }> => {
    const response = await api.post('/diplomas/enviar-masivo');
    return response.data;
  }
};