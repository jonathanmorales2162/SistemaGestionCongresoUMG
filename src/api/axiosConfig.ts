import axios from 'axios';

// Configuración base de Axios
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token JWT automáticamente
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
      // Token inválido o expirado - limpiar localStorage y redirigir al login
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      
      // Evitar redirección infinita si ya estamos en login
      if (window.location.pathname !== '/login') {
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