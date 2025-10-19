import React, { useState, useEffect } from 'react';
import { resultadosService } from '../api/resultadosService';
import { categoriasService } from '../api/categoriasService';
import { usuariosService } from '../api/usuariosService';
import type { Resultado, ResultadoCreacion } from '../types/Resultado';
import type { Categoria } from '../types/Categoria';
import type { Usuario } from '../types/Usuario';
import { useAuth } from '../context/AuthContext';

interface ResultadosGridProps {}

const ResultadosGrid: React.FC<ResultadosGridProps> = () => {
  const { usuario } = useAuth();
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedResultado, setSelectedResultado] = useState<Resultado | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [resultadoToDelete, setResultadoToDelete] = useState<Resultado | null>(null);

  const loadResultados = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await resultadosService.obtenerResultados(page, 10);
      
      if (response && response.resultados) {
        setResultados(response.resultados);
        setTotalPages(response.pagination?.totalPages || 1);
        setCurrentPage(page);
      } else {
        setResultados([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error al cargar resultados:', error);
      setResultados([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const loadCategorias = async () => {
    try {
      const response = await categoriasService.obtenerCategorias();
      setCategorias(response || []);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      setCategorias([]);
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
    loadResultados();
    loadCategorias();
    loadUsuarios();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredResultados = resultados.filter(resultado =>
    resultado.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resultado.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resultado.categoria?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (resultado: Resultado) => {
    setSelectedResultado(resultado);
    setShowEditModal(true);
  };

  const handleCreate = () => {
    setShowCreateModal(true);
  };

  const handleView = (resultado: Resultado) => {
    setSelectedResultado(resultado);
    setShowViewModal(true);
  };

  const handleDelete = (resultado: Resultado) => {
    setResultadoToDelete(resultado);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (resultadoToDelete) {
      try {
        await resultadosService.eliminarResultado(resultadoToDelete.id_resultado);
        setShowDeleteModal(false);
        setResultadoToDelete(null);
        loadResultados(currentPage);
      } catch (error) {
        console.error('Error al eliminar resultado:', error);
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadResultados(page);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getTipoLabel = (tipo: string) => {
    const tipos = {
      'taller': 'Taller',
      'competencia': 'Competencia',
      'general': 'General'
    };
    return tipos[tipo as keyof typeof tipos] || tipo;
  };

  // Verificar permisos basados en el rol
  const canCreate = usuario?.id_rol === 1 || usuario?.id_rol === 2; // Admin y Organizador
  const canEdit = usuario?.id_rol === 1 || usuario?.id_rol === 2; // Admin y Organizador
  const canDelete = usuario?.id_rol === 1; // Solo Admin
  const canView = true; // Todos pueden ver

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando resultados...</p>
      </div>
    );
  }

  return (
    <div className="grid-container">
      <div className="grid-header">
        <div className="header-content">
          <h2 className="grid-title">Gestión de Resultados</h2>
          <p className="grid-subtitle">Administra los resultados de talleres, competencias y eventos</p>
        </div>
        
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar resultados..."
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
              + Nuevo Resultado
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
                <th>Tipo</th>
                <th>Ganadores</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredResultados.map((resultado) => (
                <tr key={resultado.id_resultado}>
                  <td>
                    <div className="cell-content">
                      <strong>{resultado.titulo}</strong>
                      <p className="cell-subtitle">{resultado.descripcion}</p>
                    </div>
                  </td>
                  <td>{resultado.categoria?.nombre || 'Sin categoría'}</td>
                  <td>
                    <span className={`status-badge ${resultado.tipo === 'competencia' ? 'warning' : resultado.tipo === 'taller' ? 'info' : 'secondary'}`}>
                      {getTipoLabel(resultado.tipo)}
                    </span>
                  </td>
                  <td>
                    <span className="status-badge info">
                      {resultado.ganadores?.length || 0}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${resultado.publicado ? 'success' : 'warning'}`}>
                      {resultado.publicado ? 'Publicado' : 'Borrador'}
                    </span>
                  </td>
                  <td>{resultado.fecha_publicacion ? formatDate(resultado.fecha_publicacion) : 'No publicado'}</td>
                  <td>
                    <div className="action-buttons">
                      {canView && (
                        <button
                          onClick={() => handleView(resultado)}
                          className="btn-view"
                          title="Ver detalles"
                        >
                          👁️
                        </button>
                      )}
                      {canEdit && (
                        <button
                          onClick={() => handleEdit(resultado)}
                          className="btn-edit"
                          title="Editar"
                        >
                          ✏️
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => handleDelete(resultado)}
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
        <CreateResultadoModal
          categorias={categorias}
          usuarios={usuarios}
          onClose={() => setShowCreateModal(false)}
          onSave={() => {
            setShowCreateModal(false);
            loadResultados(currentPage);
          }}
        />
      )}

      {/* Modal de Edición */}
      {showEditModal && selectedResultado && (
        <EditResultadoModal
          resultado={selectedResultado}
          categorias={categorias}
          usuarios={usuarios}
          onClose={() => {
            setShowEditModal(false);
            setSelectedResultado(null);
          }}
          onSave={() => {
            setShowEditModal(false);
            setSelectedResultado(null);
            loadResultados(currentPage);
          }}
        />
      )}

      {/* Modal de Visualización */}
      {showViewModal && selectedResultado && (
        <ViewResultadoModal
          resultado={selectedResultado}
          onClose={() => {
            setShowViewModal(false);
            setSelectedResultado(null);
          }}
        />
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && resultadoToDelete && (
        <div className="modal-overlay">
          <div className="modal delete-modal">
            <div className="modal-header">
              <h3>Confirmar Eliminación</h3>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro de que deseas eliminar el resultado "{resultadoToDelete.titulo}"?</p>
              <p className="warning-text">Esta acción no se puede deshacer.</p>
            </div>
            <div className="modal-footer">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setResultadoToDelete(null);
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

// Modal de Creación de Resultado
const CreateResultadoModal: React.FC<{
  categorias: Categoria[];
  usuarios: Usuario[];
  onClose: () => void;
  onSave: () => void;
}> = ({ categorias, usuarios, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ResultadoCreacion>({
    titulo: '',
    descripcion: '',
    id_categoria: 0,
    tipo: 'general',
    ganadores: [],
    publicado: false
  });
  const [ganadores, setGanadores] = useState([{ posicion: 1, id_usuario: 0, proyecto: '', puntuacion: 0 }]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              name === 'id_categoria' || name === 'anio_evento' ? parseInt(value) || 0 : 
              value
    }));
  };

  const handleGanadorChange = (index: number, field: string, value: any) => {
    const newGanadores = [...ganadores];
    newGanadores[index] = {
      ...newGanadores[index],
      [field]: field === 'id_usuario' || field === 'posicion' || field === 'puntuacion' ? parseInt(value) || 0 : value
    };
    setGanadores(newGanadores);
  };

  const addGanador = () => {
    setGanadores([...ganadores, { posicion: ganadores.length + 1, id_usuario: 0, proyecto: '', puntuacion: 0 }]);
  };

  const removeGanador = (index: number) => {
    if (ganadores.length > 1) {
      setGanadores(ganadores.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const dataToSubmit = {
        ...formData,
        ganadores: ganadores.filter(g => g.id_usuario > 0)
      };
      await resultadosService.crearResultado(dataToSubmit);
      onSave();
    } catch (error) {
      console.error('Error al crear resultado:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal create-modal large-modal">
        <div className="modal-header">
          <h3>Crear Nuevo Resultado</h3>
          <button onClick={onClose} className="modal-close">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-grid">
            <div className="form-group full-width">
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
                <option value="">Seleccionar categoría</option>
                {categorias.map(categoria => (
                  <option key={categoria.id_categoria} value={categoria.id_categoria}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Tipo *</label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="general">General</option>
                <option value="taller">Taller</option>
                <option value="competencia">Competencia</option>
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
                placeholder={new Date().getFullYear().toString()}
              />
            </div>

            <div className="form-group">
              <label className="form-label">URL de Imagen</label>
              <input
                type="url"
                name="imagen_url"
                value={formData.imagen_url || ''}
                onChange={handleInputChange}
                className="form-input"
                placeholder="https://ejemplo.com/imagen.jpg"
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
                  name="publicado"
                  checked={formData.publicado}
                  onChange={handleInputChange}
                />
                <span className="checkmark"></span>
                Publicar resultado
              </label>
            </div>

            {/* Sección de Ganadores */}
            <div className="form-group full-width">
              <div className="section-header">
                <label className="form-label">Ganadores</label>
                <button
                  type="button"
                  onClick={addGanador}
                  className="btn-secondary small"
                >
                  + Agregar Ganador
                </button>
              </div>
              
              {ganadores.map((ganador, index) => (
                <div key={index} className="ganador-item">
                  <div className="ganador-grid">
                    <div className="form-group">
                      <label className="form-label">Posición</label>
                      <input
                        type="number"
                        value={ganador.posicion}
                        onChange={(e) => handleGanadorChange(index, 'posicion', e.target.value)}
                        className="form-input"
                        min="1"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Usuario</label>
                      <select
                        value={ganador.id_usuario}
                        onChange={(e) => handleGanadorChange(index, 'id_usuario', e.target.value)}
                        className="form-select"
                      >
                        <option value="">Seleccionar usuario</option>
                        {usuarios.map(usuario => (
                          <option key={usuario.id_usuario} value={usuario.id_usuario}>
                            {usuario.nombre} {usuario.apellido}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Proyecto</label>
                      <input
                        type="text"
                        value={ganador.proyecto}
                        onChange={(e) => handleGanadorChange(index, 'proyecto', e.target.value)}
                        className="form-input"
                        placeholder="Nombre del proyecto"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Puntuación</label>
                      <input
                        type="number"
                        value={ganador.puntuacion}
                        onChange={(e) => handleGanadorChange(index, 'puntuacion', e.target.value)}
                        className="form-input"
                        step="0.1"
                        min="0"
                      />
                    </div>
                    
                    {ganadores.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeGanador(index)}
                        className="btn-delete small"
                        title="Eliminar ganador"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              ))}
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
              {loading ? 'Guardando...' : 'Crear Resultado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal de Edición de Resultado
const EditResultadoModal: React.FC<{
  resultado: Resultado;
  categorias: Categoria[];
  usuarios: Usuario[];
  onClose: () => void;
  onSave: () => void;
}> = ({ resultado, categorias, usuarios, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: resultado.titulo,
    descripcion: resultado.descripcion,
    id_categoria: resultado.id_categoria,
    anio_evento: resultado.anio_evento || new Date().getFullYear(),
    imagen_url: resultado.imagen_url || ''
  });
  const [ganadores, setGanadores] = useState(resultado.ganadores || []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'id_categoria' || name === 'anio_evento' ? parseInt(value) || 0 : value
    }));
  };

  const handleGanadorChange = (index: number, field: string, value: any) => {
    const newGanadores = [...ganadores];
    newGanadores[index] = {
      ...newGanadores[index],
      [field]: field === 'id_usuario' || field === 'posicion' || field === 'puntuacion' ? parseInt(value) || 0 : value
    };
    setGanadores(newGanadores);
  };

  const addGanador = () => {
    setGanadores([...ganadores, { posicion: ganadores.length + 1, id_usuario: 0, proyecto: '', puntuacion: 0 }]);
  };

  const removeGanador = (index: number) => {
    if (ganadores.length > 1) {
      setGanadores(ganadores.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const dataToSubmit = {
        ...formData,
        ganadores: ganadores.filter(g => g.id_usuario > 0)
      };
      await resultadosService.actualizarResultado(resultado.id_resultado, dataToSubmit);
      onSave();
    } catch (error) {
      console.error('Error al actualizar resultado:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal edit-modal large-modal">
        <div className="modal-header">
          <h3>Editar Resultado</h3>
          <button onClick={onClose} className="modal-close">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-grid">
            <div className="form-group full-width">
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
                <option value="">Seleccionar categoría</option>
                {categorias.map(categoria => (
                  <option key={categoria.id_categoria} value={categoria.id_categoria}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
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

            <div className="form-group">
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

            {/* Sección de Ganadores */}
            <div className="form-group full-width">
              <div className="section-header">
                <label className="form-label">Ganadores</label>
                <button
                  type="button"
                  onClick={addGanador}
                  className="btn-secondary small"
                >
                  + Agregar Ganador
                </button>
              </div>
              
              {ganadores.map((ganador, index) => (
                <div key={index} className="ganador-item">
                  <div className="ganador-grid">
                    <div className="form-group">
                      <label className="form-label">Posición</label>
                      <input
                        type="number"
                        value={ganador.posicion}
                        onChange={(e) => handleGanadorChange(index, 'posicion', e.target.value)}
                        className="form-input"
                        min="1"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Usuario</label>
                      <select
                        value={ganador.id_usuario}
                        onChange={(e) => handleGanadorChange(index, 'id_usuario', e.target.value)}
                        className="form-select"
                      >
                        <option value="">Seleccionar usuario</option>
                        {usuarios.map(usuario => (
                          <option key={usuario.id_usuario} value={usuario.id_usuario}>
                            {usuario.nombre} {usuario.apellido}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Proyecto</label>
                      <input
                        type="text"
                        value={ganador.proyecto || ''}
                        onChange={(e) => handleGanadorChange(index, 'proyecto', e.target.value)}
                        className="form-input"
                        placeholder="Nombre del proyecto"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Puntuación</label>
                      <input
                        type="number"
                        value={ganador.puntuacion || ''}
                        onChange={(e) => handleGanadorChange(index, 'puntuacion', e.target.value)}
                        className="form-input"
                        step="0.1"
                        min="0"
                      />
                    </div>
                    
                    {ganadores.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeGanador(index)}
                        className="btn-delete small"
                        title="Eliminar ganador"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              ))}
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

// Modal de Visualización de Resultado
const ViewResultadoModal: React.FC<{
  resultado: Resultado;
  onClose: () => void;
}> = ({ resultado, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal view-modal large-modal">
        <div className="modal-header">
          <h3>Detalles del Resultado</h3>
          <button onClick={onClose} className="modal-close">×</button>
        </div>
        
        <div className="modal-body">
          <div className="result-details">
            <div className="detail-section">
              <h4>Información General</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Título:</label>
                  <span>{resultado.titulo}</span>
                </div>
                <div className="detail-item">
                  <label>Categoría:</label>
                  <span>{resultado.categoria?.nombre || 'Sin categoría'}</span>
                </div>
                <div className="detail-item">
                  <label>Tipo:</label>
                  <span>{resultado.tipo}</span>
                </div>
                <div className="detail-item">
                  <label>Estado:</label>
                  <span className={`status-badge ${resultado.publicado ? 'success' : 'warning'}`}>
                    {resultado.publicado ? 'Publicado' : 'Borrador'}
                  </span>
                </div>
                <div className="detail-item full-width">
                  <label>Descripción:</label>
                  <p>{resultado.descripcion}</p>
                </div>
              </div>
            </div>

            {resultado.ganadores && resultado.ganadores.length > 0 && (
              <div className="detail-section">
                <h4>Ganadores</h4>
                <div className="ganadores-list">
                  {resultado.ganadores.map((ganador, index) => (
                    <div key={index} className="ganador-card">
                      <div className="ganador-position">#{ganador.posicion}</div>
                      <div className="ganador-info">
                        <div className="ganador-name">
                          {ganador.usuario ? `${ganador.usuario.nombre} ${ganador.usuario.apellido}` : 'Usuario no encontrado'}
                        </div>
                        {ganador.proyecto && (
                          <div className="ganador-project">Proyecto: {ganador.proyecto}</div>
                        )}
                        {ganador.puntuacion && (
                          <div className="ganador-score">Puntuación: {ganador.puntuacion}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {resultado.menciones && resultado.menciones.length > 0 && (
              <div className="detail-section">
                <h4>Menciones Especiales</h4>
                <div className="menciones-list">
                  {resultado.menciones.map((mencion, index) => (
                    <div key={index} className="mencion-card">
                      <div className="mencion-type">{mencion.tipo_mencion}</div>
                      <div className="mencion-user">
                        {mencion.usuario ? `${mencion.usuario.nombre} ${mencion.usuario.apellido}` : 'Usuario no encontrado'}
                      </div>
                      {mencion.descripcion && (
                        <div className="mencion-description">{mencion.descripcion}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
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

export default ResultadosGrid;