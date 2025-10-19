import React, { useState, useEffect } from 'react';
import { categoriasService } from '../api/categoriasService';
import type { Categoria } from '../types/Categoria';
import { useAuth } from '../context/AuthContext';

interface CategoriasGridProps {}

const CategoriasGrid: React.FC<CategoriasGridProps> = () => {
  const { usuario } = useAuth();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoriaToDelete, setCategoriaToDelete] = useState<Categoria | null>(null);

  const loadCategorias = async (page: number = 1) => {
    try {
      setLoading(true);
      const categorias = await categoriasService.obtenerCategorias();
      setCategorias(categorias);
      setTotalPages(1);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      setCategorias([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategorias();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredCategorias = (categorias || []).filter(categoria =>
    categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    categoria.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (categoria: Categoria) => {
    setSelectedCategoria(categoria);
    setShowEditModal(true);
  };

  const handleCreate = () => {
    setShowCreateModal(true);
  };

  const handleDelete = (categoria: Categoria) => {
    setCategoriaToDelete(categoria);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (categoriaToDelete) {
      try {
        await categoriasService.eliminarCategoria(categoriaToDelete.id_categoria);
        setShowDeleteModal(false);
        setCategoriaToDelete(null);
        loadCategorias(currentPage);
      } catch (error) {
        console.error('Error al eliminar categoría:', error);
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadCategorias(page);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Verificar permisos basados en el rol
  const canCreate = usuario?.id_rol === 1 || usuario?.id_rol === 2; // Admin y Organizador
  const canEdit = usuario?.id_rol === 1 || usuario?.id_rol === 2; // Admin y Organizador
  const canDelete = usuario?.id_rol === 1; // Solo Admin

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando categorías...</p>
      </div>
    );
  }

  return (
    <div className="grid-container">
      <div className="grid-header">
        <div className="header-content">
          <h2 className="grid-title">Gestión de Categorías</h2>
          <p className="grid-subtitle">Administra las categorías para talleres, competencias y foros</p>
        </div>
        
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar categorías..."
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
              + Nueva Categoría
            </button>
          )}
        </div>
      </div>

      <div className="grid-content">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Fecha Creación</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategorias.map((categoria) => (
                <tr key={categoria.id_categoria}>
                  <td>
                    <div className="cell-content">
                      <strong>{categoria.nombre}</strong>
                    </div>
                  </td>
                  <td>
                    <div className="cell-content">
                      <p className="cell-description">{categoria.descripcion}</p>
                    </div>
                  </td>
                  <td>{formatDate(categoria.fecha_creacion)}</td>
                  <td>
                    <span className={`status-badge ${categoria.activo ? 'success' : 'danger'}`}>
                      {categoria.activo ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {canEdit && (
                        <button
                          onClick={() => handleEdit(categoria)}
                          className="btn-edit"
                          title="Editar"
                        >
                          ✏️
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => handleDelete(categoria)}
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
        <CreateCategoriaModal
          onClose={() => setShowCreateModal(false)}
          onSave={() => {
            setShowCreateModal(false);
            loadCategorias(currentPage);
          }}
        />
      )}

      {/* Modal de Edición */}
      {showEditModal && selectedCategoria && (
        <EditCategoriaModal
          categoria={selectedCategoria}
          onClose={() => {
            setShowEditModal(false);
            setSelectedCategoria(null);
          }}
          onSave={() => {
            setShowEditModal(false);
            setSelectedCategoria(null);
            loadCategorias(currentPage);
          }}
        />
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && categoriaToDelete && (
        <div className="modal-overlay">
          <div className="modal delete-modal">
            <div className="modal-header">
              <h3>Confirmar Eliminación</h3>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro de que deseas eliminar la categoría "{categoriaToDelete.nombre}"?</p>
              <p className="warning-text">Esta acción no se puede deshacer y puede afectar talleres, competencias y foros asociados.</p>
            </div>
            <div className="modal-footer">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setCategoriaToDelete(null);
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

// Modal de Creación de Categoría
const CreateCategoriaModal: React.FC<{
  onClose: () => void;
  onSave: () => void;
}> = ({ onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      await categoriasService.crearCategoria(formData);
      onSave();
    } catch (error) {
      console.error('Error al crear categoría:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal create-modal">
        <div className="modal-header">
          <h3>Crear Nueva Categoría</h3>
          <button onClick={onClose} className="modal-close">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-grid">
            <div className="form-group full-width">
              <label className="form-label">Nombre *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="form-input"
                required
                placeholder="Ej: Tecnología, Ciencias, Arte..."
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Descripción *</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                className="form-textarea"
                rows={4}
                required
                placeholder="Describe el tipo de contenido que abarcará esta categoría"
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
              {loading ? 'Guardando...' : 'Crear Categoría'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal de Edición de Categoría
const EditCategoriaModal: React.FC<{
  categoria: Categoria;
  onClose: () => void;
  onSave: () => void;
}> = ({ categoria, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: categoria.nombre,
    descripcion: categoria.descripcion,
    activo: categoria.activo
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      await categoriasService.actualizarCategoria(categoria.id_categoria, formData);
      onSave();
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal edit-modal">
        <div className="modal-header">
          <h3>Editar Categoría</h3>
          <button onClick={onClose} className="modal-close">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-grid">
            <div className="form-group full-width">
              <label className="form-label">Nombre *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Descripción *</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                className="form-textarea"
                rows={4}
                required
              />
            </div>

            <div className="form-group full-width">
              <label className="form-checkbox">
                <input
                  type="checkbox"
                  name="activo"
                  checked={formData.activo}
                  onChange={handleInputChange}
                />
                <span className="checkmark"></span>
                Categoría activa
              </label>
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

export default CategoriasGrid;