import axiosInstance from './axiosConfig';
import type { UsuarioLogin, UsuarioRegistro, AuthResponse, Usuario } from '../types/Usuario';

export const usuariosService = {
  // Login de usuario
  login: async (credenciales: UsuarioLogin): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post('/usuarios/login', credenciales);
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
      
      // Verificar que la respuesta sea exitosa
      if (response.status < 200 || response.status >= 300) {
        throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Intentar diferentes estructuras de respuesta (en orden de prioridad)
      let usuario = null;
      
      // 1. Patrón estándar: { success: true, message: "...", data: Usuario }
      if (response.data && response.data.success === true && response.data.data) {
        usuario = response.data.data;
      }
      // 2. Patrón alternativo: { usuario: Usuario }
      else if (response.data && response.data.usuario) {
        usuario = response.data.usuario;
      }
      // 3. Patrón con perfil: { success: true, perfil: Usuario }
      else if (response.data && response.data.perfil) {
        usuario = response.data.perfil;
      }
      // 4. Patrón directo: Usuario (objeto directo)
      else if (response.data && response.data.id_usuario) {
        usuario = response.data;
      }
      // 4. Patrón con success pero sin data anidado: { success: true, ...Usuario }
      else if (response.data && response.data.success === true && response.data.id_usuario) {
        const { success, message, ...usuarioData } = response.data;
        usuario = usuarioData;
      }
      
      // Validar que tenemos un usuario válido
      if (!usuario || typeof usuario !== 'object' || !usuario.id_usuario) {
        console.error('❌ No se pudo extraer usuario válido de la respuesta:', response.data);
        throw new Error('Respuesta del servidor no contiene datos de usuario válidos');
      }
      
      return usuario;
      
    } catch (error: unknown) {
      console.error('❌ Error al obtener perfil:', error);
      
      // Si es un error de axios, extraer información adicional
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: any } };
        
        // Si es un error 401, el token puede haber expirado
        if (axiosError.response?.status === 401) {
          throw new Error('Token de autenticación inválido o expirado. Por favor, inicia sesión nuevamente.');
        }
        
        if (axiosError.response?.data?.message) {
          console.error('❌ Mensaje del servidor:', axiosError.response.data.message);
        }
      }
      
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : 'Error al obtener perfil';
      throw new Error(errorMessage || 'Error al obtener perfil');
    }
  },

  // Actualizar perfil del usuario
  updateProfile: async (datosActualizados: Partial<Usuario>): Promise<Usuario> => {
    try {
      // Obtener perfil actual
      const perfilActual = await usuariosService.getProfile();
      
      if (!perfilActual || !perfilActual.id_usuario) {
        throw new Error('No se pudo obtener el perfil actual del usuario');
      }
      
      // Enviar PUT al backend usando el endpoint correcto según documentación
      const endpoint = `/usuarios/perfil`;
      
      const response = await axiosInstance.put(endpoint, datosActualizados);
      
      // Verificar si la respuesta es exitosa
      if (response.status >= 200 && response.status < 300) {
        // Intentar extraer el usuario actualizado de diferentes estructuras (en orden de prioridad)
        let usuarioActualizado = null;
        
        // 1. Patrón estándar: { success: true, message: "...", data: Usuario }
        if (response.data && response.data.success === true && response.data.data) {
          usuarioActualizado = response.data.data;
        }
        // 2. Patrón alternativo: { usuario: Usuario }
        else if (response.data && response.data.usuario) {
          usuarioActualizado = response.data.usuario;
        }
        // 3. Patrón con perfil: { success: true, perfil: Usuario }
        else if (response.data && response.data.perfil) {
          usuarioActualizado = response.data.perfil;
        }
        // 4. Patrón directo: Usuario (objeto directo)
         else if (response.data && response.data.id_usuario) {
           usuarioActualizado = response.data;
         }
         // 5. Patrón con success pero sin data anidado: { success: true, ...Usuario }
         else if (response.data && response.data.success === true && response.data.id_usuario) {
           const { success, message, ...usuarioData } = response.data;
           usuarioActualizado = usuarioData;
         }
        
        // Si tenemos un usuario válido, retornarlo
        if (usuarioActualizado && typeof usuarioActualizado === 'object' && usuarioActualizado.id_usuario) {
          return usuarioActualizado;
        }
        
        // Si no pudimos extraer el usuario, registrar la estructura recibida
        console.error('⚠️ No se pudo extraer usuario de la respuesta:', response.data);
      }
      
      // Si llegamos aquí, no pudimos extraer el usuario de la respuesta
      const usuarioFallback = { ...perfilActual, ...datosActualizados };
      return usuarioFallback;
      
    } catch (error: unknown) {
      console.error('❌ Error al actualizar perfil:', error);
      
      // Si es un error de axios, extraer información adicional
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: any } };
        if (axiosError.response?.data?.message) {
          console.error('❌ Mensaje del servidor:', axiosError.response.data.message);
        }
      }
      
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
        page: pagina.toString(),
        limit: limite.toString(),
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