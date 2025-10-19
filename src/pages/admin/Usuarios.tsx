import React, { useState, useEffect } from 'react';
import { usuariosService } from '../../api/usuariosService';
import { rolesService } from '../../api/rolesService';
import type { Usuario, UsuarioRegistro } from '../../types/Usuario';
import type { Rol } from '../../types/Rol';
import '../../styles/components.css';

interface UsuarioFormData extends Omit<UsuarioRegistro, 'id_rol'> {
  id_rol: number | '';
}

const Usuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [total, setTotal] = useState(0);
  const limite = 10;
  
  // Búsqueda
  const [busqueda, setBusqueda] = useState('');
  
  // Modal y formulario
  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState<UsuarioFormData>({
    nombre: '',
    apellido: '',
    correo: '',
    password: '',
    telefono: '',
    colegio: '',
    tipo: 'E',
    id_rol: ''
  });

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, [paginaActual, busqueda]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [usuariosData, rolesData] = await Promise.all([
        usuariosService.obtenerUsuarios(paginaActual, limite, busqueda || undefined),
        rolesService.getRoles()
      ]);
      
      setUsuarios(usuariosData.usuarios);
      setTotal(usuariosData.total);
      setTotalPaginas(usuariosData.totalPaginas);
      setRoles(rolesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const limpiarMensajes = () => {
    setError(null);
    setSuccess(null);
  };

  const abrirModal = (usuario?: Usuario) => {
    limpiarMensajes();
    if (usuario) {
      setUsuarioEditando(usuario);
      setFormData({
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        password: '',
        telefono: usuario.telefono || '',
        colegio: usuario.colegio || '',
        tipo: usuario.tipo,
        id_rol: usuario.id_rol
      });
    } else {
      setUsuarioEditando(null);
      setFormData({
        nombre: '',
        apellido: '',
        correo: '',
        password: '',
        telefono: '',
        colegio: '',
        tipo: 'E',
        id_rol: ''
      });
    }
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setUsuarioEditando(null);
    limpiarMensajes();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'id_rol' ? (value === '' ? '' : parseInt(value)) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.id_rol === '') {
      setError('Debe seleccionar un rol');
      return;
    }

    try {
      setLoading(true);
      limpiarMensajes();

      if (usuarioEditando) {
        // Para edición, crear objeto sin password si está vacío
        const datosActualizacion = formData.password 
          ? {
              ...formData,
              id_rol: formData.id_rol as number
            }
          : {
              nombre: formData.nombre,
              apellido: formData.apellido,
              correo: formData.correo,
              telefono: formData.telefono,
              colegio: formData.colegio,
              tipo: formData.tipo,
              id_rol: formData.id_rol as number
            };
        
        await usuariosService.actualizarUsuario(usuarioEditando.id_usuario, datosActualizacion);
        setSuccess('Usuario actualizado exitosamente');
      } else {
        const datosUsuario: UsuarioRegistro = {
          ...formData,
          id_rol: formData.id_rol as number
        };
        await usuariosService.crearUsuario(datosUsuario);
        setSuccess('Usuario creado exitosamente');
      }

      cerrarModal();
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Está seguro de que desea eliminar este usuario?')) {
      return;
    }

    try {
      setLoading(true);
      limpiarMensajes();
      await usuariosService.eliminarUsuario(id);
      setSuccess('Usuario eliminado exitosamente');
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleBusqueda = (e: React.FormEvent) => {
    e.preventDefault();
    setPaginaActual(1);
    cargarDatos();
  };

  const getRolNombre = (idRol: number): string => {
    const rol = roles.find(r => r.id_rol === idRol);
    return rol ? rol.nombre : 'Desconocido';
  };

  const getTipoTexto = (tipo: string): string => {
    return tipo === 'I' ? 'Interno' : 'Externo';
  };

  if (loading && usuarios.length === 0) {
    return (
      <div className="admin-main">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-main">
      <div className="page-header">
        <h1>Gestión de Usuarios</h1>
        <p>Administra los usuarios del sistema</p>
      </div>

      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <span className="alert-icon">✅</span>
          {success}
        </div>
      )}

      <div className="content-card">
        <div className="card-header">
          <div className="header-actions">
            <form onSubmit={handleBusqueda} className="search-form">
              <input
                type="text"
                placeholder="Buscar usuarios..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="btn btn-secondary">
                🔍 Buscar
              </button>
            </form>
            
            <button 
              onClick={() => abrirModal()}
              className="btn btn-primary"
            >
              ➕ Nuevo Usuario
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Tipo</th>
                <th>Rol</th>
                <th>Colegio</th>
                <th>Fecha Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id_usuario}>
                  <td>{usuario.id_usuario}</td>
                  <td>{usuario.nombre} {usuario.apellido}</td>
                  <td>{usuario.correo}</td>
                  <td>{usuario.telefono || 'N/A'}</td>
                  <td>
                    <span className={`badge badge-${usuario.tipo === 'I' ? 'primary' : 'secondary'}`}>
                      {getTipoTexto(usuario.tipo)}
                    </span>
                  </td>
                  <td>{getRolNombre(usuario.id_rol)}</td>
                  <td>{usuario.colegio || 'N/A'}</td>
                  <td>{new Date(usuario.creado_en).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => abrirModal(usuario)}
                        className="btn btn-sm btn-secondary"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleEliminar(usuario.id_usuario)}
                        className="btn btn-sm btn-danger"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {usuarios.length === 0 && !loading && (
            <div className="empty-state">
              <p>No se encontraron usuarios</p>
            </div>
          )}
        </div>

        {totalPaginas > 1 && (
          <div className="pagination">
            <button
              onClick={() => setPaginaActual(prev => Math.max(1, prev - 1))}
              disabled={paginaActual === 1}
              className="btn btn-secondary"
            >
              ← Anterior
            </button>
            
            <span className="pagination-info">
              Página {paginaActual} de {totalPaginas} ({total} usuarios)
            </span>
            
            <button
              onClick={() => setPaginaActual(prev => Math.min(totalPaginas, prev + 1))}
              disabled={paginaActual === totalPaginas}
              className="btn btn-secondary"
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>

      {/* Modal para crear/editar usuario */}
      {mostrarModal && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{usuarioEditando ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
              <button onClick={cerrarModal} className="modal-close">×</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre *</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="apellido">Apellido *</label>
                  <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="correo">Correo Electrónico *</label>
                  <input
                    type="email"
                    id="correo"
                    name="correo"
                    value={formData.correo}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">
                    {usuarioEditando ? 'Nueva Contraseña (opcional)' : 'Contraseña *'}
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!usuarioEditando}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="telefono">Teléfono</label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="tipo">Tipo *</label>
                  <select
                    id="tipo"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    required
                    className="form-select"
                  >
                    <option value="E">Externo</option>
                    <option value="I">Interno</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="id_rol">Rol *</label>
                  <select
                    id="id_rol"
                    name="id_rol"
                    value={formData.id_rol}
                    onChange={handleInputChange}
                    required
                    className="form-select"
                  >
                    <option value="">Seleccionar rol</option>
                    {roles.map((rol) => (
                      <option key={rol.id_rol} value={rol.id_rol}>
                        {rol.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="colegio">Colegio</label>
                  <input
                    type="text"
                    id="colegio"
                    name="colegio"
                    value={formData.colegio}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={cerrarModal} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Guardando...' : usuarioEditando ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;