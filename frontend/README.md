# Sistema de Gestión de Congreso UMG - Frontend

Sistema integral para la gestión de congresos académicos de la Universidad Mariano Gálvez, desarrollado con React, TypeScript y Vite.

## 🚀 Características

- **Autenticación completa**: Login, registro y gestión de sesiones con JWT
- **Gestión de roles**: Sistema de permisos para diferentes tipos de usuarios
- **Interfaz moderna**: Diseño responsivo con tema oscuro y azulado
- **Navegación intuitiva**: Navbar y sidebar adaptativos
- **Rutas protegidas**: Control de acceso basado en autenticación y roles
- **TypeScript**: Tipado estático para mayor robustez del código
- **Componentes reutilizables**: Arquitectura modular y escalable

## 🛠️ Tecnologías

- **React 19** - Biblioteca de interfaz de usuario
- **TypeScript** - Superset de JavaScript con tipado estático
- **Vite** - Herramienta de construcción rápida
- **React Router DOM** - Enrutamiento del lado del cliente
- **Axios** - Cliente HTTP para comunicación con la API
- **CSS3** - Estilos con variables CSS y diseño responsivo

## 📁 Estructura del Proyecto

```
src/
├── api/                    # Configuración y servicios de API
│   ├── axiosConfig.ts     # Configuración de Axios con interceptores
│   ├── usuariosService.ts # Servicios de usuarios
│   └── rolesService.ts    # Servicios de roles
├── components/            # Componentes reutilizables
│   ├── Auth/             # Componentes de autenticación
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── Navbar.tsx        # Barra de navegación
│   ├── Sidebar.tsx       # Barra lateral
│   └── ProtectedRoute.tsx # Componente de rutas protegidas
├── context/              # Contextos de React
│   └── AuthContext.tsx   # Contexto de autenticación
├── pages/                # Páginas principales
│   ├── LandingPage.tsx   # Página de inicio
│   ├── Dashboard.tsx     # Panel de control
│   ├── ForoConferencias.tsx # Foro de conferencias
│   └── NotFound.tsx      # Página 404
├── routes/               # Configuración de rutas
│   └── AppRouter.tsx     # Enrutador principal
├── styles/               # Estilos CSS
│   ├── components.css    # Estilos de componentes
│   ├── pages.css         # Estilos de páginas
│   └── auth.css          # Estilos de autenticación
├── types/                # Definiciones de tipos TypeScript
│   ├── Usuario.ts        # Tipos de usuario
│   └── Rol.ts            # Tipos de rol
├── utils/                # Utilidades y helpers
│   ├── constants.ts      # Constantes de la aplicación
│   └── helpers.ts        # Funciones de utilidad
├── App.tsx               # Componente principal
├── main.tsx              # Punto de entrada
└── index.css             # Estilos globales
```

## 🔧 Instalación y Configuración

### Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Git

### Instalación

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno**
   ```bash
   # Crear archivo .env
   VITE_API_URL=http://localhost:4000/api
   ```

3. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

4. **Construir para producción**
   ```bash
   npm run build
   ```

## 📜 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la construcción de producción
- `npm run lint` - Ejecuta el linter de código

## 🎨 Diseño y Tema

El sistema utiliza una paleta de colores oscuros y azulados que proporciona:

- **Experiencia visual moderna**: Tema oscuro que reduce la fatiga visual
- **Colores principales**: Azules (#1E293B, #0F172A) para fondos
- **Acentos**: Azul brillante (#0EA5E9) para elementos interactivos
- **Estados**: Verde para éxito, rojo para errores, amarillo para advertencias

## 🔐 Sistema de Autenticación

### Características de Seguridad

- **JWT Tokens**: Autenticación basada en tokens seguros
- **Interceptores HTTP**: Manejo automático de tokens en requests
- **Persistencia de sesión**: Almacenamiento seguro en localStorage
- **Validación de tokens**: Verificación automática de expiración

### Roles de Usuario

- **Admin**: Acceso completo al sistema
- **Organizador**: Gestión de eventos y conferencias
- **Ponente**: Gestión de presentaciones
- **Participante**: Acceso a contenido y foros
- **Moderador**: Moderación de foros y discusiones

## 🚦 Rutas del Sistema

### Rutas Públicas
- `/` - Página de inicio (LandingPage)
- `/login` - Formulario de inicio de sesión
- `/register` - Formulario de registro

### Rutas Protegidas
- `/dashboard` - Panel de control (requiere autenticación)
- `/foro` - Foro de conferencias (requiere autenticación)

## 🔌 Integración con Backend

El frontend está diseñado para integrarse con una API REST que debe proporcionar:

### Endpoints de Autenticación
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/register` - Registro de usuario
- `GET /api/auth/validate` - Validación de token

### Endpoints de Usuarios
- `GET /api/users/profile` - Obtener perfil de usuario
- `PUT /api/users/profile` - Actualizar perfil

### Endpoints de Roles
- `GET /api/roles` - Listar roles disponibles
- `GET /api/roles/:id` - Obtener rol específico

## 👥 Equipo de Desarrollo

- **Universidad Mariano Gálvez** - Desarrollo y mantenimiento
- **Contacto**: congreso@umg.edu.gt
- **Soporte**: soporte@umg.edu.gt

---

**Desarrollado con ❤️ por la Universidad Mariano Gálvez**
