import api from './axiosConfig';
import type { Inscripcion, InscripcionCreacion, InscripcionActualizacion, InscripcionResponse } from '../types/Inscripcion';

export const inscripcionesService = {
  // Obtener todas las inscripciones (solo admin)
  obtenerInscripciones: async (page?: number, limit?: number): Promise<{ inscripciones: Inscripcion[]; pagination?: { currentPage: number; totalPages: number; totalItems: number; itemsPerPage: number } }> => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    const response = await api.get<InscripcionResponse>(`/inscripciones?${params.toString()}`);
    return {
      inscripciones: Array.isArray(response.data.data) ? response.data.data : [response.data.data],
      pagination: response.data.pagination
    };
  },

  // Obtener inscripciones del usuario autenticado
  obtenerMisInscripciones: async (): Promise<Inscripcion[]> => {
    const response = await api.get<InscripcionResponse>('/inscripciones/mis-inscripciones');
    return Array.isArray(response.data.data) ? response.data.data : [response.data.data];
  },

  // Obtener inscripción por ID
  obtenerInscripcionPorId: async (id: number): Promise<Inscripcion> => {
    const response = await api.get<InscripcionResponse>(`/inscripciones/${id}`);
    return response.data.data as Inscripcion;
  },

  // Crear nueva inscripción
  crearInscripcion: async (inscripcion: InscripcionCreacion): Promise<Inscripcion> => {
    const response = await api.post<InscripcionResponse>('/inscripciones', inscripcion);
    return response.data.data as Inscripcion;
  },

  // Actualizar inscripción
  actualizarInscripcion: async (id: number, inscripcion: InscripcionActualizacion): Promise<Inscripcion> => {
    const response = await api.put<InscripcionResponse>(`/inscripciones/${id}`, inscripcion);
    return response.data.data as Inscripcion;
  },

  // Cancelar inscripción
  cancelarInscripcion: async (id: number): Promise<void> => {
    await api.delete(`/inscripciones/${id}`);
  },

  // Obtener inscripciones por taller (solo admin)
  obtenerInscripcionesPorTaller: async (idTaller: number): Promise<Inscripcion[]> => {
    const response = await api.get<InscripcionResponse>(`/inscripciones/taller/${idTaller}`);
    return Array.isArray(response.data.data) ? response.data.data : [response.data.data];
  },

  // Obtener inscripciones por competencia (solo admin)
  obtenerInscripcionesPorCompetencia: async (idCompetencia: number): Promise<Inscripcion[]> => {
    const response = await api.get<InscripcionResponse>(`/inscripciones/competencia/${idCompetencia}`);
    return Array.isArray(response.data.data) ? response.data.data : [response.data.data];
  }
};