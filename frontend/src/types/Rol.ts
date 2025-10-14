export interface Rol {
  id: number;
  nombre: string;
  descripcion: string;
  permisos?: string[];
}

export type TipoRol = 'Admin' | 'Organizador' | 'Staff' | 'Participante';

export interface RolResponse {
  roles: Rol[];
  message: string;
}