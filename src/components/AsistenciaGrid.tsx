import React, { useState, useEffect } from 'react';
import { asistenciaService } from '../api/asistenciaService';
import { talleresService } from '../api/talleresService';
import { competenciasService } from '../api/competenciasService';
import { usuariosService } from '../api/usuariosService';
import type { Asistencia, AsistenciaCreacion } from '../types/Asistencia';
import type { Taller } from '../types/Taller';
import type { Competencia } from '../types/Competencia';
import type { Usuario } from '../types/Usuario';
import { useAuth } from '../context/AuthContext';

interface AsistenciaGridProps {}

const AsistenciaGrid: React.FC<AsistenciaGridProps> = () => {
  const { usuario } = useAuth();
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [talleres, setTalleres] = useState<Taller[]>([]);
  const [competencias, setCompetencias] = useState<Competencia[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAsistencia, setSelectedAsistencia] = useState<Asistencia | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [asistenciaToDelete, setAsistenciaToDelete] = useState<Asistencia | null>(null);
  const [filterTipo, setFilterTipo] = useState('');
  const [filterAsistio, setFilterAsistio] = useState('');

  const loadAsistencias = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await asistenciaService.obtenerAsistencias(page, 10);
      
      if (response && response.asistencias) {
        setAsistencias(response.asistencias);
        setTotalPages(response.pagination?.totalPages || 1);
        setCurrentPage(page);
      } else {
        setAsistencias([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error al cargar asistencias:', error);
      setAsistencias([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const loadTalleres = async () => {
    try {
      const response = await talleresService.obtenerTalleres(1, 100);
      setTalleres(response.talleres || []);
    } catch (error) {
      console.error('Error al cargar talleres:', error);
      setTalleres([]);
    }
  };

  const loadCompetencias = async () => {
    try {
      const response = await competenciasService.obtenerCompetencias(1, 100);
      setCompetencias(response.competencias || []);
    } catch (error) {
      console.error('Error al cargar competencias:', error);
      setCompetencias([]);
    }
  };

  const loadUsuarios = async () => {
    try {
      const response = await usuariosService.obtenerUsuarios(1, 1000);
      setUsuarios(response.usuarios || []);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setUsuarios([]);
    }
  };

  useEffect(() => {
    loadAsistencias();
    loadTalleres();
    loadCompetencias();
    loadUsuarios();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredAsistencias = asistencias.filter(asistencia => {
    const matchesSearch = 
      asistencia.usuario?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asistencia.usuario?.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (asistencia.usuario?.correo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (asistencia.taller?.titulo || asistencia.competencia?.titulo || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const tipoEvento = asistencia.taller ? 'taller' : 'competencia';
    const matchesTipo = !filterTipo || tipoEvento === filterTipo;
    const matchesAsistio = !filterAsistio ||
      (filterAsistio === 'true' && asistencia.presente) ||
      (filterAsistio === 'false' && !asistencia.presente);
    
    return matchesSearch && matchesTipo && matchesAsistio;
  });

  const handleEdit = (asistencia: Asistencia) => {
    setSelectedAsistencia(asistencia);
    setShowEditModal(true);
  };

  const handleCreate = () => {
    setShowCreateModal(true);
  };

  const handleView = (asistencia: Asistencia) => {
    setSelectedAsistencia(asistencia);
    setShowViewModal(true);
  };

  const handleDelete = (asistencia: Asistencia) => {
    setAsistenciaToDelete(asistencia);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (asistenciaToDelete) {
      try {
        await asistenciaService.eliminarAsistencia(asistenciaToDelete.id_asistencia);
        setShowDeleteModal(false);
        setAsistenciaToDelete(null);
        loadAsistencias(currentPage);
      } catch (error) {
        console.error('Error al eliminar asistencia:', error);
      }
    }
  };

  const handleToggleAsistencia = async (asistencia: Asistencia) => {
    try {
      await asistenciaService.actualizarAsistencia(asistencia.id_asistencia, {
        presente: !asistencia.presente,
        observaciones: asistencia.observaciones
      });
      loadAsistencias(currentPage);
    } catch (error) {
      console.error('Error al actualizar asistencia:', error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadAsistencias(page);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Verificar permisos basados en el rol
  const canCreate = usuario?.id_rol === 1 || usuario?.id_rol === 2 || usuario?.id_rol === 3; // Admin, Organizador y Staff
  const canEdit = usuario?.id_rol === 1 || usuario?.id_rol === 2 || usuario?.id_rol === 3; // Admin, Organizador y Staff
  const canDelete = usuario?.id_rol === 1 || usuario?.id_rol === 2; // Admin y Organizador
  const canView = true; // Todos pueden ver
  const canToggleAsistencia = usuario?.id_rol === 1 || usuario?.id_rol === 2 || usuario?.id_rol === 3; // Admin, Organizador y Staff

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando asistencias...</p>
      </div>
    );
  }

  return (
    <div className="grid-container">
      <div className="grid-header">
        <div className="header-content">
          <h2 className="grid-title">Gestión de Asistencia</h2>
          <p className="grid-subtitle">Registra y administra la asistencia a talleres y competencias</p>
        </div>
        
        <div className="header-actions">
          <div className="filters-container">
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="filter-select"
            >
              <option value="">Todos los tipos</option>
              <option value="taller">Talleres</option>
              <option value="competencia">Competencias</option>
            </select>
            
            <select
              value={filterAsistio}
              onChange={(e) => setFilterAsistio(e.target.value)}
              className="filter-select"
            >
              <option value="">Todos</option>
              <option value="true">Asistió</option>
              <option value="false">No asistió</option>
            </select>
          </div>
          
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar asistencias..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
          
          {canCreate && (
            <button
              onClick={handleCreate}
              className="btn-primary"
            >
              + Registrar Asistencia
            </button>
          )}
        </div>
      </div>

      <div className="grid-content">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Participante</th>
                <th>Evento</th>
                <th>Tipo</th>
                <th>Asistió</th>
                <th>Fecha Registro</th>
                <th>Observaciones</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredAsistencias.map((asistencia) => (
                <tr key={asistencia.id_asistencia}>
                  <td>
                    <div className="cell-content">
                      <strong>
                        {asistencia.usuario ? 
                          `${asistencia.usuario.nombre} ${asistencia.usuario.apellido}` : 
                          'Usuario no encontrado'
                        }
                      </strong>
                      <p className="cell-subtitle">{asistencia.usuario?.correo}</p>
                    </div>
                  </td>
                  <td>
                    <div className="cell-content">
                      <strong>
                        {asistencia.taller?.titulo || asistencia.competencia?.titulo || 'Evento no encontrado'}
                      </strong>
                      <p className="cell-subtitle">
                        {asistencia.taller?.titulo || asistencia.competencia?.titulo || 'Sin evento'}
                      </p>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${asistencia.id_competencia ? 'warning' : 'info'}`}>
                      {asistencia.id_taller ? 'Taller' : 'Competencia'}
                    </span>
                  </td>
                  <td>
                    <div className="asistencia-toggle">
                      <span className={`status-badge ${asistencia.presente ? 'success' : 'danger'}`}>
                        {asistencia.presente ? '✓ Sí' : '✗ No'}
                      </span>
                      {canToggleAsistencia && (
                        <button
                          onClick={() => handleToggleAsistencia(asistencia)}
                          className={`btn-toggle ${asistencia.presente ? 'btn-danger' : 'btn-success'}`}
                          title={asistencia.presente ? 'Marcar como no asistió' : 'Marcar como asistió'}
                        >
                          {asistencia.presente ? '✗' : '✓'}
                        </button>
                      )}
                    </div>
                  </td>
                  <td>{formatDate(asistencia.fecha_asistencia)}</td>
                  <td>
                    <div className="cell-content">
                      {asistencia.observaciones ? (
                        <span title={asistencia.observaciones}>
                          {asistencia.observaciones.length > 30 ? 
                            `${asistencia.observaciones.substring(0, 30)}...` : 
                            asistencia.observaciones
                          }
                        </span>
                      ) : (
                        <span className="text-muted">Sin observaciones</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {canView && (
                        <button
                          onClick={() => handleView(asistencia)}
                          className="btn-view"
                          title="Ver detalles"
                        >
                          👁️
                        </button>
                      )}
                      {canEdit && (
                        <button
                          onClick={() => handleEdit(asistencia)}
                          className="btn-edit"
                          title="Editar"
                        >
                          ✏️
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => handleDelete(asistencia)}
                          className="btn-delete"
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              Anterior
            </button>
            
            <span className="pagination-info">
              Página {currentPage} de {totalPages}
            </span>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {/* Modal de Creación */}
      {showCreateModal && (
        <CreateAsistenciaModal
          talleres={talleres}
          competencias={competencias}
          usuarios={usuarios}
          onClose={() => setShowCreateModal(false)}
          onSave={() => {
            setShowCreateModal(false);
            loadAsistencias(currentPage);
          }}
        />
      )}

      {/* Modal de Edición */}
      {showEditModal && selectedAsistencia && (
        <EditAsistenciaModal
          asistencia={selectedAsistencia}
          onClose={() => {
            setShowEditModal(false);
            setSelectedAsistencia(null);
          }}
          onSave={() => {
            setShowEditModal(false);
            setSelectedAsistencia(null);
            loadAsistencias(currentPage);
          }}
        />
      )}

      {/* Modal de Visualización */}
      {showViewModal && selectedAsistencia && (
        <ViewAsistenciaModal
          asistencia={selectedAsistencia}
          onClose={() => {
            setShowViewModal(false);
            setSelectedAsistencia(null);
          }}
        />
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && asistenciaToDelete && (
        <div className="modal-overlay">
          <div className="modal delete-modal">
            <div className="modal-header">
              <h3>Confirmar Eliminación</h3>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro de que deseas eliminar el registro de asistencia de "{asistenciaToDelete.usuario?.nombre} {asistenciaToDelete.usuario?.apellido}"?</p>
              <p className="warning-text">Esta acción no se puede deshacer.</p>
            </div>
            <div className="modal-footer">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setAsistenciaToDelete(null);
                }}
                className="btn-cancel"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="btn-delete"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Modal de Creación de Asistencia
const CreateAsistenciaModal: React.FC<{
  talleres: Taller[];
  competencias: Competencia[];
  usuarios: Usuario[];
  onClose: () => void;
  onSave: () => void;
}> = ({ talleres, competencias, usuarios, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AsistenciaCreacion>({
    id_usuario: 0,
    id_taller: undefined,
    id_competencia: undefined,
    presente: true,
    observaciones: ''
  });
  const [tipoEvento, setTipoEvento] = useState<'taller' | 'competencia'>('taller');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              name === 'id_usuario' || name === 'id_taller' || name === 'id_competencia' ? parseInt(value) || 0 : 
              value
    }));
  };

  const handleTipoEventoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tipo = e.target.value as 'taller' | 'competencia';
    setTipoEvento(tipo);
    setFormData(prev => ({
      ...prev,
      id_taller: tipo === 'taller' ? undefined : undefined,
      id_competencia: tipo === 'competencia' ? undefined : undefined
    }));
  };

  const getEventosDisponibles = () => {
    return tipoEvento === 'taller' ? talleres : competencias;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await asistenciaService.registrarAsistencia(formData);
      onSave();
    } catch (error) {
      console.error('Error al crear asistencia:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal create-modal">
        <div className="modal-header">
          <h3>Registrar Nueva Asistencia</h3>
          <button onClick={onClose} className="modal-close">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Usuario *</label>
              <select
                name="id_usuario"
                value={formData.id_usuario}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="">Seleccionar usuario</option>
                {usuarios.map(usuario => (
                  <option key={usuario.id_usuario} value={usuario.id_usuario}>
                    {usuario.nombre} {usuario.apellido} - {usuario.correo}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Tipo de Evento *</label>
              <select
                name="tipo_evento"
                value={tipoEvento}
                onChange={handleTipoEventoChange}
                className="form-select"
                required
              >
                <option value="taller">Taller</option>
                <option value="competencia">Competencia</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Evento *</label>
              <select
                name={tipoEvento === 'taller' ? 'id_taller' : 'id_competencia'}
                value={tipoEvento === 'taller' ? formData.id_taller || '' : formData.id_competencia || ''}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="">Seleccionar evento</option>
                {getEventosDisponibles().map(evento => (
                  <option 
                    key={tipoEvento === 'taller' ? (evento as Taller).id_taller : (evento as Competencia).id_competencia} 
                    value={tipoEvento === 'taller' ? (evento as Taller).id_taller : (evento as Competencia).id_competencia}
                  >
                    {evento.titulo}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-checkbox">
                <input
                  type="checkbox"
                  name="presente"
                  checked={formData.presente}
                  onChange={handleInputChange}
                />
                <span className="checkmark"></span>
                Asistió al evento
              </label>
            </div>

            <div className="form-group full-width">
              <label className="form-label">Observaciones</label>
              <textarea
                name="observaciones"
                value={formData.observaciones}
                onChange={handleInputChange}
                className="form-textarea"
                rows={3}
                placeholder="Observaciones adicionales sobre la asistencia..."
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn-cancel"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-save"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Registrar Asistencia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal de Edición de Asistencia
const EditAsistenciaModal: React.FC<{
  asistencia: Asistencia;
  onClose: () => void;
  onSave: () => void;
}> = ({ asistencia, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    presente: asistencia.presente,
    observaciones: asistencia.observaciones || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await asistenciaService.actualizarAsistencia(asistencia.id_asistencia, formData);
      onSave();
    } catch (error) {
      console.error('Error al actualizar asistencia:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal edit-modal">
        <div className="modal-header">
          <h3>Editar Asistencia</h3>
          <button onClick={onClose} className="modal-close">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Usuario</label>
              <input
                type="text"
                value={`${asistencia.usuario?.nombre} ${asistencia.usuario?.apellido}`}
                className="form-input"
                disabled
              />
            </div>

            <div className="form-group">
              <label className="form-label">Evento</label>
              <input
                type="text"
                value={asistencia.taller?.titulo || asistencia.competencia?.titulo || 'Evento no encontrado'}
                className="form-input"
                disabled
              />
            </div>

            <div className="form-group">
              <label className="form-checkbox">
                <input
                  type="checkbox"
                  name="presente"
                  checked={formData.presente}
                  onChange={handleInputChange}
                />
                <span className="checkmark"></span>
                Asistió al evento
              </label>
            </div>

            <div className="form-group full-width">
              <label className="form-label">Observaciones</label>
              <textarea
                name="observaciones"
                value={formData.observaciones}
                onChange={handleInputChange}
                className="form-textarea"
                rows={3}
                placeholder="Observaciones adicionales sobre la asistencia..."
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn-cancel"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-save"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal de Visualización de Asistencia
const ViewAsistenciaModal: React.FC<{
  asistencia: Asistencia;
  onClose: () => void;
}> = ({ asistencia, onClose }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal view-modal">
        <div className="modal-header">
          <h3>Detalles de Asistencia</h3>
          <button onClick={onClose} className="modal-close">×</button>
        </div>
        
        <div className="modal-body">
          <div className="asistencia-details">
            <div className="detail-section">
              <h4>Información del Participante</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Nombre:</label>
                  <span>{asistencia.usuario?.nombre} {asistencia.usuario?.apellido}</span>
                </div>
                <div className="detail-item">
                  <label>Email:</label>
                  <span>{asistencia.usuario?.correo}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4>Información del Evento</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Tipo:</label>
                  <span className={`status-badge ${asistencia.id_competencia ? 'warning' : 'info'}`}>
                    {asistencia.id_taller ? 'Taller' : 'Competencia'}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Título:</label>
                  <span>{asistencia.taller?.titulo || asistencia.competencia?.titulo}</span>
                </div>
                <div className="detail-item">
                  <label>Categoría:</label>
                  <span>{asistencia.taller?.titulo || asistencia.competencia?.titulo}</span>
                </div>
                <div className="detail-item">
                  <label>Cupo:</label>
                  <span>{asistencia.taller?.cupo || asistencia.competencia?.cupo}</span>
                </div>
                <div className="detail-item full-width">
                  <label>Descripción:</label>
                  <p>{asistencia.taller?.descripcion || asistencia.competencia?.descripcion}</p>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4>Información de Asistencia</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Asistió:</label>
                  <span className={`status-badge ${asistencia.presente ? 'success' : 'danger'}`}>
                    {asistencia.presente ? '✓ Sí' : '✗ No'}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Fecha de Registro:</label>
                  <span>{formatDate(asistencia.fecha_asistencia)}</span>
                </div>
                {asistencia.observaciones && (
                  <div className="detail-item full-width">
                    <label>Observaciones:</label>
                    <p>{asistencia.observaciones}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              onClick={onClose}
              className="btn-primary"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsistenciaGrid;