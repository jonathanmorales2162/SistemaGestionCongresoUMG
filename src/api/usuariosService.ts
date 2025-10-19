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
    } catch (error: unknown) {
      console.error('Error en petición de login:', error);
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : 'Error en el login';
      throw new Error(errorMessage || 'Error en el login');
    }
  },

  // Registro de usuario
  register: async (datosUsuario: UsuarioRegistro): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post('/usuarios', datosUsuario);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : 'Error en el registro';
      throw new Error(errorMessage || 'Error en el registro');
    }
  },

  // Validar token JWT usando el endpoint específico
  validateToken: async (): Promise<Usuario> => {
    try {
      const response = await axiosInstance.get('/usuarios/validate');
      return response.data.usuario || response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : 'Token inválido';
      throw new Error(errorMessage || 'Token inválido');
    }
  },

  // Obtener perfil del usuario
  getProfile: async (): Promise<Usuario> => {
    try {
      const response = await axiosInstance.get('/usuarios/perfil');
      return response.data.usuario;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : 'Error al obtener perfil';
      throw new Error(errorMessage || 'Error al obtener perfil');
    }
  },

  // Actualizar perfil del usuario
  updateProfile: async (datosActualizados: Partial<Usuario>): Promise<Usuario> => {
    try {
      // Según la documentación, el endpoint para actualizar perfil propio es PUT /usuarios/:id
      // Pero necesitamos obtener el ID del usuario actual primero
      const perfilActual = await usuariosService.getProfile();
      const response = await axiosInstance.put(`/usuarios/${perfilActual.id_usuario}`, datosActualizados);
      return response.data.data || response.data.usuario;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : 'Error al actualizar perfil';
      throw new Error(errorMessage || 'Error al actualizar perfil');
    }
  },

  // Funciones de administración de usuarios
  
  // Obtener todos los usuarios con paginación
  obtenerUsuarios: async (pagina: number = 1, limite: number = 10, busqueda?: string): Promise<{
    usuarios: Usuario[];
    total: number;
    pagina: number;
    totalPaginas: number;
  }> => {
    try {
      const params = new URLSearchParams({
        pagina: pagina.toString(),
        limite: limite.toString(),
        ...(busqueda && { busqueda })
      });
      
      const response = await axiosInstance.get(`/usuarios?${params}`);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : 'Error al obtener usuarios';
      throw new Error(errorMessage || 'Error al obtener usuarios');
    }
  },

  // Obtener usuario por ID
  obtenerUsuarioPorId: async (id: number): Promise<Usuario> => {
    try {
      const response = await axiosInstance.get(`/usuarios/${id}`);
      return response.data.usuario;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : 'Error al obtener usuario';
      throw new Error(errorMessage || 'Error al obtener usuario');
    }
  },

  // Crear nuevo usuario (admin)
  crearUsuario: async (datosUsuario: UsuarioRegistro): Promise<Usuario> => {
    try {
      const response = await axiosInstance.post('/usuarios/admin', datosUsuario);
      return response.data.usuario;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : 'Error al crear usuario';
      throw new Error(errorMessage || 'Error al crear usuario');
    }
  },

  // Actualizar usuario (admin)
  actualizarUsuario: async (id: number, datosActualizados: Partial<UsuarioRegistro>): Promise<Usuario> => {
    try {
      const response = await axiosInstance.put(`/usuarios/${id}`, datosActualizados);
      return response.data.usuario;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : 'Error al actualizar usuario';
      throw new Error(errorMessage || 'Error al actualizar usuario');
    }
  },

  // Eliminar usuario
  eliminarUsuario: async (id: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/usuarios/${id}`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : 'Error al eliminar usuario';
      throw new Error(errorMessage || 'Error al eliminar usuario');
    }
  },

  // Cambiar estado de usuario (activar/desactivar)
  cambiarEstadoUsuario: async (id: number, activo: boolean): Promise<Usuario> => {
    try {
      const response = await axiosInstance.put(`/usuarios/${id}/estado`, { activo });
      return response.data.usuario;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : 'Error al cambiar estado del usuario';
      throw new Error(errorMessage || 'Error al cambiar estado del usuario');
    }
  },

  // Obtener usuarios por rol (para ponentes destacados)
  obtenerUsuariosPorRol: async (nombreRol: string, limite: number = 10): Promise<Usuario[]> => {
    try {
      // Intentar obtener usuarios con información del rol expandida
      const response = await axiosInstance.get(`/usuarios?limit=${limite}&include=rol`);
      const usuarios = response.data.data || response.data.usuarios || [];
      
      // Filtrar usuarios por rol
      return usuarios.filter((usuario: any) => {
        // Verificar si el usuario tiene información del rol expandida
        if (usuario.rol && usuario.rol.nombre) {
          return usuario.rol.nombre.toLowerCase() === nombreRol.toLowerCase();
        }
        // Si no tiene el rol expandido, intentar por id_rol (esto requeriría conocer los IDs)
        // Por ahora, devolvemos todos los usuarios si no podemos filtrar
        return true;
      }).slice(0, limite);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : 'Error al obtener usuarios por rol';
      throw new Error(errorMessage || 'Error al obtener usuarios por rol');
    }
  }
};