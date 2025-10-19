import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Usuario, UsuarioLogin, UsuarioRegistro } from '../types/Usuario';
import { usuariosService } from '../api/usuariosService';
import { authUtils } from '../utils/helpers';

interface AuthContextType {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credenciales: UsuarioLogin) => Promise<void>;
  register: (datosUsuario: UsuarioRegistro) => Promise<void>;
  logout: () => void;
  updateUser: (usuarioActualizado: Usuario) => Promise<void>;
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
      const token = authUtils.getToken();
      const usuarioGuardado = authUtils.getUserData();

      if (token && usuarioGuardado) {
        try {
          // Verificar si el token está expirado antes de hacer la petición
          if (authUtils.isTokenExpired(token)) {
            clearAuthData();
            setIsLoading(false);
            return;
          }
          
          // Validar token con el backend usando el endpoint específico
          const usuarioValidado = await usuariosService.validateToken();
          
          // Si la validación es exitosa, actualizar el estado y localStorage
          setUsuario(usuarioValidado);
          authUtils.setUserData(usuarioValidado);
        } catch (error) {
          // Token inválido o expirado, limpiar todo
          clearAuthData();
        }
      } else {
        // No hay token o usuario guardado
        clearAuthData();
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Función para limpiar datos de autenticación
  const clearAuthData = () => {
    authUtils.removeToken();
    setUsuario(null);
  };

  const login = async (credenciales: UsuarioLogin): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await usuariosService.login(credenciales);
      
      // Verificar si la respuesta tiene la estructura esperada
      if (!response.token) {
        console.error('AuthContext: No se encontró token en la respuesta');
        throw new Error('Token no encontrado en la respuesta del servidor');
      }
      
      if (!response.usuario) {
        console.error('AuthContext: No se encontró usuario en la respuesta');
        throw new Error('Datos de usuario no encontrados en la respuesta del servidor');
      }
      
      // Guardar token y usuario usando las utilidades
      authUtils.setToken(response.token);
      authUtils.setUserData(response.usuario);
      
      // Actualizar el estado del usuario
      setUsuario(response.usuario);
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
      
      // Guardar token y usuario usando las utilidades
      authUtils.setToken(response.token);
      authUtils.setUserData(response.usuario);
      
      setUsuario(response.usuario);
    } catch (error: any) {
      throw new Error(error.message || 'Error en el registro');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    clearAuthData();
  };

  const updateUser = async (usuarioActualizado: Usuario) => {
    try {
      setUsuario(usuarioActualizado);
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
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