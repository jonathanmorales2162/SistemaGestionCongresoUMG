import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Usuario, UsuarioLogin, UsuarioRegistro } from '../types/Usuario';
import { usuariosService } from '../api/usuariosService';

interface AuthContextType {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credenciales: UsuarioLogin) => Promise<void>;
  register: (datosUsuario: UsuarioRegistro) => Promise<void>;
  logout: () => void;
  updateUser: (datosActualizados: Partial<Usuario>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!usuario;

  // Verificar token al cargar la aplicación
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const usuarioGuardado = localStorage.getItem('usuario');

      if (token && usuarioGuardado) {
        try {
          // Validar token con el backend
          const usuarioValidado = await usuariosService.validateToken();
          setUsuario(usuarioValidado);
          // Actualizar datos en localStorage
          localStorage.setItem('usuario', JSON.stringify(usuarioValidado));
        } catch (error) {
          // Token inválido, limpiar localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
          setUsuario(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credenciales: UsuarioLogin): Promise<void> => {
    try {
      setIsLoading(true);
      console.log('AuthContext: Enviando credenciales al servicio');
      const response = await usuariosService.login(credenciales);
      console.log('AuthContext: Respuesta recibida:', response);
      console.log('AuthContext: Tipo de respuesta:', typeof response);
      console.log('AuthContext: Claves de la respuesta:', Object.keys(response));
      console.log('AuthContext: response.token:', response.token);
      console.log('AuthContext: response.usuario:', response.usuario);
      console.log('AuthContext: Tipo de response.usuario:', typeof response.usuario);
      
      // Verificar si la respuesta tiene la estructura esperada
      if (!response.token) {
        console.error('AuthContext: No se encontró token en la respuesta');
        throw new Error('Token no encontrado en la respuesta del servidor');
      }
      
      if (!response.usuario) {
        console.error('AuthContext: No se encontró usuario en la respuesta');
        throw new Error('Datos de usuario no encontrados en la respuesta del servidor');
      }
      
      // Guardar token y usuario en localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('usuario', JSON.stringify(response.usuario));
      
      // Actualizar el estado del usuario
      setUsuario(response.usuario);
      console.log('AuthContext: Usuario establecido:', response.usuario);
      
      // Asegurar que el estado se actualice antes de continuar
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('AuthContext: Login completado, estado actualizado');
          resolve();
        }, 100);
      });
    } catch (error: any) {
      console.error('AuthContext: Error en login:', error);
      throw new Error(error.message || 'Error en el login');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (datosUsuario: UsuarioRegistro): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await usuariosService.register(datosUsuario);
      
      // Guardar token y usuario en localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('usuario', JSON.stringify(response.usuario.nombre));
      
      setUsuario(response.usuario);
    } catch (error: any) {
      throw new Error(error.message || 'Error en el registro');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    
    // Limpiar estado
    setUsuario(null);
  };

  const updateUser = async (datosActualizados: Partial<Usuario>): Promise<void> => {
    try {
      const usuarioActualizado = await usuariosService.updateProfile(datosActualizados);
      
      // Actualizar estado y localStorage
      setUsuario(usuarioActualizado);
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
    } catch (error: any) {
      throw new Error(error.message || 'Error al actualizar usuario');
    }
  };

  const value: AuthContextType = {
    usuario,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};