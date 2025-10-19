import React, { useState, useEffect } from 'react';
import { forosService } from '../../api';
import type { Foro } from '../../types';
import { usePermisos } from '../../hooks/usePermisos';

const ForosPanel: React.FC = () => {
  const [foros, setForos] = useState<Foro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [foroEditando, setForoEditando] = useState<Foro | null>(null);
  const { esAdmin, esOrganizador } = usePermisos();

  const [formularioData, setFormularioData] = useState({
    titulo: '',
    descripcion: ''
  });

  useEffect(() => {
    cargarForos();
  }, []);

  const cargarForos = async () => {
    try {
      setLoading(true);
      const response = await forosService.obtenerForos();
      if (response.foros) {
        setForos(response.foros);
      }
    } catch (err) {
      setError('Error al cargar los foros');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const manejarCambioFormulario = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormularioData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (foroEditando) {
        await forosService.actualizarForo(foroEditando.id_foro, formularioData);
      } else {
        await forosService.crearForo(formularioData);
      }
      
      await cargarForos();
      resetearFormulario();
      alert(foroEditando ? 'Foro actualizado exitosamente' : 'Foro creado exitosamente');
    } catch (err) {
      console.error('Error al guardar foro:', err);
      alert('Error al guardar el foro');
    }
  };

  const manejarEditar = (foro: Foro) => {
    setForoEditando(foro);
    setFormularioData({
      titulo: foro.titulo,
      descripcion: foro.descripcion
    });
    setMostrarFormulario(true);
  };

  const resetearFormulario = () => {
    setFormularioData({
      titulo: '',
      descripcion: ''
    });
    setForoEditando(null);
    setMostrarFormulario(false);
  };

  const manejarEliminar = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este foro?')) {
      try {
        await forosService.eliminarForo(id);
        await cargarForos();
        alert('Foro eliminado exitosamente');
      } catch (err) {
        console.error('Error al eliminar foro:', err);
        alert('Error al eliminar el foro');
      }
    }
  };

  const manejarCambiarEstado = async (id: number, activo: boolean) => {
    try {
      await forosService.actualizarForo(id, { activo });
      await cargarForos();
      alert(`Foro ${activo ? 'activado' : 'desactivado'} exitosamente`);
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      alert('Error al cambiar el estado del foro');
    }
  };



  const puedeGestionar = esAdmin() || esOrganizador();

  if (loading) {
    return (
      <div className="foros-panel">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando foros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="foros-panel">
      <div className="page-header">
        <h2 className="page-title">Gestión de Foros</h2>
        <p className="page-subtitle">Administra los foros y conferencias del Congreso Tecnológico</p>
      </div>

      <div className="panel-content">
        {/* Stats Cards */}
        <div className="stats-row">
          <div className="stat-card blue">
            <div className="stat-icon">🎤</div>
            <div className="stat-info">
              <h3 className="stat-number">{foros.length}</h3>
              <p className="stat-label">Total Foros</p>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3 className="stat-number">{foros.filter(f => f.activo).length}</h3>
              <p className="stat-label">Activos</p>
            </div>
          </div>
          <div className="stat-card orange">
            <div className="stat-icon">💬</div>
            <div className="stat-info">
              <h3 className="stat-number">{foros.reduce((sum, f) => sum + (f.total_mensajes || 0), 0)}</h3>
              <p className="stat-label">Total Mensajes</p>
            </div>
          </div>
          <div className="stat-card purple">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <h3 className="stat-number">{foros.filter(f => !f.activo).length}</h3>
              <p className="stat-label">Inactivos</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {puedeGestionar && (
          <div className="action-buttons">
            <button 
              className="btn primary"
              onClick={() => setMostrarFormulario(true)}
            >
              ➕ Nuevo Foro
            </button>
            <button className="btn secondary">
              📊 Exportar Lista
            </button>
            <button className="btn secondary">
              📧 Notificar Ponentes
            </button>
          </div>
        )}

        {/* Formulario */}
        {mostrarFormulario && puedeGestionar && (
          <div className="form-modal">
            <div className="form-container">
              <div className="form-header">
                <h3>{foroEditando ? 'Editar Foro' : 'Nuevo Foro'}</h3>
                <button onClick={resetearFormulario} className="close-btn">✕</button>
              </div>
              
              <form onSubmit={manejarSubmit} className="form">
                <div className="form-group">
                  <label htmlFor="titulo">Título del Foro *</label>
                  <input
                    type="text"
                    id="titulo"
                    name="titulo"
                    value={formularioData.titulo}
                    onChange={manejarCambioFormulario}
                    placeholder="Ingresa el título del foro de discusión"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="descripcion">Descripción *</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={formularioData.descripcion}
                    onChange={manejarCambioFormulario}
                    rows={4}
                    placeholder="Describe el tema del foro y las reglas de participación"
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="button" onClick={resetearFormulario} className="btn secondary">
                    Cancelar
                  </button>
                  <button type="submit" className="btn primary">
                    {foroEditando ? 'Actualizar' : 'Crear'} Foro
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lista de Foros */}
        <div className="data-section">
          <div className="section-header">
            <h3>Lista de Foros</h3>
          </div>

          {error ? (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={cargarForos} className="btn primary">Reintentar</button>
            </div>
          ) : foros.length === 0 ? (
            <div className="empty-state">
              <p>No hay foros registrados</p>
              {puedeGestionar && (
                <button onClick={() => setMostrarFormulario(true)} className="btn primary">
                  Crear Primer Foro
                </button>
              )}
            </div>
          ) : (
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Descripción</th>
                    <th>Creador</th>
                    <th>Fecha Creación</th>
                    <th>Mensajes</th>
                    <th>Estado</th>
                    {puedeGestionar && <th>Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {foros.map((foro) => (
                    <tr key={foro.id_foro}>
                      <td>
                        <div className="cell-content">
                          <strong>{foro.titulo}</strong>
                        </div>
                      </td>
                      <td>
                        <div className="cell-content">
                          <small>{foro.descripcion.substring(0, 80)}...</small>
                        </div>
                      </td>
                      <td>{foro.usuario_creador?.nombre || 'Usuario'}</td>
                      <td>{new Date(foro.fecha_creacion).toLocaleDateString()}</td>
                      <td>
                        <span className="badge secondary">
                          {foro.total_mensajes || 0}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${foro.activo ? 'success' : 'danger'}`}>
                          {foro.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      {puedeGestionar && (
                        <td>
                          <div className="action-buttons">
                            <button 
                              onClick={() => manejarEditar(foro)}
                              className="btn small secondary"
                              title="Editar"
                            >
                              ✏️
                            </button>
                            <button 
                              onClick={() => manejarCambiarEstado(foro.id_foro, !foro.activo)}
                              className={`btn small ${foro.activo ? 'warning' : 'success'}`}
                              title={foro.activo ? 'Desactivar' : 'Activar'}
                            >
                              {foro.activo ? '⏸️' : '▶️'}
                            </button>
                            <button 
                              onClick={() => manejarEliminar(foro.id_foro)}
                              className="btn small danger"
                              title="Eliminar"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForosPanel;