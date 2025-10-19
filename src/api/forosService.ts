import api from './axiosConfig';
import type { Foro, ForoCreacion, ForoActualizacion, ForoResponse, MensajeForo, MensajeCreacion, MensajeResponse } from '../types/Foro';

export const forosService = {
  // Obtener todos los foros
  obtenerForos: async (page?: number, limit?: number): Promise<{ foros: Foro[]; pagination?: { currentPage: number; totalPages: number; totalItems: number; itemsPerPage: number } }> => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    const response = await api.get<ForoResponse>(`/foros?${params.toString()}`);
    return {
      foros: Array.isArray(response.data.data) ? response.data.data : [response.data.data],
      pagination: response.data.pagination
    };
  },

  // Obtener foro por ID
  obtenerForoPorId: async (id: number): Promise<Foro> => {
    const response = await api.get<ForoResponse>(`/foros/${id}`);
    return response.data.data as Foro;
  },

  // Crear nuevo foro
  crearForo: async (foro: ForoCreacion): Promise<Foro> => {
    const response = await api.post<ForoResponse>('/foros', foro);
    return response.data.data as Foro;
  },

  // Actualizar foro (solo creador o admin)
  actualizarForo: async (id: number, foro: ForoActualizacion): Promise<Foro> => {
    const response = await api.put<ForoResponse>(`/foros/${id}`, foro);
    return response.data.data as Foro;
  },

  // Eliminar foro (solo creador o admin)
  eliminarForo: async (id: number): Promise<void> => {
    await api.delete(`/foros/${id}`);
  },

  // Obtener mensajes de un foro
  obtenerMensajes: async (idForo: number, page?: number, limit?: number): Promise<{ mensajes: MensajeForo[]; pagination?: { currentPage: number; totalPages: number; totalItems: number; itemsPerPage: number } }> => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    const response = await api.get<MensajeResponse>(`/foros/${idForo}/mensajes?${params.toString()}`);
    return {
      mensajes: Array.isArray(response.data.data) ? response.data.data : [response.data.data],
      pagination: response.data.pagination
    };
  },

  // Crear mensaje en foro
  crearMensaje: async (idForo: number, mensaje: MensajeCreacion): Promise<MensajeForo> => {
    const response = await api.post<MensajeResponse>(`/foros/${idForo}/mensajes`, mensaje);
    return response.data.data as MensajeForo;
  },

  // Eliminar mensaje (solo autor o admin)
  eliminarMensaje: async (idForo: number, idMensaje: number): Promise<void> => {
    await api.delete(`/foros/${idForo}/mensajes/${idMensaje}`);
  }
};