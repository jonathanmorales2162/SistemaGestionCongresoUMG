import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Usuario, UsuarioLogin, UsuarioRegistro } from '../types/Usuario';
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
      const response = await usuariosService.login(credenciales);
      
      // Guardar token y usuario en localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('usuario', JSON.stringify(response.usuario));
      
      setUsuario(response.usuario);
    } catch (error: any) {
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
      localStorage.setItem('usuario', JSON.stringify(response.usuario));
      
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