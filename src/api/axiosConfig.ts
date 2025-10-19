import axios from 'axios';
import { authUtils } from '../utils/helpers';

// Configuración base de Axios
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token JWT automáticamente
axiosInstance.interceptors.request.use(
  (config) => {
    const token = authUtils.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Error en interceptor de request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores globalmente
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejo global de errores
    if (error.response?.status === 401) {
      // Token inválido o expirado - limpiar localStorage
      console.log('Token inválido detectado, limpiando datos de autenticación');
      authUtils.removeToken();
      
      // Solo redirigir si no estamos en rutas de autenticación
      const currentPath = window.location.pathname;
      const authPaths = ['/login', '/register', '/'];
      
      if (!authPaths.includes(currentPath)) {
        console.log('Redirigiendo al login debido a token inválido');
        window.location.href = '/login';
      }
    } else if (error.response?.status === 403) {
      console.error('Acceso denegado:', error.response.data);
    } else if (error.response?.status === 404) {
      console.error('Recurso no encontrado:', error.response.data);
    } else if (error.response?.status >= 500) {
      console.error('Error del servidor:', error.response.data);
    } else if (error.code === 'NETWORK_ERROR') {
      console.error('Error de red - Verificar conexión');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;