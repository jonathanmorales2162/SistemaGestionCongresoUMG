export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  telefono?: string;
  institucion?: string;
  fechaRegistro: string;
  activo: boolean;
}

export interface UsuarioLogin {
  email: string;
  password: string;
}

export interface UsuarioRegistro {
  nombre: string;
  email: string;
  password: string;
  telefono?: string;
  institucion?: string;
  rol?: string;
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
  message: string;
}