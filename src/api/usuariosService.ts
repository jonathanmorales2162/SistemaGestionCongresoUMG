import axiosInstance from './axiosConfig';
import type { UsuarioLogin, UsuarioRegistro, AuthResponse, Usuario } from '../types/Usuario';

export const usuariosService = {
  // Login de usuario
  login: async (credenciales: UsuarioLogin): Promise<AuthResponse> => {
    try {
      console.log('Enviando petición de login a:', '/usuarios/login');
      const response = await axiosInstance.post('/usuarios/login', credenciales);
      console.log('Respuesta del backend:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error en petición de login:', error);
      throw new Error(error.response?.data?.message || 'Error en el login');
    }
  },

  // Registro de usuario
  register: async (datosUsuario: UsuarioRegistro): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post('/usuarios/register', datosUsuario);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error en el registro');
    }
  },

  // Validar token JWT
  validateToken: async (): Promise<Usuario> => {
    try {
      const response = await axiosInstance.get('/usuarios/validate');
      return response.data.usuario;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Token inválido');
    }
  },

  // Obtener perfil del usuario
  getProfile: async (): Promise<Usuario> => {
    try {
      const response = await axiosInstance.get('/usuarios/profile');
      return response.data.usuario;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener perfil');
    }
  },

  // Actualizar perfil del usuario
  updateProfile: async (datosActualizados: Partial<Usuario>): Promise<Usuario> => {
    try {
      const response = await axiosInstance.put('/usuarios/profile', datosActualizados);
      return response.data.usuario;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al actualizar perfil');
    }
  }
};