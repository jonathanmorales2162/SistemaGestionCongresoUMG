import React, { useState, useEffect } from 'react';
import { talleresService } from '../api/talleresService';
import { categoriasService } from '../api/categoriasService';
import { usuariosService } from '../api/usuariosService';
import type { Taller, TallerCreacion } from '../types/Taller';
import type { Categoria } from '../types/Categoria';
import type { Usuario } from '../types/Usuario';
import { useAuth } from '../context/AuthContext';

interface TalleresGridProps {}

const TalleresGrid: React.FC<TalleresGridProps> = () => {
  const { usuario } = useAuth();
  const [talleres, setTalleres] = useState<Taller[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [ponentes, setPonentes] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTaller, setSelectedTaller] = useState<Taller | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tallerToDelete, setTallerToDelete] = useState<Taller | null>(null);

  const loadTalleres = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await talleresService.obtenerTalleres(page, 10);
      
      if (response && response.talleres) {
        setTalleres(response.talleres);
        setTotalPages(response.pagination?.totalPages || 1);
        setCurrentPage(page);
      } else {
        setTalleres([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error al cargar talleres:', error);
      setTalleres([]);
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
      setCategorias([]);
    }
  };

  const loadPonentes = async () => {
    try {
      // Cargar todos los usuarios y filtrar por roles que pueden ser ponentes
      // (Administrador, Organizador, Staff)
      const response = await usuariosService.obtenerUsuarios(1, 1000);
      
      if (Array.isArray(response)) {
        // Si la respuesta es un array directamente
        const ponentesValidos = response.filter((usuario: Usuario) => 
          [1, 2, 3].includes(usuario.id_rol) // Admin, Organizador, Staff
        );
        setPonentes(ponentesValidos);
      } else if (response && response.usuarios && Array.isArray(response.usuarios)) {
        // Si la respuesta tiene estructura de objeto
        const ponentesValidos = response.usuarios.filter((usuario: Usuario) => 
          [1, 2, 3].includes(usuario.id_rol) // Admin, Organizador, Staff
        );
        setPonentes(ponentesValidos);
      } else {
        console.error('Respuesta inesperada al cargar ponentes:', response);
        setPonentes([]);
      }
    } catch (error) {
      console.error('Error al cargar ponentes:', error);
      setPonentes([]);
    }
  };

  useEffect(() => {
    loadTalleres();
    loadCategorias();
    loadPonentes();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredTalleres = (talleres || []).filter(taller =>
    taller.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    taller.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (taller: Taller) => {
    setSelectedTaller(taller);
    setShowEditModal(true);
  };

  const handleCreate = () => {
    setShowCreateModal(true);
  };

  const handleDelete = (taller: Taller) => {
    setTallerToDelete(taller);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (tallerToDelete) {
      try {
        await talleresService.eliminarTaller(tallerToDelete.id_taller);
        setShowDeleteModal(false);
        setTallerToDelete(null);
        loadTalleres(currentPage);
      } catch (error) {
        console.error('Error al eliminar taller:', error);
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadTalleres(page);
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
    if (!categorias || categorias.length === 0) return 'Cargando...';
    const categoria = categorias.find(c => c.id_categoria === idCategoria);
    return categoria ? categoria.nombre : 'Sin categoría';
  };

  const getPonenteName = (idPonente?: number) => {
    if (!idPonente) return 'Sin asignar';
    if (!ponentes || ponentes.length === 0) return 'Cargando...';
    const ponente = ponentes.find(p => p.id_usuario === idPonente);
    return ponente ? `${ponente.nombre} ${ponente.apellido}` : 'Sin asignar';
  };

  // Verificar permisos basados en el rol
  const canCreate = usuario?.id_rol === 1; // Solo Admin
  const canEdit = usuario?.id_rol === 1 || usuario?.id_rol === 2; // Admin y Organizador
  const canDelete = usuario?.id_rol === 1; // Solo Admin

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando talleres...</p>
      </div>
    );
  }

  return (
    <div className="grid-container">
      <div className="grid-header">
        <div className="header-content">
          <h2 className="grid-title">Gestión de Talleres</h2>
          <p className="grid-subtitle">Administra los talleres del congreso</p>
        </div>
        
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar talleres..."
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
              + Nuevo Taller
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
                <th>Ponente</th>
                <th>Horario</th>
                <th>Cupo</th>
                <th>Inscritos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredTalleres.map((taller) => (
                <tr key={taller.id_taller}>
                  <td>
                    <div className="cell-content">
                      <strong>{taller.titulo}</strong>
                      <p className="cell-subtitle">{taller.descripcion}</p>
                    </div>
                  </td>
                  <td>{getCategoriaName(taller.id_categoria)}</td>
                  <td>{getPonenteName(taller.id_staff_ponente)}</td>
                  <td>{formatDate(taller.horario)}</td>
                  <td>{taller.cupo}</td>
                  <td>
                    <span className={`status-badge ${(taller.inscritos || 0) >= taller.cupo ? 'full' : 'available'}`}>
                      {taller.inscritos || 0}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {canEdit && (
                        <button
                          onClick={() => handleEdit(taller)}
                          className="btn-edit"
                          title="Editar"
                        >
                          ✏️
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => handleDelete(taller)}
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
        <CreateTallerModal
          categorias={categorias}
          ponentes={ponentes}
          onClose={() => setShowCreateModal(false)}
          onSave={() => {
            setShowCreateModal(false);
            loadTalleres(currentPage);
          }}
        />
      )}

      {/* Modal de Edición */}
      {showEditModal && selectedTaller && (
        <EditTallerModal
          taller={selectedTaller}
          categorias={categorias}
          ponentes={ponentes}
          onClose={() => {
            setShowEditModal(false);
            setSelectedTaller(null);
          }}
          onSave={() => {
            setShowEditModal(false);
            setSelectedTaller(null);
            loadTalleres(currentPage);
          }}
        />
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && tallerToDelete && (
        <div className="modal-overlay">
          <div className="modal delete-modal">
            <div className="modal-header">
              <h3>Confirmar Eliminación</h3>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro de que deseas eliminar el taller "{tallerToDelete.titulo}"?</p>
              <p className="warning-text">Esta acción no se puede deshacer.</p>
            </div>
            <div className="modal-footer">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setTallerToDelete(null);
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

// Modal de Creación de Taller
const CreateTallerModal: React.FC<{
  categorias: Categoria[];
  ponentes: Usuario[];
  onClose: () => void;
  onSave: () => void;
}> = ({ categorias, ponentes, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TallerCreacion>({
    titulo: '',
    descripcion: '',
    cupo: 0,
    horario: '',
    id_categoria: 0,
    id_staff_ponente: undefined,
    anio_evento: new Date().getFullYear(),
    imagen_url: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cupo' || name === 'id_categoria' || name === 'id_staff_ponente' || name === 'anio_evento' 
        ? parseInt(value) || 0 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await talleresService.crearTaller(formData);
      onSave();
    } catch (error) {
      console.error('Error al crear taller:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal create-modal">
        <div className="modal-header">
          <h3>Crear Nuevo Taller</h3>
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
              <label className="form-label">Ponente</label>
              <select
                name="id_staff_ponente"
                value={formData.id_staff_ponente || ''}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">Sin asignar</option>
                {ponentes.map(ponente => (
                  <option key={ponente.id_usuario} value={ponente.id_usuario}>
                    {ponente.nombre} {ponente.apellido}
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
              {loading ? 'Guardando...' : 'Crear Taller'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal de Edición de Taller
const EditTallerModal: React.FC<{
  taller: Taller;
  categorias: Categoria[];
  ponentes: Usuario[];
  onClose: () => void;
  onSave: () => void;
}> = ({ taller, categorias, ponentes, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: taller.titulo,
    descripcion: taller.descripcion,
    cupo: taller.cupo,
    horario: taller.horario,
    id_categoria: taller.id_categoria,
    id_staff_ponente: taller.id_staff_ponente || undefined,
    anio_evento: taller.anio_evento || new Date().getFullYear(),
    imagen_url: taller.imagen_url || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cupo' || name === 'id_categoria' || name === 'id_staff_ponente' || name === 'anio_evento' 
        ? parseInt(value) || 0 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await talleresService.actualizarTaller(taller.id_taller, formData);
      onSave();
    } catch (error) {
      console.error('Error al actualizar taller:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal edit-modal">
        <div className="modal-header">
          <h3>Editar Taller</h3>
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
              <label className="form-label">Ponente</label>
              <select
                name="id_staff_ponente"
                value={formData.id_staff_ponente || ''}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">Sin asignar</option>
                {ponentes.map(ponente => (
                  <option key={ponente.id_usuario} value={ponente.id_usuario}>
                    {ponente.nombre} {ponente.apellido}
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

export default TalleresGrid;