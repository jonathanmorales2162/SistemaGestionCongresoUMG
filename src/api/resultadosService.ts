import api from './axiosConfig';
import type { Resultado, ResultadoCreacion, ResultadoActualizacion, ResultadoResponse } from '../types/Resultado';

export const resultadosService = {
  // Obtener todos los resultados (solo admin)
  obtenerResultados: async (page?: number, limit?: number): Promise<{ resultados: Resultado[]; pagination?: { currentPage: number; totalPages: number; totalItems: number; itemsPerPage: number } }> => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    const response = await api.get<ResultadoResponse>(`/resultados?${params.toString()}`);
    return {
      resultados: Array.isArray(response.data.data) ? response.data.data : [response.data.data],
      pagination: response.data.pagination
    };
  },

  // Obtener resultado por ID
  obtenerResultadoPorId: async (id: number): Promise<Resultado> => {
    const response = await api.get<ResultadoResponse>(`/resultados/${id}`);
    return response.data.data as Resultado;
  },

  // Obtener resultados por categoría
  obtenerResultadosPorCategoria: async (idCategoria: number): Promise<Resultado[]> => {
    const response = await api.get<ResultadoResponse>(`/resultados/categoria/${idCategoria}`);
    return Array.isArray(response.data.data) ? response.data.data : [response.data.data];
  },

  // Crear nuevo resultado (solo admin)
  crearResultado: async (resultado: ResultadoCreacion): Promise<Resultado> => {
    const response = await api.post<ResultadoResponse>('/resultados', resultado);
    return response.data.data as Resultado;
  },

  // Actualizar resultado (solo admin)
  actualizarResultado: async (id: number, resultado: ResultadoActualizacion): Promise<Resultado> => {
    const response = await api.put<ResultadoResponse>(`/resultados/${id}`, resultado);
    return response.data.data as Resultado;
  },

  // Eliminar resultado (solo admin)
  eliminarResultado: async (id: number): Promise<void> => {
    await api.delete(`/resultados/${id}`);
  },

  // Publicar resultado (solo admin)
  publicarResultado: async (id: number): Promise<Resultado> => {
    const response = await api.patch<ResultadoResponse>(`/resultados/${id}/publicar`);
    return response.data.data as Resultado;
  },

  // Despublicar resultado (solo admin)
  despublicarResultado: async (id: number): Promise<Resultado> => {
    const response = await api.patch<ResultadoResponse>(`/resultados/${id}/despublicar`);
    return response.data.data as Resultado;
  },

  // Obtener estadísticas de resultados (solo admin)
  obtenerEstadisticas: async (): Promise<{
    totalResultados: number;
    publicados: number;
    pendientes: number;
    visualizaciones: number;
  }> => {
    const response = await api.get('/resultados/estadisticas');
    return response.data.data;
  },

  // Notificar participantes sobre resultado (solo admin)
  notificarParticipantes: async (id: number): Promise<void> => {
    await api.post(`/resultados/${id}/notificar`);
  }
};