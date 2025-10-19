import React, { useState, useEffect } from 'react';
import { diplomasService } from '../api/diplomasService';
import { talleresService } from '../api/talleresService';
import { competenciasService } from '../api/competenciasService';
import { usuariosService } from '../api/usuariosService';
import type { Diploma, DiplomaGeneracion } from '../types/Diploma';
import type { Taller } from '../types/Taller';
import type { Competencia } from '../types/Competencia';
import type { Usuario } from '../types/Usuario';
import { useAuth } from '../context/AuthContext';

interface DiplomasGridProps {}

const DiplomasGrid: React.FC<DiplomasGridProps> = () => {
  const { usuario } = useAuth();
  const [diplomas, setDiplomas] = useState<Diploma[]>([]);
  const [talleres, setTalleres] = useState<Taller[]>([]);
  const [competencias, setCompetencias] = useState<Competencia[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDiploma, setSelectedDiploma] = useState<Diploma | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [diplomaToDelete, setDiplomaToDelete] = useState<Diploma | null>(null);
  const [filterEstado, setFilterEstado] = useState('');

  const loadDiplomas = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await diplomasService.obtenerDiplomas(page, 10);
      
      if (response && response.diplomas) {
        setDiplomas(response.diplomas);
        setTotalPages(response.pagination?.totalPages || 1);
        setCurrentPage(page);
      } else {
        setDiplomas([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error al cargar diplomas:', error);
      setDiplomas([]);
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
    loadDiplomas();
    loadTalleres();
    loadCompetencias();
    loadUsuarios();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredDiplomas = diplomas.filter(diploma => {
    const matchesSearch = 
      diploma.usuario?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diploma.usuario?.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diploma.usuario?.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (diploma.taller?.titulo || diploma.competencia?.titulo || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEstado = !filterEstado || 
      (filterEstado === 'disponible' && diploma.url_diploma) ||
      (filterEstado === 'pendiente' && !diploma.url_diploma);
    
    return matchesSearch && matchesEstado;
  });



  const handleCreate = () => {
    setShowCreateModal(true);
  };

  const handleView = (diploma: Diploma) => {
    setSelectedDiploma(diploma);
    setShowViewModal(true);
  };

  const handleDelete = (diploma: Diploma) => {
    setDiplomaToDelete(diploma);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (diplomaToDelete) {
      try {
        await diplomasService.eliminarDiploma(diplomaToDelete.id_diploma);
        setShowDeleteModal(false);
        setDiplomaToDelete(null);
        loadDiplomas(currentPage);
      } catch (error) {
        console.error('Error al eliminar diploma:', error);
      }
    }
  };

  const handleDownload = (diploma: Diploma) => {
    if (diploma.url_diploma) {
      window.open(diploma.url_diploma, '_blank');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadDiplomas(page);
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
  const canDelete = usuario?.id_rol === 1 || usuario?.id_rol === 2; // Admin y Organizador
  const canView = true; // Todos pueden ver
  const canDownload = true; // Todos pueden descargar si está disponible

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando diplomas...</p>
      </div>
    );
  }

  return (
    <div className="grid-container">
      <div className="grid-header">
        <div className="header-content">
          <h2 className="grid-title">Gestión de Diplomas</h2>
          <p className="grid-subtitle">Administra y genera diplomas para participantes</p>
        </div>
        
        <div className="header-actions">
          <div className="filters-container">
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="filter-select"
            >
              <option value="">Todos los estados</option>
              <option value="disponible">Disponible</option>
              <option value="pendiente">Pendiente</option>
            </select>
          </div>
          
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar diplomas..."
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
              + Generar Diploma
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
                <th>Estado</th>
                <th>Fecha Generación</th>
                <th>Observaciones</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredDiplomas.map((diploma) => (
                <tr key={diploma.id_diploma}>
                  <td>
                    <div className="cell-content">
                      <strong>
                        {diploma.usuario ? 
                          `${diploma.usuario.nombre} ${diploma.usuario.apellido}` : 
                          'Usuario no encontrado'
                        }
                      </strong>
                      <p className="cell-subtitle">{diploma.usuario?.correo}</p>
                    </div>
                  </td>
                  <td>
                    <div className="cell-content">
                      <strong>
                        {diploma.taller?.titulo || diploma.competencia?.titulo || 'Evento no encontrado'}
                      </strong>
                      <p className="cell-subtitle">
                        {diploma.taller ? 'Taller' : diploma.competencia ? 'Competencia' : 'Sin evento'}
                      </p>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${diploma.url_diploma ? 'success' : 'warning'}`}>
                      {diploma.url_diploma ? '✓ Disponible' : '⏳ Pendiente'}
                    </span>
                  </td>
                  <td>{formatDate(diploma.fecha_generacion)}</td>
                  <td>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {canView && (
                        <button
                          onClick={() => handleView(diploma)}
                          className="btn-view"
                          title="Ver detalles"
                        >
                          👁️
                        </button>
                      )}
                      {canDownload && diploma.url_diploma && (
                        <button
                          onClick={() => handleDownload(diploma)}
                          className="btn-download"
                          title="Descargar diploma"
                        >
                          📥
                        </button>
                      )}

                      {canDelete && (
                        <button
                          onClick={() => handleDelete(diploma)}
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
        <CreateDiplomaModal
          talleres={talleres}
          competencias={competencias}
          usuarios={usuarios}
          onClose={() => setShowCreateModal(false)}
          onSave={() => {
            setShowCreateModal(false);
            loadDiplomas(currentPage);
          }}
        />
      )}



      {/* Modal de Visualización */}
      {showViewModal && selectedDiploma && (
        <ViewDiplomaModal
          diploma={selectedDiploma}
          onClose={() => {
            setShowViewModal(false);
            setSelectedDiploma(null);
          }}
        />
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && diplomaToDelete && (
        <div className="modal-overlay">
          <div className="modal delete-modal">
            <div className="modal-header">
              <h3>Confirmar Eliminación</h3>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro de que deseas eliminar el diploma de "{diplomaToDelete.usuario?.nombre} {diplomaToDelete.usuario?.apellido}"?</p>
              <p className="warning-text">Esta acción no se puede deshacer.</p>
            </div>
            <div className="modal-footer">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDiplomaToDelete(null);
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

// Modal de Creación de Diploma
const CreateDiplomaModal: React.FC<{
  talleres: Taller[];
  competencias: Competencia[];
  usuarios: Usuario[];
  onClose: () => void;
  onSave: () => void;
}> = ({ talleres, competencias, usuarios, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<DiplomaGeneracion>({
    id_usuario: 0,
    id_taller: undefined,
    id_competencia: undefined,
    anio_evento: new Date().getFullYear()
  });
  const [tipoEvento, setTipoEvento] = useState<'taller' | 'competencia'>('taller');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'id_usuario' || name === 'anio_evento') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else if (name === 'id_evento') {
      const eventoId = parseInt(value) || undefined;
      setFormData(prev => ({
        ...prev,
        id_taller: tipoEvento === 'taller' ? eventoId : undefined,
        id_competencia: tipoEvento === 'competencia' ? eventoId : undefined
      }));
    }
  };

  const handleTipoEventoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevoTipo = e.target.value as 'taller' | 'competencia';
    setTipoEvento(nuevoTipo);
    setFormData(prev => ({
      ...prev,
      id_taller: undefined,
      id_competencia: undefined
    }));
  };

  const getEventosDisponibles = () => {
    return tipoEvento === 'taller' ? talleres : competencias;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await diplomasService.generarDiploma(formData);
      onSave();
    } catch (error) {
      console.error('Error al crear diploma:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal create-modal">
        <div className="modal-header">
          <h3>Generar Nuevo Diploma</h3>
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
                name="id_evento"
                value={tipoEvento === 'taller' ? formData.id_taller || '' : formData.id_competencia || ''}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="">Seleccionar evento</option>
                {getEventosDisponibles().map(evento => {
                  const eventoId = 'id_taller' in evento ? evento.id_taller : evento.id_competencia;
                  return (
                    <option key={eventoId} value={eventoId}>
                      {evento.titulo}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Año del Evento</label>
              <input
                type="number"
                name="anio_evento"
                value={formData.anio_evento || ''}
                onChange={handleInputChange}
                className="form-input"
                min="2020"
                max="2030"
                placeholder="2024"
              />
              <small className="form-help">Año en que se realizó el evento (2020-2030)</small>
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
              {loading ? 'Generando...' : 'Generar Diploma'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};



// Modal de Visualización de Diploma
const ViewDiplomaModal: React.FC<{
  diploma: Diploma;
  onClose: () => void;
}> = ({ diploma, onClose }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownload = () => {
    if (diploma.url_diploma) {
      window.open(diploma.url_diploma, '_blank');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal view-modal">
        <div className="modal-header">
          <h3>Detalles del Diploma</h3>
          <button onClick={onClose} className="modal-close">×</button>
        </div>
        
        <div className="modal-body">
          <div className="diploma-details">
            <div className="detail-section">
              <h4>Información del Participante</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Nombre:</label>
                  <span>{diploma.usuario?.nombre} {diploma.usuario?.apellido}</span>
                </div>
                <div className="detail-item">
                  <label>Email:</label>
                  <span>{diploma.usuario?.correo}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4>Información del Evento</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Tipo:</label>
                  <span className={`status-badge ${diploma.competencia ? 'warning' : 'info'}`}>
                    {diploma.taller ? 'Taller' : 'Competencia'}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Título:</label>
                  <span>{diploma.taller?.titulo || diploma.competencia?.titulo}</span>
                </div>
                <div className="detail-item">
                  <label>Ponente/Responsable:</label>
                  <span>
                    {diploma.taller?.ponente ? 
                      `${diploma.taller.ponente.nombre} ${diploma.taller.ponente.apellido}` :
                      diploma.competencia?.responsable ?
                      `${diploma.competencia.responsable.nombre} ${diploma.competencia.responsable.apellido}` :
                      'No especificado'
                    }
                  </span>
                </div>
                <div className="detail-item full-width">
                  <label>Descripción:</label>
                  <p>{diploma.taller?.descripcion || diploma.competencia?.descripcion}</p>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4>Información del Diploma</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Estado:</label>
                  <span className={`status-badge ${diploma.url_diploma ? 'success' : 'warning'}`}>
                    {diploma.url_diploma ? '✓ Disponible' : '⏳ Pendiente'}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Fecha de Generación:</label>
                  <span>{formatDate(diploma.fecha_generacion)}</span>
                </div>
                <div className="detail-item">
                  <label>Código de Verificación:</label>
                  <span>{diploma.codigo_verificacion || 'No generado'}</span>
                </div>
                <div className="detail-item">
                  <label>Año del Evento:</label>
                  <span>{diploma.anio_evento}</span>
                </div>
                {diploma.url_diploma && (
                  <div className="detail-item">
                    <label>Archivo PDF:</label>
                    <button
                      onClick={handleDownload}
                      className="btn-download"
                    >
                      📥 Descargar Diploma
                    </button>
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
            {diploma.url_diploma && (
              <button
                onClick={handleDownload}
                className="btn-download"
              >
                📥 Descargar Diploma
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiplomasGrid;