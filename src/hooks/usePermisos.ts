import { useAuth } from '../context/AuthContext';
import { verificarPermiso, obtenerPermisosRol, puedeAccederRuta } from '../utils/PermisosPorRoles';

export const usePermisos = () => {
  const { usuario } = useAuth();

  const tienePermiso = (modulo: string, accion: string): boolean => {
    if (!usuario?.id_rol) return false;
    return verificarPermiso(usuario.id_rol, modulo, accion);
  };

  const puedeVer = (modulo: string): boolean => {
    return tienePermiso(modulo, 'ver');
  };

  const puedeCrear = (modulo: string): boolean => {
    return tienePermiso(modulo, 'crear');
  };

  const puedeEditar = (modulo: string): boolean => {
    return tienePermiso(modulo, 'editar');
  };

  const puedeEliminar = (modulo: string): boolean => {
    return tienePermiso(modulo, 'eliminar');
  };

  const puedeAcceder = (ruta: string): boolean => {
    if (!usuario?.id_rol) return false;
    return puedeAccederRuta(usuario.id_rol, ruta);
  };

  const obtenerPermisos = () => {
    if (!usuario?.id_rol) return null;
    return obtenerPermisosRol(usuario.id_rol);
  };

  const esAdmin = (): boolean => {
    return usuario?.id_rol === 1;
  };

  const esOrganizador = (): boolean => {
    return usuario?.id_rol === 2;
  };

  const esStaff = (): boolean => {
    return usuario?.id_rol === 3;
  };

  const esParticipante = (): boolean => {
    return usuario?.id_rol === 4;
  };

  return {
    tienePermiso,
    puedeVer,
    puedeCrear,
    puedeEditar,
    puedeEliminar,
    puedeAcceder,
    obtenerPermisos,
    esAdmin,
    esOrganizador,
    esStaff,
    esParticipante,
    usuario
  };
};