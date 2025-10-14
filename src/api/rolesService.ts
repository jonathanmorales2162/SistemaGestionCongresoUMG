import axiosInstance from './axiosConfig';
import { Rol, RolResponse } from '../types/Rol';

export const rolesService = {
  // Obtener todos los roles disponibles
  getRoles: async (): Promise<Rol[]> => {
    try {
      const response = await axiosInstance.get('/roles');
      return response.data.roles || response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener roles');
    }
  },

  // Obtener un rol específico por ID
  getRolById: async (id: number): Promise<Rol> => {
    try {
      const response = await axiosInstance.get(`/roles/${id}`);
      return response.data.rol || response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener rol');
    }
  }
};