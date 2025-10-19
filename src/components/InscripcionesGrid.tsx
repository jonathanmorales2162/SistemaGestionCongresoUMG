import React, { useState, useEffect } from 'react';
import { inscripcionesService } from '../api/inscripcionesService';
import { talleresService } from '../api/talleresService';
import { competenciasService } from '../api/competenciasService';
import { usuariosService } from '../api/usuariosService';
import type { Inscripcion, InscripcionCreacion } from '../types/Inscripcion';
import type { Taller } from '../types/Taller';
import type { Competencia } from '../types/Competencia';
import type { Usuario } from '../types/Usuario';
import { useAuth } from '../context/AuthContext';

interface InscripcionesGridProps {}

const InscripcionesGrid: React.FC<InscripcionesGridProps> = () => {
  const { usuario } = useAuth();
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [talleres, setTalleres] = useState<Taller[]>([]);
  const [competencias, setCompetencias] = useState<Competencia[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedInscripcion, setSelectedInscripcion] = useState<Inscripcion | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [inscripcionToDelete, setInscripcionToDelete] = useState<Inscripcion | null>(null);
  const [filterTipo, setFilterTipo] = useState('');

  const loadInscripciones = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await inscripcionesService.obtenerInscripciones(page, 10);
      
      if (response && response.inscripciones) {
        setInscripciones(response.inscripciones);
        setTotalPages(response.pagination?.totalPages || 1);
        setCurrentPage(page);
      } else {
        setInscripciones([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error al cargar inscripciones:', error);
      setInscripciones([]);
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
    loadInscripciones();
    loadTalleres();
    loadCompetencias();
    loadUsuarios();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredInscripciones = (inscripciones || []).filter(inscripcion => {
    const matchesSearch = 
      inscripcion.usuario?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inscripcion.usuario?.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inscripcion.usuario?.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inscripcion.taller?.titulo || inscripcion.competencia?.titulo || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const tipoEvento = inscripcion.taller ? 'taller' : 'competencia';
    const matchesTipo = !filterTipo || tipoEvento === filterTipo;
    
    return matchesSearch && matchesTipo;
  });

  const handleEdit = (inscripcion: Inscripcion) => {
    setSelectedInscripcion(inscripcion);
    setShowEditModal(true);
  };

  const handleCreate = () => {
    setShowCreateModal(true);
  };

  const handleView = (inscripcion: Inscripcion) => {
    setSelectedInscripcion(inscripcion);
    setShowViewModal(true);
  };

  const handleDelete = (inscripcion: Inscripcion) => {
    setInscripcionToDelete(inscripcion);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (inscripcionToDelete) {
      try {
        await inscripcionesService.cancelarInscripcion(inscripcionToDelete.id_inscripcion);
        setShowDeleteModal(false);
        setInscripcionToDelete(null);
        loadInscripciones(currentPage);
      } catch (error) {
        console.error('Error al cancelar inscripción:', error);
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadInscripciones(page);
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
  const canCreate = usuario?.id_rol === 1 || usuario?.id_rol === 2; // Admin y Organizador
  const canEdit = usuario?.id_rol === 1 || usuario?.id_rol === 2; // Admin y Organizador
  const canDelete = usuario?.id_rol === 1 || usuario?.id_rol === 2; // Admin y Organizador
  const canView = true; // Todos pueden ver

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando inscripciones...</p>
      </div>
    );
  }

  return (
    <div className="grid-container">
      <div className="grid-header">
        <div className="header-content">
          <h2 className="grid-title">Gestión de Inscripciones</h2>
          <p className="grid-subtitle">Administra las inscripciones a talleres y competencias</p>
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
          </div>
          
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar inscripciones..."
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
              + Nueva Inscripción
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
                <th>Fecha Inscripción</th>
                <th>Observaciones</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredInscripciones.map((inscripcion) => (
                <tr key={inscripcion.id_inscripcion}>
                  <td>
                    <div className="cell-content">
                      <strong>
                        {inscripcion.usuario ? 
                          `${inscripcion.usuario.nombre} ${inscripcion.usuario.apellido}` : 
                          'Usuario no encontrado'
                        }
                      </strong>
                      <p className="cell-subtitle">{inscripcion.usuario?.correo}</p>
                    </div>
                  </td>
                  <td>
                    <div className="cell-content">
                      <strong>
                        {inscripcion.taller?.titulo || inscripcion.competencia?.titulo || 'Evento no encontrado'}
                      </strong>
                      <p className="cell-subtitle">
                        {inscripcion.taller?.titulo || inscripcion.competencia?.titulo || 'Sin evento'}
                      </p>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${inscripcion.tipo_evento === 2 ? 'warning' : inscripcion.tipo_evento === 3 ? 'success' : 'info'}`}>
                      {inscripcion.tipo_evento === 1 ? 'Taller' : inscripcion.tipo_evento === 2 ? 'Competencia' : 'Foro'}
                    </span>
                  </td>
                  <td>{formatDate(inscripcion.fecha_inscripcion)}</td>
                  <td>
                    <div className="cell-content">
                      {inscripcion.observaciones ? (
                        <span title={inscripcion.observaciones}>
                          {inscripcion.observaciones.length > 30 ? 
                            `${inscripcion.observaciones.substring(0, 30)}...` : 
                            inscripcion.observaciones
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
                          onClick={() => handleView(inscripcion)}
                          className="btn-view"
                          title="Ver detalles"
                        >
                          👁️
                        </button>
                      )}
                      {canEdit && (
                        <button
                          onClick={() => handleEdit(inscripcion)}
                          className="btn-edit"
                          title="Editar"
                        >
                          ✏️
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => handleDelete(inscripcion)}
                          className="btn-delete"
                          title="Cancelar"
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
        <CreateInscripcionModal
          talleres={talleres}
          competencias={competencias}
          usuarios={usuarios}
          onClose={() => setShowCreateModal(false)}
          onSave={() => {
            setShowCreateModal(false);
            loadInscripciones(currentPage);
          }}
        />
      )}

      {/* Modal de Edición */}
      {showEditModal && selectedInscripcion && (
        <EditInscripcionModal
          inscripcion={selectedInscripcion}
          onClose={() => {
            setShowEditModal(false);
            setSelectedInscripcion(null);
          }}
          onSave={() => {
            setShowEditModal(false);
            setSelectedInscripcion(null);
            loadInscripciones(currentPage);
          }}
        />
      )}

      {/* Modal de Visualización */}
      {showViewModal && selectedInscripcion && (
        <ViewInscripcionModal
          inscripcion={selectedInscripcion}
          onClose={() => {
            setShowViewModal(false);
            setSelectedInscripcion(null);
          }}
        />
      )}

      {/* Modal de Confirmación de Cancelación */}
      {showDeleteModal && inscripcionToDelete && (
        <div className="modal-overlay">
          <div className="modal delete-modal">
            <div className="modal-header">
              <h3>Confirmar Cancelación</h3>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro de que deseas cancelar la inscripción de "{inscripcionToDelete.usuario?.nombre} {inscripcionToDelete.usuario?.apellido}"?</p>
              <p className="warning-text">Esta acción no se puede deshacer.</p>
            </div>
            <div className="modal-footer">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setInscripcionToDelete(null);
                }}
                className="btn-cancel"
              >
                Cerrar
              </button>
              <button
                onClick={confirmDelete}
                className="btn-delete"
              >
                Cancelar Inscripción
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Modal de Creación de Inscripción
const CreateInscripcionModal: React.FC<{
  talleres: Taller[];
  competencias: Competencia[];
  usuarios: Usuario[];
  onClose: () => void;
  onSave: () => void;
}> = ({ talleres, competencias, usuarios, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<InscripcionCreacion>({
    id_usuario: 0,
    tipo_evento: 1,
    id_evento: 0,
    observaciones: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'id_usuario' || name === 'id_evento' ? parseInt(value) || 0 : value
    }));
  };

  const handleTipoEventoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      tipo_evento: parseInt(e.target.value) as 1 | 2 | 3,
      id_evento: 0 // Reset evento cuando cambia el tipo
    }));
  };

  const getEventosDisponibles = () => {
    return formData.tipo_evento === 1 ? talleres : competencias;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await inscripcionesService.crearInscripcion(formData);
      onSave();
    } catch (error) {
      console.error('Error al crear inscripción:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal create-modal">
        <div className="modal-header">
          <h3>Crear Nueva Inscripción</h3>
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
                value={formData.tipo_evento}
                onChange={handleTipoEventoChange}
                className="form-select"
                required
              >
                <option value={1}>Taller</option>
                <option value={2}>Competencia</option>
                <option value={3}>Foro</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Evento *</label>
              <select
                name="id_evento"
                value={formData.id_evento}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="">Seleccionar evento</option>
                {getEventosDisponibles().map(evento => (
                  <option key={'id_taller' in evento ? evento.id_taller : evento.id_competencia} value={'id_taller' in evento ? evento.id_taller : evento.id_competencia}>
                    {evento.titulo}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group full-width">
              <label className="form-label">Observaciones</label>
              <textarea
                name="observaciones"
                value={formData.observaciones}
                onChange={handleInputChange}
                className="form-textarea"
                rows={3}
                placeholder="Observaciones adicionales sobre la inscripción..."
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
              {loading ? 'Guardando...' : 'Crear Inscripción'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal de Edición de Inscripción
const EditInscripcionModal: React.FC<{
  inscripcion: Inscripcion;
  onClose: () => void;
  onSave: () => void;
}> = ({ inscripcion, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    observaciones: inscripcion.observaciones || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await inscripcionesService.actualizarInscripcion(inscripcion.id_inscripcion, formData);
      onSave();
    } catch (error) {
      console.error('Error al actualizar inscripción:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal edit-modal">
        <div className="modal-header">
          <h3>Editar Inscripción</h3>
          <button onClick={onClose} className="modal-close">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Usuario</label>
              <input
                type="text"
                value={`${inscripcion.usuario?.nombre} ${inscripcion.usuario?.apellido}`}
                className="form-input"
                disabled
              />
            </div>

            <div className="form-group">
              <label className="form-label">Evento</label>
              <input
                type="text"
                value={inscripcion.taller?.titulo || inscripcion.competencia?.titulo || 'Evento no encontrado'}
                className="form-input"
                disabled
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Observaciones</label>
              <textarea
                name="observaciones"
                value={formData.observaciones}
                onChange={handleInputChange}
                className="form-textarea"
                rows={3}
                placeholder="Observaciones adicionales sobre la inscripción..."
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

// Modal de Visualización de Inscripción
const ViewInscripcionModal: React.FC<{
  inscripcion: Inscripcion;
  onClose: () => void;
}> = ({ inscripcion, onClose }) => {
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
          <h3>Detalles de la Inscripción</h3>
          <button onClick={onClose} className="modal-close">×</button>
        </div>
        
        <div className="modal-body">
          <div className="inscripcion-details">
            <div className="detail-section">
              <h4>Información del Participante</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Nombre:</label>
                  <span>{inscripcion.usuario?.nombre} {inscripcion.usuario?.apellido}</span>
                </div>
                <div className="detail-item">
                  <label>Email:</label>
                  <span>{inscripcion.usuario?.correo}</span>
                </div>
                <div className="detail-item">
                  <label>Teléfono:</label>
                  <span>{inscripcion.usuario?.telefono || 'No especificado'}</span>
                </div>
                <div className="detail-item">
                  <label>Institución:</label>
                  <span>{inscripcion.usuario?.institucion || 'No especificada'}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4>Información del Evento</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Tipo:</label>
                  <span className={`status-badge ${inscripcion.tipo_evento === 2 ? 'warning' : inscripcion.tipo_evento === 3 ? 'success' : 'info'}`}>
                    {inscripcion.tipo_evento === 1 ? 'Taller' : inscripcion.tipo_evento === 2 ? 'Competencia' : 'Foro'}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Título:</label>
                  <span>{inscripcion.taller?.titulo || inscripcion.competencia?.titulo}</span>
                </div>
                <div className="detail-item">
                  <label>Categoría:</label>
                  <span>{inscripcion.taller?.titulo || inscripcion.competencia?.titulo}</span>
                </div>
                <div className="detail-item">
                  <label>Cupo:</label>
                  <span>{inscripcion.taller?.cupo || inscripcion.competencia?.cupo}</span>
                </div>
                <div className="detail-item full-width">
                  <label>Descripción:</label>
                  <p>{inscripcion.taller?.descripcion || inscripcion.competencia?.descripcion}</p>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4>Información de la Inscripción</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Fecha de Inscripción:</label>
                  <span>{formatDate(inscripcion.fecha_inscripcion)}</span>
                </div>
                {inscripcion.observaciones && (
                  <div className="detail-item full-width">
                    <label>Observaciones:</label>
                    <p>{inscripcion.observaciones}</p>
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

export default InscripcionesGrid;