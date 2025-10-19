import React, { useState, useEffect } from 'react';
import { forosService } from '../api/forosService';
import type { Foro, ForoCreacion } from '../types/Foro';
import { useAuth } from '../context/AuthContext';

interface ForosGridProps {}

const ForosGrid: React.FC<ForosGridProps> = () => {
  const { usuario } = useAuth();
  const [foros, setForos] = useState<Foro[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedForo, setSelectedForo] = useState<Foro | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [foroToDelete, setForoToDelete] = useState<Foro | null>(null);
  const [showMessagesModal, setShowMessagesModal] = useState(false);

  const loadForos = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await forosService.obtenerForos(page, 10);
      
      if (response && response.foros) {
        setForos(response.foros);
        setTotalPages(response.pagination?.totalPages || 1);
        setCurrentPage(page);
      } else {
        setForos([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error al cargar foros:', error);
      setForos([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForos();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredForos = foros.filter(foro =>
    foro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    foro.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (foro: Foro) => {
    setSelectedForo(foro);
    setShowEditModal(true);
  };

  const handleCreate = () => {
    setShowCreateModal(true);
  };

  const handleDelete = (foro: Foro) => {
    setForoToDelete(foro);
    setShowDeleteModal(true);
  };

  const handleViewMessages = (foro: Foro) => {
    setSelectedForo(foro);
    setShowMessagesModal(true);
  };

  const confirmDelete = async () => {
    if (foroToDelete) {
      try {
        await forosService.eliminarForo(foroToDelete.id_foro);
        setShowDeleteModal(false);
        setForoToDelete(null);
        loadForos(currentPage);
      } catch (error) {
        console.error('Error al eliminar foro:', error);
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadForos(page);
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

  const getCreadorName = (foro: Foro) => {
    if (foro.usuario_creador) {
      return `${foro.usuario_creador.nombre} ${foro.usuario_creador.apellido}`;
    }
    return 'Usuario desconocido';
  };

  // Verificar permisos basados en el rol
  const canCreate = usuario?.id_rol === 1 || usuario?.id_rol === 2; // Admin y Organizador
  const canEdit = (foro: Foro) => {
    return usuario?.id_rol === 1 || // Admin puede editar todos
           (usuario?.id_rol === 2) || // Organizador puede editar todos
           (foro.id_usuario_creador === usuario?.id_usuario); // Creador puede editar el suyo
  };
  const canDelete = (foro: Foro) => {
    return usuario?.id_rol === 1 || // Solo Admin puede eliminar
           (foro.id_usuario_creador === usuario?.id_usuario); // O el creador
  };
  const canViewMessages = true; // Todos pueden ver mensajes

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando foros...</p>
      </div>
    );
  }

  return (
    <div className="grid-container">
      <div className="grid-header">
        <div className="header-content">
          <h2 className="grid-title">Gestión de Foros</h2>
          <p className="grid-subtitle">Administra los foros de discusión del congreso</p>
        </div>
        
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar foros..."
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
              + Nuevo Foro
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
                <th>Creador</th>
                <th>Fecha Creación</th>
                <th>Mensajes</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredForos.map((foro) => (
                <tr key={foro.id_foro}>
                  <td>
                    <div className="cell-content">
                      <strong>{foro.titulo}</strong>
                      <p className="cell-subtitle">{foro.descripcion}</p>
                    </div>
                  </td>
                  <td>{getCreadorName(foro)}</td>
                  <td>{formatDate(foro.fecha_creacion)}</td>
                  <td>
                    <span className="status-badge info">
                      {foro.total_mensajes || 0}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${foro.activo ? 'success' : 'danger'}`}>
                      {foro.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {canViewMessages && (
                        <button
                          onClick={() => handleViewMessages(foro)}
                          className="btn-view"
                          title="Ver mensajes"
                        >
                          💬
                        </button>
                      )}
                      {canEdit(foro) && (
                        <button
                          onClick={() => handleEdit(foro)}
                          className="btn-edit"
                          title="Editar"
                        >
                          ✏️
                        </button>
                      )}
                      {canDelete(foro) && (
                        <button
                          onClick={() => handleDelete(foro)}
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
        <CreateForoModal
          onClose={() => setShowCreateModal(false)}
          onSave={() => {
            setShowCreateModal(false);
            loadForos(currentPage);
          }}
        />
      )}

      {/* Modal de Edición */}
      {showEditModal && selectedForo && (
        <EditForoModal
          foro={selectedForo}
          onClose={() => {
            setShowEditModal(false);
            setSelectedForo(null);
          }}
          onSave={() => {
            setShowEditModal(false);
            setSelectedForo(null);
            loadForos(currentPage);
          }}
        />
      )}

      {/* Modal de Mensajes */}
      {showMessagesModal && selectedForo && (
        <MessagesModal
          foro={selectedForo}
          onClose={() => {
            setShowMessagesModal(false);
            setSelectedForo(null);
          }}
        />
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && foroToDelete && (
        <div className="modal-overlay">
          <div className="modal delete-modal">
            <div className="modal-header">
              <h3>Confirmar Eliminación</h3>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro de que deseas eliminar el foro "{foroToDelete.titulo}"?</p>
              <p className="warning-text">Esta acción eliminará también todos los mensajes del foro y no se puede deshacer.</p>
            </div>
            <div className="modal-footer">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setForoToDelete(null);
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

// Modal de Creación de Foro
const CreateForoModal: React.FC<{
  onClose: () => void;
  onSave: () => void;
}> = ({ onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ForoCreacion>({
    titulo: '',
    descripcion: '',
    anio_evento: new Date().getFullYear(),
    imagen_url: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'anio_evento' ? parseInt(value) || new Date().getFullYear() : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await forosService.crearForo(formData);
      onSave();
    } catch (error) {
      console.error('Error al crear foro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal create-modal">
        <div className="modal-header">
          <h3>Crear Nuevo Foro</h3>
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
                placeholder="Describe el tema del foro y las reglas de participación"
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
              {loading ? 'Guardando...' : 'Crear Foro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal de Edición de Foro
const EditForoModal: React.FC<{
  foro: Foro;
  onClose: () => void;
  onSave: () => void;
}> = ({ foro, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: foro.titulo,
    descripcion: foro.descripcion,
    activo: foro.activo,
    anio_evento: foro.anio_evento || new Date().getFullYear(),
    imagen_url: foro.imagen_url || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              name === 'anio_evento' ? parseInt(value) || new Date().getFullYear() : 
              value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await forosService.actualizarForo(foro.id_foro, formData);
      onSave();
    } catch (error) {
      console.error('Error al actualizar foro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal edit-modal">
        <div className="modal-header">
          <h3>Editar Foro</h3>
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

            <div className="form-group full-width">
              <label className="form-checkbox">
                <input
                  type="checkbox"
                  name="activo"
                  checked={formData.activo}
                  onChange={handleInputChange}
                />
                <span className="checkmark"></span>
                Foro activo
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

// Modal de Mensajes del Foro
const MessagesModal: React.FC<{
  foro: Foro;
  onClose: () => void;
}> = ({ foro, onClose }) => {
  const { usuario } = useAuth();
  const [mensajes, setMensajes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  const loadMensajes = async () => {
    try {
      setLoading(true);
      const response = await forosService.obtenerMensajes(foro.id_foro);
      setMensajes(response.mensajes || []);
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
      setMensajes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMensajes();
  }, [foro.id_foro]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setSendingMessage(true);
      await forosService.crearMensaje(foro.id_foro, { contenido: newMessage });
      setNewMessage('');
      loadMensajes();
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleDeleteMessage = async (idMensaje: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este mensaje?')) {
      try {
        await forosService.eliminarMensaje(foro.id_foro, idMensaje);
        loadMensajes();
      } catch (error) {
        console.error('Error al eliminar mensaje:', error);
      }
    }
  };

  const canDeleteMessage = (mensaje: any) => {
    return usuario?.id_rol === 1 || // Admin
           mensaje.id_usuario === usuario?.id_usuario; // Autor del mensaje
  };

  return (
    <div className="modal-overlay">
      <div className="modal messages-modal">
        <div className="modal-header">
          <h3>Mensajes del Foro: {foro.titulo}</h3>
          <button onClick={onClose} className="modal-close">×</button>
        </div>
        
        <div className="modal-body messages-body">
          <div className="messages-container">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Cargando mensajes...</p>
              </div>
            ) : mensajes.length === 0 ? (
              <div className="empty-messages">
                <p>No hay mensajes en este foro aún.</p>
                <p>¡Sé el primero en participar!</p>
              </div>
            ) : (
              <div className="messages-list">
                {mensajes.map((mensaje) => (
                  <div key={mensaje.id_mensaje} className="message-item">
                    <div className="message-header">
                      <span className="message-author">
                        {mensaje.usuario ? `${mensaje.usuario.nombre} ${mensaje.usuario.apellido}` : 'Usuario'}
                      </span>
                      <span className="message-date">
                        {new Date(mensaje.fecha_mensaje).toLocaleString('es-ES')}
                      </span>
                      {canDeleteMessage(mensaje) && (
                        <button
                          onClick={() => handleDeleteMessage(mensaje.id_mensaje)}
                          className="btn-delete-message"
                          title="Eliminar mensaje"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                    <div className="message-content">
                      {mensaje.contenido}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Formulario para nuevo mensaje */}
          <form onSubmit={handleSendMessage} className="new-message-form">
            <div className="form-group">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className="form-textarea"
                rows={3}
                required
              />
            </div>
            <div className="form-actions">
              <button
                type="submit"
                className="btn-primary"
                disabled={sendingMessage || !newMessage.trim()}
              >
                {sendingMessage ? 'Enviando...' : 'Enviar Mensaje'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForosGrid;