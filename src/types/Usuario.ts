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
  creado_en: string; // En JSON llega como string ISO
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

