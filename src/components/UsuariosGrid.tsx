import React, { useState, useEffect } from 'react';
import { usuariosService } from '../api/usuariosService';
import { rolesService } from '../api/rolesService';
import type { Usuario } from '../types/Usuario';
import type { Rol } from '../types/Rol';

interface UsuariosGridProps {}

const UsuariosGrid: React.FC<UsuariosGridProps> = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Usuario | null>(null);

  const loadUsuarios = async (page: number = 1, search: string = '') => {
    try {
      setLoading(true);
      const response = await usuariosService.obtenerUsuarios(page, 10, search);
      

      
      // Verificar si la respuesta es un array directamente o tiene estructura de objeto
      if (Array.isArray(response)) {
        // Si la respuesta es un array directamente
        setUsuarios(response);
        setTotalPages(1);
        setTotal(response.length);
        setCurrentPage(page);
      } else if (response && response.usuarios && Array.isArray(response.usuarios)) {
        // Si la respuesta tiene la estructura esperada con objeto
        setUsuarios(response.usuarios);
        setTotalPages(response.totalPaginas || 1);
        setTotal(response.total || 0);
        setCurrentPage(page);
      } else {
        console.error('Respuesta inesperada del servidor:', response);
        setUsuarios([]);
        setTotalPages(1);
        setTotal(0);
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setUsuarios([]);
      setTotalPages(1);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
    loadUsuarios(1, searchTerm);
  }, [searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleEdit = (usuario: Usuario) => {
    setSelectedUser(usuario);
    setShowEditModal(true);
  };

  const handleDelete = (usuario: Usuario) => {
    setUserToDelete(usuario);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await usuariosService.eliminarUsuario(userToDelete.id_usuario);
        setShowDeleteModal(false);
        setUserToDelete(null);
        loadUsuarios(currentPage, searchTerm);
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
      }
    }
  };

  const loadRoles = async () => {
    try {
      const rolesData = await rolesService.getRoles();
      setRoles(rolesData);
    } catch (error) {
      console.error('Error al cargar roles:', error);
    }
  };

  const handlePageChange = (page: number) => {
    loadUsuarios(page, searchTerm);
  };

  const getRoleName = (usuario: Usuario): string => {
    // Primero intentar usar el objeto rol del usuario
    if (usuario.rol && usuario.rol.nombre) {
      return usuario.rol.nombre;
    }
    
    // Fallback: buscar en la lista de roles cargados
    if (usuario.id_rol) {
      const rol = roles.find(r => r.id_rol === usuario.id_rol);
      return rol ? rol.nombre : `Rol ${usuario.id_rol}`;
    }
    
    return 'Sin rol';
  };

  return (
    <div className="usuarios-grid">
      <div className="grid-header">
        <div className="header-title">
          <h2>👥 Gestión de Usuarios</h2>
          <p>Administra los usuarios del sistema</p>
        </div>
        <div className="header-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>
      </div>

      <div className="grid-stats">
        <span className="total-count">Total: {total} usuarios</span>
        <span className="page-info">Página {currentPage} de {totalPages}</span>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Cargando usuarios...</p>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th className="th-usuario">Usuario</th>
                  <th className="th-correo">Correo</th>
                  <th className="th-rol">Rol</th>
                  <th className="th-colegio">Colegio</th>
                  <th className="th-acciones">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id_usuario} className="table-row">
                    <td className="td-usuario">
                      <div className="user-cell">
                        <div className="user-avatar">
                          {usuario.foto_url ? (
                            <img src={usuario.foto_url} alt={usuario.nombre} />
                          ) : (
                            <span>{usuario.nombre?.charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                        <div className="user-info">
                          <span className="user-name">{usuario.nombre}</span>
                          <span className="user-id">ID: {usuario.id_usuario}</span>
                        </div>
                      </div>
                    </td>
                    <td className="td-correo">{usuario.correo}</td>
                    <td className="td-rol">
                      <span className={`role-badge role-${usuario.id_rol}`}>
                        {getRoleName(usuario)}
                      </span>
                    </td>
                    <td className="td-colegio">{usuario.colegio || 'Sin asignar'}</td>
                    <td className="td-acciones">
                      <div className="actions-cell">
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(usuario)}
                          title="Editar usuario"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(usuario)}
                          title="Eliminar usuario"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ← Anterior
              </button>
              
              <div className="pagination-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`pagination-number ${page === currentPage ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal delete-modal">
            <div className="modal-header">
              <h3>Confirmar Eliminación</h3>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro de que deseas eliminar al usuario <strong>{userToDelete?.nombre}</strong>?</p>
              <p className="warning-text">Esta acción no se puede deshacer.</p>
            </div>
            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserToDelete(null);
                }}
              >
                Cancelar
              </button>
              <button
                className="btn-confirm-delete"
                onClick={confirmDelete}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de edición - se implementará en el siguiente paso */}
      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onSave={() => {
            setShowEditModal(false);
            setSelectedUser(null);
            loadUsuarios(currentPage, searchTerm);
          }}
        />
      )}
    </div>
  );
};

