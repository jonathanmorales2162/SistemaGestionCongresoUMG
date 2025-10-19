import api from './axiosConfig';
import type { Asistencia, AsistenciaCreacion, AsistenciaActualizacion, AsistenciaResponse } from '../types/Asistencia';

export const asistenciaService = {
  // Obtener todas las asistencias (solo admin)
  obtenerAsistencias: async (page?: number, limit?: number): Promise<{ asistencias: Asistencia[]; pagination?: { currentPage: number; totalPages: number; totalItems: number; itemsPerPage: number } }> => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    const response = await api.get<AsistenciaResponse>(`/asistencia?${params.toString()}`);
    return {
      asistencias: Array.isArray(response.data.data) ? response.data.data : [response.data.data],
      pagination: response.data.pagination
    };
  },

  // Obtener asistencia por ID (solo admin)
  obtenerAsistenciaPorId: async (id: number): Promise<Asistencia> => {
    const response = await api.get<AsistenciaResponse>(`/asistencia/${id}`);
    return response.data.data as Asistencia;
  },

  // Registrar asistencia (solo admin)
  registrarAsistencia: async (asistencia: AsistenciaCreacion): Promise<Asistencia> => {
    const response = await api.post<AsistenciaResponse>('/asistencia', asistencia);
    return response.data.data as Asistencia;
  },

  // Actualizar asistencia (solo admin)
  actualizarAsistencia: async (id: number, asistencia: AsistenciaActualizacion): Promise<Asistencia> => {
    const response = await api.put<AsistenciaResponse>(`/asistencia/${id}`, asistencia);
    return response.data.data as Asistencia;
  },

  // Eliminar registro de asistencia (solo admin)
  eliminarAsistencia: async (id: number): Promise<void> => {
    await api.delete(`/asistencia/${id}`);
  },

  // Obtener asistencias por taller (solo admin)
  obtenerAsistenciasPorTaller: async (idTaller: number): Promise<Asistencia[]> => {
    const response = await api.get<AsistenciaResponse>(`/asistencia/taller/${idTaller}`);
    return Array.isArray(response.data.data) ? response.data.data : [response.data.data];
  },

  // Obtener asistencias por competencia (solo admin)
  obtenerAsistenciasPorCompetencia: async (idCompetencia: number): Promise<Asistencia[]> => {
    const response = await api.get<AsistenciaResponse>(`/asistencia/competencia/${idCompetencia}`);
    return Array.isArray(response.data.data) ? response.data.data : [response.data.data];
  },

  // Obtener asistencias de un usuario (solo admin)
  obtenerAsistenciasPorUsuario: async (idUsuario: number): Promise<Asistencia[]> => {
    const response = await api.get<AsistenciaResponse>(`/asistencia/usuario/${idUsuario}`);
    return Array.isArray(response.data.data) ? response.data.data : [response.data.data];
  },

  // Obtener estadísticas de asistencia
  obtenerEstadisticas: async (): Promise<{
    presentesHoy: number;
    totalEsperados: number;
    tasaAsistencia: number;
    llegadasTardias: number;
  }> => {
    try {
      const response = await api.get<AsistenciaResponse>('/asistencia');
      const asistencias = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
      
      const hoy = new Date().toISOString().split('T')[0];
      const asistenciasHoy = asistencias.filter(a => 
        a.fecha_asistencia.split('T')[0] === hoy
      );
      
      const presentesHoy = asistenciasHoy.filter(a => a.presente).length;
      const totalEsperados = asistenciasHoy.length;
      const tasaAsistencia = totalEsperados > 0 ? Math.round((presentesHoy / totalEsperados) * 100) : 0;
      
      return {
        presentesHoy,
        totalEsperados,
        tasaAsistencia,
        llegadasTardias: 0 // Placeholder - se puede calcular con lógica adicional
      };
    } catch (error) {
      // Si no hay datos, retornar estadísticas vacías
      return {
        presentesHoy: 0,
        totalEsperados: 0,
        tasaAsistencia: 0,
        llegadasTardias: 0
      };
    }
  }
};