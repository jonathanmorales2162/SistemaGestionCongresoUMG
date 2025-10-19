import type { Rol } from './Rol';

export interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string;
  colegio?: string;
  tipo: 'I' | 'E'; // I = Interno, E = Externo
  password_hash?: string; // El backend lo usa, pero el frontend no lo recibe
  id_rol: number;
  rol?: Rol; // Información del rol expandida (opcional, depende del endpoint)
  creado_en: string; // En JSON llega como string ISO
  // Campos adicionales que pueden venir del backend
  email?: string; // Alias para correo
  foto_perfil?: string;
  foto_url?: string; // Nuevo campo según EndpointsDocu (URL de foto de perfil)
  especialidad?: string;
  biografia?: string;
  institucion?: string;
}

export interface UsuarioLogin {
  correo: string;
  password: string;
}

export interface UsuarioRegistro {
  nombre: string;
  apellido: string;
  correo: string;
  password: string;
  telefono?: string;
  colegio?: string;
  tipo: 'I' | 'E'; // I = Interno, E = Externo
  id_rol: number;
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
  message: string;
}

