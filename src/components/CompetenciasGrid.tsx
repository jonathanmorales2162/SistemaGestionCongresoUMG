import React, { useState, useEffect } from 'react';
import { competenciasService } from '../api/competenciasService';
import { categoriasService } from '../api/categoriasService';
import { usuariosService } from '../api/usuariosService';
import type { Competencia, CompetenciaCreacion } from '../types/Competencia';
import type { Categoria } from '../types/Categoria';
import type { Usuario } from '../types/Usuario';
import { useAuth } from '../context/AuthContext';

interface CompetenciasGridProps {}

const CompetenciasGrid: React.FC<CompetenciasGridProps> = () => {
  const { usuario } = useAuth();
  const [competencias, setCompetencias] = useState<Competencia[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [responsables, setResponsables] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCompetencia, setSelectedCompetencia] = useState<Competencia | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [competenciaToDelete, setCompetenciaToDelete] = useState<Competencia | null>(null);

  const loadCompetencias = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await competenciasService.obtenerCompetencias(page, 10);
      
      if (response && response.competencias) {
        setCompetencias(response.competencias);
        setTotalPages(response.pagination?.totalPages || 1);
        setCurrentPage(page);
      } else {
        setCompetencias([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error al cargar competencias:', error);
      setCompetencias([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const loadCategorias = async () => {
    try {
      const categoriasData = await categoriasService.obtenerCategorias();
      setCategorias(categoriasData);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const loadResponsables = async () => {
    try {
      // Cargar todos los usuarios y filtrar por roles que pueden ser responsables
      // (Administrador, Organizador, Staff)
      const response = await usuariosService.obtenerUsuarios(1, 1000);
      
      if (Array.isArray(response)) {
        // Si la respuesta es un array directamente
        const responsablesValidos = response.filter((usuario: Usuario) => 
          [1, 2, 3].includes(usuario.id_rol) // Admin, Organizador, Staff
        );
        setResponsables(responsablesValidos);
      } else if (response && response.usuarios && Array.isArray(response.usuarios)) {
        // Si la respuesta tiene estructura de objeto
        const responsablesValidos = response.usuarios.filter((usuario: Usuario) => 
          [1, 2, 3].includes(usuario.id_rol) // Admin, Organizador, Staff
        );
        setResponsables(responsablesValidos);
      } else {
        console.error('Respuesta inesperada al cargar responsables:', response);
        setResponsables([]);
      }
    } catch (error) {
      console.error('Error al cargar responsables:', error);
      setResponsables([]);
    }
  };

  useEffect(() => {
    loadCompetencias();
    loadCategorias();
    loadResponsables();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredCompetencias = (competencias || []).filter(competencia =>
    competencia.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    competencia.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (competencia: Competencia) => {
    setSelectedCompetencia(competencia);
    setShowEditModal(true);
  };

  const handleCreate = () => {
    setShowCreateModal(true);
  };

  const handleDelete = (competencia: Competencia) => {
    setCompetenciaToDelete(competencia);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (competenciaToDelete) {
      try {
        await competenciasService.eliminarCompetencia(competenciaToDelete.id_competencia);
        setShowDeleteModal(false);
        setCompetenciaToDelete(null);
        loadCompetencias(currentPage);
      } catch (error) {
        console.error('Error al eliminar competencia:', error);
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadCompetencias(page);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoriaName = (idCategoria: number) => {
    const categoria = categorias.find(c => c.id_categoria === idCategoria);
    return categoria ? categoria.nombre : 'Sin categoría';
  };

  const getResponsableName = (idResponsable?: number) => {
    if (!idResponsable) return 'Sin asignar';
    const responsable = responsables.find(r => r.id_usuario === idResponsable);
    return responsable ? `${responsable.nombre} ${responsable.apellido}` : 'Sin asignar';
  };

  // Verificar permisos basados en el rol
  const canCreate = usuario?.id_rol === 1; // Solo Admin
  const canEdit = usuario?.id_rol === 1 || usuario?.id_rol === 2; // Admin y Organizador
  const canDelete = usuario?.id_rol === 1; // Solo Admin

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando competencias...</p>
      </div>
    );
  }

  return (
    <div className="grid-container">
      <div className="grid-header">
        <div className="header-content">
          <h2 className="grid-title">Gestión de Competencias</h2>
          <p className="grid-subtitle">Administra las competencias del congreso</p>
        </div>
        
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar competencias..."
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
              + Nueva Competencia
            </button>
          )}
        </div>
      </div>

      <div className="grid-content">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Categoría</th>
                <th>Responsable</th>
                <th>Horario</th>
                <th>Cupo</th>
                <th>Inscritos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompetencias.map((competencia) => (
                <tr key={competencia.id_competencia}>
                  <td>
                    <div className="cell-content">
                      <strong>{competencia.titulo}</strong>
                      <p className="cell-subtitle">{competencia.descripcion}</p>
                    </div>
                  </td>
                  <td>{getCategoriaName(competencia.id_categoria)}</td>
                  <td>{getResponsableName(competencia.id_staff_responsable)}</td>
                  <td>{formatDate(competencia.horario)}</td>
                  <td>{competencia.cupo}</td>
                  <td>
                    <span className={`status-badge ${(competencia.inscritos || 0) >= competencia.cupo ? 'full' : 'available'}`}>
                      {competencia.inscritos || 0}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {canEdit && (
                        <button
                          onClick={() => handleEdit(competencia)}
                          className="btn-edit"
                          title="Editar"
                        >
                          ✏️
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => handleDelete(competencia)}
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
        <CreateCompetenciaModal
          categorias={categorias}
          responsables={responsables}
          onClose={() => setShowCreateModal(false)}
          onSave={() => {
            setShowCreateModal(false);
            loadCompetencias(currentPage);
          }}
        />
      )}

      {/* Modal de Edición */}
      {showEditModal && selectedCompetencia && (
        <EditCompetenciaModal
          competencia={selectedCompetencia}
          categorias={categorias}
          responsables={responsables}
          onClose={() => {
            setShowEditModal(false);
            setSelectedCompetencia(null);
          }}
          onSave={() => {
            setShowEditModal(false);
            setSelectedCompetencia(null);
            loadCompetencias(currentPage);
          }}
        />
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && competenciaToDelete && (
        <div className="modal-overlay">
          <div className="modal delete-modal">
            <div className="modal-header">
              <h3>Confirmar Eliminación</h3>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro de que deseas eliminar la competencia "{competenciaToDelete.titulo}"?</p>
              <p className="warning-text">Esta acción no se puede deshacer.</p>
            </div>
            <div className="modal-footer">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setCompetenciaToDelete(null);
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

// Modal de Creación de Competencia
const CreateCompetenciaModal: React.FC<{
  categorias: Categoria[];
  responsables: Usuario[];
  onClose: () => void;
  onSave: () => void;
}> = ({ categorias, responsables, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CompetenciaCreacion>({
    titulo: '',
    descripcion: '',
    cupo: 0,
    horario: '',
    id_categoria: 0,
    id_staff_responsable: undefined,
    anio_evento: new Date().getFullYear(),
    imagen_url: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cupo' || name === 'id_categoria' || name === 'id_staff_responsable' || name === 'anio_evento' 
        ? parseInt(value) || 0 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await competenciasService.crearCompetencia(formData);
      onSave();
    } catch (error) {
      console.error('Error al crear competencia:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal create-modal">
        <div className="modal-header">
          <h3>Crear Nueva Competencia</h3>
          <button onClick={onClose} className="modal-close">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Título *</label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Categoría *</label>
              <select
                name="id_categoria"
                value={formData.id_categoria}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value={0}>Seleccionar categoría</option>
                {categorias.map(categoria => (
                  <option key={categoria.id_categoria} value={categoria.id_categoria}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Responsable</label>
              <select
                name="id_staff_responsable"
                value={formData.id_staff_responsable || ''}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">Sin asignar</option>
                {responsables.map(responsable => (
                  <option key={responsable.id_usuario} value={responsable.id_usuario}>
                    {responsable.nombre} {responsable.apellido}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Cupo *</label>
              <input
                type="number"
                name="cupo"
                value={formData.cupo}
                onChange={handleInputChange}
                className="form-input"
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Horario *</label>
              <input
                type="datetime-local"
                name="horario"
                value={formData.horario}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Año del Evento</label>
              <input
                type="number"
                name="anio_evento"
                value={formData.anio_evento}
                onChange={handleInputChange}
                className="form-input"
                min="2020"
                max="2030"
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Descripción *</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                className="form-textarea"
                rows={3}
                required
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">URL de Imagen</label>
              <input
                type="url"
                name="imagen_url"
                value={formData.imagen_url}
                onChange={handleInputChange}
                className="form-input"
                placeholder="https://ejemplo.com/imagen.jpg"
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
              {loading ? 'Guardando...' : 'Crear Competencia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal de Edición de Competencia
const EditCompetenciaModal: React.FC<{
  competencia: Competencia;
  categorias: Categoria[];
  responsables: Usuario[];
  onClose: () => void;
  onSave: () => void;
}> = ({ competencia, categorias, responsables, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: competencia.titulo,
    descripcion: competencia.descripcion,
    cupo: competencia.cupo,
    horario: competencia.horario,
    id_categoria: competencia.id_categoria,
    id_staff_responsable: competencia.id_staff_responsable || undefined,
    anio_evento: competencia.anio_evento || new Date().getFullYear(),
    imagen_url: competencia.imagen_url || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cupo' || name === 'id_categoria' || name === 'id_staff_responsable' || name === 'anio_evento' 
        ? parseInt(value) || 0 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await competenciasService.actualizarCompetencia(competencia.id_competencia, formData);
      onSave();
    } catch (error) {
      console.error('Error al actualizar competencia:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal edit-modal">
        <div className="modal-header">
          <h3>Editar Competencia</h3>
          <button onClick={onClose} className="modal-close">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Título *</label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Categoría *</label>
              <select
                name="id_categoria"
                value={formData.id_categoria}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                {categorias.map(categoria => (
                  <option key={categoria.id_categoria} value={categoria.id_categoria}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Responsable</label>
              <select
                name="id_staff_responsable"
                value={formData.id_staff_responsable || ''}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">Sin asignar</option>
                {responsables.map(responsable => (
                  <option key={responsable.id_usuario} value={responsable.id_usuario}>
                    {responsable.nombre} {responsable.apellido}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Cupo *</label>
              <input
                type="number"
                name="cupo"
                value={formData.cupo}
                onChange={handleInputChange}
                className="form-input"
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Horario *</label>
              <input
                type="datetime-local"
                name="horario"
                value={formData.horario}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Año del Evento</label>
              <input
                type="number"
                name="anio_evento"
                value={formData.anio_evento}
                onChange={handleInputChange}
                className="form-input"
                min="2020"
                max="2030"
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Descripción *</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                className="form-textarea"
                rows={3}
                required
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">URL de Imagen</label>
              <input
                type="url"
                name="imagen_url"
                value={formData.imagen_url}
                onChange={handleInputChange}
                className="form-input"
                placeholder="https://ejemplo.com/imagen.jpg"
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

export default CompetenciasGrid;