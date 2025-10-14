// Constantes de la aplicación
export const APP_CONFIG = {
  NAME: 'Sistema de Gestión de Congreso UMG',
  VERSION: '1.0.0',
  DESCRIPTION: 'Sistema integral para la gestión de congresos académicos',
  AUTHOR: 'Universidad Mariano Gálvez',
  CONTACT_EMAIL: 'congreso@umg.edu.gt',
  CONTACT_PHONE: '+502 4286-1280'
};

// URLs de la API
export const API_ENDPOINTS = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VALIDATE_TOKEN: '/auth/validate',
    REFRESH_TOKEN: '/auth/refresh'
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    LIST: '/users'
  },
  ROLES: {
    LIST: '/roles',
    BY_ID: '/roles'
  },
  CONFERENCES: {
    LIST: '/conferences',
    BY_ID: '/conferences',
    CREATE: '/conferences',
    UPDATE: '/conferences',
    DELETE: '/conferences'
  },
  FORUMS: {
    LIST: '/forums',
    BY_ID: '/forums',
    CREATE: '/forums',
    UPDATE: '/forums',
    DELETE: '/forums'
  }
};

// Configuración de autenticación
export const AUTH_CONFIG = {
  TOKEN_KEY: 'auth_token',
  USER_KEY: 'user_data',
  TOKEN_EXPIRY_BUFFER: 5 * 60 * 1000, // 5 minutos en milisegundos
  AUTO_LOGOUT_TIME: 24 * 60 * 60 * 1000 // 24 horas en milisegundos
};

// Roles del sistema
export const USER_ROLES = {
  ADMIN: 'admin',
  ORGANIZADOR: 'organizador',
  PONENTE: 'ponente',
  PARTICIPANTE: 'participante',
  MODERADOR: 'moderador'
} as const;

// Tipos de roles
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Estados de conferencias
export const CONFERENCE_STATUS = {
  DRAFT: 'borrador',
  PUBLISHED: 'publicada',
  IN_PROGRESS: 'en_progreso',
  COMPLETED: 'completada',
  CANCELLED: 'cancelada'
} as const;

// Estados de foros
export const FORUM_STATUS = {
  ACTIVE: 'activo',
  CLOSED: 'cerrado',
  ARCHIVED: 'archivado'
} as const;

// Categorías de foros
export const FORUM_CATEGORIES = {
  GENERAL: 'general',
  TECHNICAL: 'tecnico',
  ACADEMIC: 'academico',
  NETWORKING: 'networking',
  QA: 'preguntas_respuestas'
} as const;

// Configuración de paginación
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100]
};

// Configuración de archivos
export const FILE_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ALLOWED_PRESENTATION_TYPES: ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']
};

// Configuración de notificaciones
export const NOTIFICATION_CONFIG = {
  AUTO_DISMISS_TIME: 5000, // 5 segundos
  MAX_NOTIFICATIONS: 5,
  TYPES: {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
  }
};

// Configuración de tema
export const THEME_CONFIG = {
  DEFAULT_THEME: 'dark',
  STORAGE_KEY: 'app_theme',
  THEMES: {
    LIGHT: 'light',
    DARK: 'dark',
    AUTO: 'auto'
  }
};

// Configuración de idioma
export const LANGUAGE_CONFIG = {
  DEFAULT_LANGUAGE: 'es',
  STORAGE_KEY: 'app_language',
  SUPPORTED_LANGUAGES: {
    ES: 'es',
    EN: 'en'
  }
};

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu conexión a internet.',
  UNAUTHORIZED: 'No tienes permisos para realizar esta acción.',
  FORBIDDEN: 'Acceso denegado.',
  NOT_FOUND: 'El recurso solicitado no fue encontrado.',
  SERVER_ERROR: 'Error interno del servidor. Intenta nuevamente más tarde.',
  VALIDATION_ERROR: 'Los datos proporcionados no son válidos.',
  TOKEN_EXPIRED: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
  UNKNOWN_ERROR: 'Ha ocurrido un error inesperado.'
};

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: '¡Bienvenido! Has iniciado sesión correctamente.',
  LOGOUT_SUCCESS: 'Has cerrado sesión correctamente.',
  REGISTER_SUCCESS: '¡Registro exitoso! Bienvenido al sistema.',
  PROFILE_UPDATED: 'Tu perfil ha sido actualizado correctamente.',
  DATA_SAVED: 'Los datos han sido guardados correctamente.',
  DATA_DELETED: 'Los datos han sido eliminados correctamente.'
};

// Configuración de validación
export const VALIDATION_CONFIG = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_PATTERN: /^[+]?[\d\s\-()]+$/,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50
};

// Configuración de fecha y hora
export const DATE_CONFIG = {
  DEFAULT_FORMAT: 'DD/MM/YYYY',
  DATETIME_FORMAT: 'DD/MM/YYYY HH:mm',
  TIME_FORMAT: 'HH:mm',
  LOCALE: 'es-GT'
};

// URLs externas
export const EXTERNAL_URLS = {
  UMG_WEBSITE: 'https://www.umg.edu.gt',
  SUPPORT_EMAIL: 'soporte@umg.edu.gt',
  PRIVACY_POLICY: '/privacy-policy',
  TERMS_OF_SERVICE: '/terms-of-service',
  HELP_CENTER: '/help'
};

// Configuración de desarrollo
export const DEV_CONFIG = {
  ENABLE_LOGGING: import.meta.env.DEV,
  ENABLE_DEBUG: import.meta.env.DEV,
  API_DELAY: import.meta.env.DEV ? 500 : 0 // Simular delay en desarrollo
};