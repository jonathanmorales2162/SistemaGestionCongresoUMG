import axiosInstance from './axiosConfig';
import type { Rol } from '../types/Rol';

export const rolesService = {
  // Obtener todos los roles disponibles
  getRoles: async (): Promise<Rol[]> => {
    try {
      const response = await axiosInstance.get('/roles');
      return response.data.roles || response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : 'Error al obtener roles';
      throw new Error(errorMessage || 'Error al obtener roles');
    }
  },

  // Obtener un rol específico por ID
  getRolById: async (id: number): Promise<Rol> => {
    try {
      const response = await axiosInstance.get(`/roles/${id}`);
      return response.data.rol || response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : 'Error al obtener rol';
      throw new Error(errorMessage || 'Error al obtener rol');
    }
  }
};