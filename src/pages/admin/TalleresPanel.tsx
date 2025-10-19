import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { talleresService, categoriasService } from '../../api';
import type { Taller, Categoria } from '../../types';
import { usePermisos } from '../../hooks/usePermisos';

const TalleresPanel: React.FC = () => {
  const [talleres, setTalleres] = useState<Taller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [tallerEditando, setTallerEditando] = useState<Taller | null>(null);
  const { usuario } = useAuth();
  const { esAdmin, esOrganizador } = usePermisos();

  const [formularioData, setFormularioData] = useState({
    titulo: '',
    descripcion: '',
    instructor: '',
    horario: '',
    cupo: 0,
    duracion: 0,
    id_categoria: 0
  });

  useEffect(() => {
    cargarTalleres();
  }, []);

  const cargarTalleres = async () => {
    try {
      setLoading(true);
      const response = await talleresService.obtenerTalleres();
      if (response.talleres) {
        setTalleres(response.talleres);
      }
    } catch (err) {
      setError('Error al cargar los talleres');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const manejarCambioFormulario = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormularioData(prev => ({
      ...prev,
      [name]: (name === 'cupo' || name === 'id_categoria' || name === 'duracion') ? parseInt(value) || 0 : value
    }));
  };

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (tallerEditando) {
        await talleresService.actualizarTaller(tallerEditando.id_taller, formularioData);
      } else {
        await talleresService.crearTaller(formularioData);
      }
      
      await cargarTalleres();
      resetearFormulario();
      alert(tallerEditando ? 'Taller actualizado exitosamente' : 'Taller creado exitosamente');
    } catch (err) {
      console.error('Error al guardar taller:', err);
      alert('Error al guardar el taller');
    }
  };

  const manejarEditar = (taller: Taller) => {
    setTallerEditando(taller);
    setFormularioData({
      titulo: taller.titulo,
      descripcion: taller.descripcion,
      instructor: taller.instructor || '',
      horario: taller.horario,
      cupo: taller.cupo,
      duracion: taller.duracion || 0,
      id_categoria: taller.id_categoria
    });
    setMostrarFormulario(true);
  };

  const manejarEliminar = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este taller?')) {
      try {
        await talleresService.eliminarTaller(id);
        await cargarTalleres();
        alert('Taller eliminado exitosamente');
      } catch (err) {
        console.error('Error al eliminar taller:', err);
        alert('Error al eliminar el taller');
      }
    }
  };

  const resetearFormulario = () => {
    setFormularioData({
      titulo: '',
      descripcion: '',
      instructor: '',
      horario: '',
      cupo: 0,
      duracion: 0,
      id_categoria: 0
    });
    setTallerEditando(null);
    setMostrarFormulario(false);
  };

  const puedeGestionar = esAdmin() || esOrganizador();

  if (loading) {
    return (
      <div className="talleres-panel">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando talleres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="talleres-panel">
      <div className="page-header">
        <h2 className="page-title">Gestión de Talleres</h2>
        <p className="page-subtitle">Administra los talleres del Congreso Tecnológico</p>
      </div>

      <div className="panel-content">
        {/* Stats Cards */}
        <div className="stats-row">
          <div className="stat-card blue">
            <div className="stat-icon">🎯</div>
            <div className="stat-info">
              <h3 className="stat-number">{talleres.length}</h3>
              <p className="stat-label">Total Talleres</p>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3 className="stat-number">{talleres.filter(t => (t.disponibles || 0) > 0).length}</h3>
              <p className="stat-label">Con Cupos</p>
            </div>
          </div>
          <div className="stat-card orange">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3 className="stat-number">{talleres.reduce((sum, t) => sum + t.cupo, 0)}</h3>
              <p className="stat-label">Cupos Totales</p>
            </div>
          </div>
          <div className="stat-card purple">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3 className="stat-number">{talleres.reduce((sum, t) => sum + (t.inscritos || 0), 0)}</h3>
              <p className="stat-label">Total Inscritos</p>
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
              ➕ Nuevo Taller
            </button>
            <button className="btn secondary">
              📊 Exportar Lista
            </button>
            <button className="btn secondary">
              📧 Notificar Participantes
            </button>
          </div>
        )}

        {/* Formulario */}
        {mostrarFormulario && puedeGestionar && (
          <div className="form-modal">
            <div className="form-container">
              <div className="form-header">
                <h3>{tallerEditando ? 'Editar Taller' : 'Nuevo Taller'}</h3>
                <button onClick={resetearFormulario} className="close-btn">✕</button>
              </div>
              
              <form onSubmit={manejarSubmit} className="form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="titulo">Título *</label>
                    <input
                      type="text"
                      id="titulo"
                      name="titulo"
                      value={formularioData.titulo}
                      onChange={manejarCambioFormulario}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="id_categoria">Categoría *</label>
                    <select
                      id="id_categoria"
                      name="id_categoria"
                      value={formularioData.id_categoria}
                      onChange={manejarCambioFormulario}
                      required
                    >
                      <option value="0">Seleccionar categoría</option>
                      <option value="1">Programación</option>
                      <option value="2">Inteligencia Artificial</option>
                      <option value="3">Ciberseguridad</option>
                      <option value="4">Desarrollo Web</option>
                      <option value="5">Bases de Datos</option>
                      <option value="6">DevOps</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="descripcion">Descripción *</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={formularioData.descripcion}
                    onChange={manejarCambioFormulario}
                    rows={3}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="instructor">Instructor *</label>
                    <input
                      type="text"
                      id="instructor"
                      name="instructor"
                      value={formularioData.instructor}
                      onChange={manejarCambioFormulario}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="horario">Fecha y Hora *</label>
                    <input
                      type="datetime-local"
                      id="horario"
                      name="horario"
                      value={formularioData.horario}
                      onChange={manejarCambioFormulario}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="duracion">Duración (minutos) *</label>
                    <input
                      type="number"
                      id="duracion"
                      name="duracion"
                      value={formularioData.duracion}
                      onChange={manejarCambioFormulario}
                      placeholder="ej: 120"
                      min="1"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cupo">Cupo *</label>
                    <input
                      type="number"
                      id="cupo"
                      name="cupo"
                      value={formularioData.cupo}
                      onChange={manejarCambioFormulario}
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" onClick={resetearFormulario} className="btn secondary">
                    Cancelar
                  </button>
                  <button type="submit" className="btn primary">
                    {tallerEditando ? 'Actualizar' : 'Crear'} Taller
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lista de Talleres */}
        <div className="data-section">
          <div className="section-header">
            <h3>Lista de Talleres</h3>
          </div>

          {error ? (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={cargarTalleres} className="btn primary">Reintentar</button>
            </div>
          ) : talleres.length === 0 ? (
            <div className="empty-state">
              <p>No hay talleres registrados</p>
              {puedeGestionar && (
                <button onClick={() => setMostrarFormulario(true)} className="btn primary">
                  Crear Primer Taller
                </button>
              )}
            </div>
          ) : (
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Instructor</th>
                    <th>Horario</th>
                    <th>Duración</th>
                    <th>Cupo</th>
                    <th>Inscritos</th>
                    <th>Categoría</th>
                    {puedeGestionar && <th>Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {talleres.map((taller) => (
                    <tr key={taller.id_taller}>
                      <td>
                        <div className="cell-content">
                          <strong>{taller.titulo}</strong>
                          <small>{taller.descripcion.substring(0, 50)}...</small>
                        </div>
                      </td>
                      <td>{taller.instructor || 'No asignado'}</td>
                      <td>{new Date(taller.horario).toLocaleString()}</td>
                      <td>
                        <span className="badge secondary">
                          {taller.duracion ? `${taller.duracion} min` : 'No especificada'}
                        </span>
                      </td>
                      <td>
                        <span className="badge info">
                          {taller.cupo}
                        </span>
                      </td>
                      <td>
                        <span className="badge success">
                          {taller.inscritos || 0}
                        </span>
                      </td>
                      <td>
                        <span className="badge info">{taller.categoria?.nombre || 'Sin categoría'}</span>
                      </td>
                      {puedeGestionar && (
                        <td>
                          <div className="action-buttons">
                            <button 
                              onClick={() => manejarEditar(taller)}
                              className="btn small secondary"
                              title="Editar"
                            >
                              ✏️
                            </button>
                            <button 
                              onClick={() => manejarEliminar(taller.id_taller)}
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

export default TalleresPanel;