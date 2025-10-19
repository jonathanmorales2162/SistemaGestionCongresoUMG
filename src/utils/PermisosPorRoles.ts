// Definición de permisos por rol del sistema
export const PERMISOS_POR_ROLES = {
  // Administrador - Acceso completo
  1: {
    nombre: 'Administrador',
    permisos: {
      // Usuarios
      usuarios: {
        ver: true,
        crear: true,
        editar: true,
        eliminar: true,
        gestionar_roles: true
      },
      // Categorías
      categorias: {
        ver: true,
        crear: true,
        editar: true,
        eliminar: true
      },
      // Talleres
      talleres: {
        ver: true,
        crear: true,
        editar: true,
        eliminar: true,
        ver_participantes: true,
        gestionar_participantes: true
      },
      // Competencias
      competencias: {
        ver: true,
        crear: true,
        editar: true,
        eliminar: true,
        ver_participantes: true,
        gestionar_participantes: true
      },
      // Inscripciones
      inscripciones: {
        ver_todas: true,
        crear: true,
        editar: true,
        eliminar: true,
        ver_por_taller: true,
        ver_por_competencia: true
      },
      // Asistencia
      asistencia: {
        ver: true,
        registrar: true,
        editar: true,
        eliminar: true,
        ver_por_taller: true,
        ver_por_competencia: true,
        ver_por_usuario: true
      },
      // Diplomas
      diplomas: {
        ver_todos: true,
        generar: true,
        eliminar: true,
        ver_por_usuario: true
      },
      // Foros
      foros: {
        ver: true,
        crear: true,
        editar_todos: true,
        eliminar_todos: true,
        moderar: true,
        eliminar_mensajes: true
      },
      // Dashboard
      dashboard: {
        ver_estadisticas_completas: true,
        ver_reportes: true,
        exportar_datos: true
      }
    }
  },

  // Organizador - Gestión de eventos y contenido
  2: {
    nombre: 'Organizador',
    permisos: {
      usuarios: {
        ver: true,
        crear: false,
        editar: false,
        eliminar: false,
        gestionar_roles: false
      },
      categorias: {
        ver: true,
        crear: true,
        editar: true,
        eliminar: false
      },
      talleres: {
        ver: true,
        crear: true,
        editar: true,
        eliminar: false,
        ver_participantes: true,
        gestionar_participantes: true
      },
      competencias: {
        ver: true,
        crear: true,
        editar: true,
        eliminar: false,
        ver_participantes: true,
        gestionar_participantes: true
      },
      inscripciones: {
        ver_todas: true,
        crear: false,
        editar: true,
        eliminar: false,
        ver_por_taller: true,
        ver_por_competencia: true
      },
      asistencia: {
        ver: true,
        registrar: true,
        editar: true,
        eliminar: false,
        ver_por_taller: true,
        ver_por_competencia: true,
        ver_por_usuario: true
      },
      diplomas: {
        ver_todos: true,
        generar: true,
        eliminar: false,
        ver_por_usuario: true
      },
      foros: {
        ver: true,
        crear: true,
        editar_todos: false,
        eliminar_todos: false,
        moderar: true,
        eliminar_mensajes: true
      },
      dashboard: {
        ver_estadisticas_completas: true,
        ver_reportes: true,
        exportar_datos: false
      }
    }
  },

  // Staff - Soporte y asistencia
  3: {
    nombre: 'Staff',
    permisos: {
      usuarios: {
        ver: true,
        crear: false,
        editar: false,
        eliminar: false,
        gestionar_roles: false
      },
      categorias: {
        ver: true,
        crear: false,
        editar: false,
        eliminar: false
      },
      talleres: {
        ver: true,
        crear: false,
        editar: false,
        eliminar: false,
        ver_participantes: true,
        gestionar_participantes: false
      },
      competencias: {
        ver: true,
        crear: false,
        editar: false,
        eliminar: false,
        ver_participantes: true,
        gestionar_participantes: false
      },
      inscripciones: {
        ver_todas: true,
        crear: false,
        editar: false,
        eliminar: false,
        ver_por_taller: true,
        ver_por_competencia: true
      },
      asistencia: {
        ver: true,
        registrar: true,
        editar: false,
        eliminar: false,
        ver_por_taller: true,
        ver_por_competencia: true,
        ver_por_usuario: false
      },
      diplomas: {
        ver_todos: false,
        generar: false,
        eliminar: false,
        ver_por_usuario: false
      },
      foros: {
        ver: true,
        crear: false,
        editar_todos: false,
        eliminar_todos: false,
        moderar: true,
        eliminar_mensajes: false
      },
      dashboard: {
        ver_estadisticas_completas: false,
        ver_reportes: false,
        exportar_datos: false
      }
    }
  },

  // Participante - Acceso básico
  4: {
    nombre: 'Participante',
    permisos: {
      usuarios: {
        ver: false,
        crear: false,
        editar: false,
        eliminar: false,
        gestionar_roles: false
      },
      categorias: {
        ver: true,
        crear: false,
        editar: false,
        eliminar: false
      },
      talleres: {
        ver: true,
        crear: false,
        editar: false,
        eliminar: false,
        ver_participantes: false,
        gestionar_participantes: false
      },
      competencias: {
        ver: true,
        crear: false,
        editar: false,
        eliminar: false,
        ver_participantes: false,
        gestionar_participantes: false
      },
      inscripciones: {
        ver_todas: false,
        crear: true,
        editar: true,
        eliminar: true,
        ver_por_taller: false,
        ver_por_competencia: false
      },
      asistencia: {
        ver: false,
        registrar: false,
        editar: false,
        eliminar: false,
        ver_por_taller: false,
        ver_por_competencia: false,
        ver_por_usuario: false
      },
      diplomas: {
        ver_todos: false,
        generar: false,
        eliminar: false,
        ver_por_usuario: false
      },
      foros: {
        ver: true,
        crear: true,
        editar_todos: false,
        eliminar_todos: false,
        moderar: false,
        eliminar_mensajes: false
      },
      dashboard: {
        ver_estadisticas_completas: false,
        ver_reportes: false,
        exportar_datos: false
      }
    }
  }
};