// Componente completo para el modal de edición
const EditUserModal: React.FC<{
  user: Usuario;
  onClose: () => void;
  onSave: () => void;
}> = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: user.nombre || '',
    apellido: user.apellido || '',
    telefono: user.telefono || '',
    colegio: user.colegio || '',
    tipo: user.tipo || 'E',
    id_rol: user.id_rol || 3
  });
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEmailWarning, setShowEmailWarning] = useState(false);

  // Cargar roles al montar el componente
  useEffect(() => {
    const loadRoles = async () => {
      try {
        setLoadingRoles(true);
        const rolesData = await rolesService.getRoles();
        setRoles(rolesData);
      } catch (error) {
        console.error('Error al cargar roles:', error);
        setError('Error al cargar los roles disponibles');
      } finally {
        setLoadingRoles(false);
      }
    };

    loadRoles();
  }, []);

  // Función para validar correo institucional
  const isInstitutionalEmail = (email: string): boolean => {
    const institutionalDomains = [
      '@umg.edu.gt',
      '@universidad.edu.gt',
      '@edu.gt',
      '@umg.edu',
      '.edu.gt',
      '.edu'
    ];
    
    return institutionalDomains.some(domain => 
      email.toLowerCase().includes(domain.toLowerCase())
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'id_rol' ? parseInt(value) : value
    }));

    // Resetear advertencia si cambia el tipo
    if (name === 'tipo') {
      setShowEmailWarning(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validar correo institucional para usuarios Internos
    if (formData.tipo === 'I' && !isInstitutionalEmail(user.correo)) {
      setShowEmailWarning(true);
      return;
    }

    setLoading(true);

    try {
      await usuariosService.actualizarUsuario(user.id_usuario, formData);
      onSave();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al actualizar usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleForceSubmit = async () => {
    setLoading(true);
    setError(null);
    setShowEmailWarning(false);

    try {
      await usuariosService.actualizarUsuario(user.id_usuario, formData);
      onSave();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al actualizar usuario');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Editar Usuario</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-body">
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            {showEmailWarning && (
              <div className="warning-message">
                <span className="warning-icon">⚠️</span>
                <div>
                  <strong>Advertencia:</strong> El correo "{user.correo}" no parece ser institucional.
                  <br />
                  Los usuarios Internos deberían tener un correo institucional (ej: @umg.edu.gt).
                  <br />
                  ¿Desea continuar de todas formas?
                </div>
                <div className="warning-actions">
                  <button 
                    type="button" 
                    className="btn-cancel" 
                    onClick={() => setShowEmailWarning(false)}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="button" 
                    className="btn-warning" 
                    onClick={handleForceSubmit}
                    disabled={loading}
                  >
                    {loading ? 'Guardando...' : 'Continuar de todas formas'}
                  </button>
                </div>
              </div>
            )}

            <div className="user-info-readonly">
              <div className="readonly-field">
                <label>ID de Usuario:</label>
                <span className="readonly-value">{user.id_usuario}</span>
              </div>
              <div className="readonly-field">
                <label>Email:</label>
                <span className="readonly-value">{user.correo}</span>
              </div>
            </div>

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



              <div className="form-group">
                <label htmlFor="tipo">Tipo de Usuario *</label>
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
                  disabled={loadingRoles}
                >
                  {loadingRoles ? (
                    <option value="">Cargando roles...</option>
                  ) : (
                    roles.map((rol) => (
                      <option key={rol.id_rol} value={rol.id_rol}>
                        {rol.nombre}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={loading || showEmailWarning}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-save"
              disabled={loading || loadingRoles || showEmailWarning}
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsuariosGrid;