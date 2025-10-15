import { AUTH_CONFIG, VALIDATION_CONFIG, DATE_CONFIG } from './constants';

// Utilidades de autenticación
export const authUtils = {
  // Obtener token del localStorage
  getToken: (): string | null => {
    return localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
  },

  // Guardar token en localStorage
  setToken: (token: string): void => {
    localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
  },

  // Eliminar token del localStorage
  removeToken: (): void => {
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    localStorage.removeItem(AUTH_CONFIG.USER_KEY);
  },

  // Verificar si el token está expirado
  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  },

  // Obtener datos del usuario del localStorage
  getUserData: () => {
    const userData = localStorage.getItem(AUTH_CONFIG.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  // Guardar datos del usuario en localStorage
  setUserData: (userData: any): void => {
    localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(userData));
  }
};

// Utilidades de validación
export const validationUtils = {
  // Validar email
  isValidEmail: (email: string): boolean => {
    return VALIDATION_CONFIG.EMAIL_PATTERN.test(email);
  },

  // Validar contraseña
  isValidPassword: (password: string): boolean => {
    return password.length >= VALIDATION_CONFIG.PASSWORD_MIN_LENGTH &&
           VALIDATION_CONFIG.PASSWORD_PATTERN.test(password);
  },

  // Obtener fuerza de contraseña
  getPasswordStrength: (password: string): 'weak' | 'fair' | 'good' | 'strong' => {
    if (password.length < 6) return 'weak';
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;
    
    if (score < 2) return 'weak';
    if (score < 3) return 'fair';
    if (score < 4) return 'good';
    return 'strong';
  },

  // Validar teléfono
  isValidPhone: (phone: string): boolean => {
    return VALIDATION_CONFIG.PHONE_PATTERN.test(phone);
  },

  // Validar nombre
  isValidName: (name: string): boolean => {
    return name.length >= VALIDATION_CONFIG.NAME_MIN_LENGTH &&
           name.length <= VALIDATION_CONFIG.NAME_MAX_LENGTH;
  }
};

// Utilidades de formato
export const formatUtils = {
  // Formatear fecha
  formatDate: (date: Date | string, format: string = DATE_CONFIG.DEFAULT_FORMAT): string => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');

    return format
      .replace('DD', day)
      .replace('MM', month)
      .replace('YYYY', year.toString())
      .replace('HH', hours)
      .replace('mm', minutes);
  },

  // Formatear nombre completo
  formatFullName: (firstName: string, lastName: string): string => {
    return `${firstName} ${lastName}`.trim();
  },

  // Formatear texto para URL (slug)
  formatSlug: (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .replace(/-+/g, '-') // Remover guiones múltiples
      .trim();
  },

  // Truncar texto
  truncateText: (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  },

  // Formatear tamaño de archivo
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
};

// Utilidades de URL
export const urlUtils = {
  // Construir URL con parámetros
  buildUrl: (baseUrl: string, params: Record<string, any>): string => {
    const url = new URL(baseUrl, window.location.origin);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.append(key, value.toString());
      }
    });
    return url.toString();
  },

  // Obtener parámetros de URL
  getUrlParams: (): URLSearchParams => {
    return new URLSearchParams(window.location.search);
  },

  // Obtener parámetro específico de URL
  getUrlParam: (param: string): string | null => {
    return urlUtils.getUrlParams().get(param);
  }
};

// Utilidades de almacenamiento
export const storageUtils = {
  // Guardar en localStorage con manejo de errores
  setItem: (key: string, value: any): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  // Obtener de localStorage con manejo de errores
  getItem: <T>(key: string, defaultValue: T | null = null): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  // Eliminar de localStorage
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Silenciar errores
    }
  },

  // Limpiar localStorage
  clear: (): void => {
    try {
      localStorage.clear();
    } catch {
      // Silenciar errores
    }
  }
};

// Utilidades de array
export const arrayUtils = {
  // Eliminar duplicados
  removeDuplicates: <T>(array: T[], key?: keyof T): T[] => {
    if (!key) {
      return [...new Set(array)];
    }
    
    const seen = new Set();
    return array.filter(item => {
      const value = item[key];
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
  },

  // Ordenar array por propiedad
  sortBy: <T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
    return [...array].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  },

  // Agrupar array por propiedad
  groupBy: <T>(array: T[], key: keyof T): Record<string, T[]> => {
    return array.reduce((groups, item) => {
      const value = String(item[key]);
      if (!groups[value]) {
        groups[value] = [];
      }
      groups[value].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  }
};

// Utilidades de debounce y throttle
export const performanceUtils = {
  // Debounce function
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: ReturnType<typeof setTimeout>;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  // Throttle function
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

// Utilidades de color
export const colorUtils = {
  // Generar color aleatorio
  getRandomColor: (): string => {
    const colors = [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
      '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  },

  // Obtener iniciales para avatar
  getInitials: (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
};

// Utilidades de error
export const errorUtils = {
  // Obtener mensaje de error amigable
  getErrorMessage: (error: any): string => {
    if (typeof error === 'string') return error;
    if (error?.response?.data?.message) return error.response.data.message;
    if (error?.message) return error.message;
    return 'Ha ocurrido un error inesperado';
  },

  // Log de errores en desarrollo
  logError: (error: any, context?: string): void => {
    if (import.meta.env.DEV) {
      console.error(`Error${context ? ` in ${context}` : ''}:`, error);
    }
  }
};

// Utilidades de clipboard
export const clipboardUtils = {
  // Copiar texto al clipboard
  copyToClipboard: async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback para navegadores que no soportan clipboard API
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
      } catch {
        return false;
      }
    }
  }
};