// Función para verificar permisos
export const verificarPermiso = (
  idRol: number,
  modulo: string,
  accion: string
): boolean => {
  const rolPermisos = PERMISOS_POR_ROLES[idRol as keyof typeof PERMISOS_POR_ROLES];
  if (!rolPermisos) return false;

  const moduloPermisos = rolPermisos.permisos[modulo as keyof typeof rolPermisos.permisos];
  if (!moduloPermisos) return false;

  return moduloPermisos[accion as keyof typeof moduloPermisos] || false;
};

// Función para obtener todos los permisos de un rol
export const obtenerPermisosRol = (idRol: number) => {
  return PERMISOS_POR_ROLES[idRol as keyof typeof PERMISOS_POR_ROLES] || null;
};

// Función para verificar si un usuario puede acceder a una ruta
export const puedeAccederRuta = (idRol: number, ruta: string): boolean => {
  const rutasPublicas = ['/', '/login', '/register'];
  if (rutasPublicas.includes(ruta)) return true;

  // Rutas específicas por rol
  const rutasPorRol = {
    1: ['/dashboard', '/admin', '/usuarios', '/categorias', '/talleres', '/competencias', '/inscripciones', '/asistencia', '/diplomas', '/foros'], // Admin
    2: ['/dashboard', '/categorias', '/talleres', '/competencias', '/inscripciones', '/asistencia', '/diplomas', '/foros'], // Organizador
    3: ['/dashboard', '/asistencia', '/foros'], // Staff
    4: ['/dashboard', '/inscripciones', '/foros', '/mis-diplomas'] // Participante
  };

  const rutasPermitidas = rutasPorRol[idRol as keyof typeof rutasPorRol] || [];
  return rutasPermitidas.some(rutaPermitida => ruta.startsWith(rutaPermitida));
};

export default PERMISOS_POR_ROLES;