import React, { useState, useEffect } from 'react';
import { competenciasService } from '../../api';
import type { Competencia } from '../../types';
import { usePermisos } from '../../hooks/usePermisos';

const CompetenciasPanel: React.FC = () => {
  const [competencias, setCompetencias] = useState<Competencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [competenciaEditando, setCompetenciaEditando] = useState<Competencia | null>(null);
  const { esAdmin, esOrganizador } = usePermisos();

  const [formularioData, setFormularioData] = useState({
    titulo: '',
    descripcion: '',
    horario: '',
    cupo: 0,
    id_categoria: 0
  });

  useEffect(() => {
    cargarCompetencias();
  }, []);

  const cargarCompetencias = async () => {
    try {
      setLoading(true);
      const response = await competenciasService.obtenerCompetencias();
      if (response.competencias) {
        setCompetencias(response.competencias);
      }
    } catch (err) {
      setError('Error al cargar las competencias');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const manejarCambioFormulario = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormularioData(prev => ({
      ...prev,
      [name]: (name === 'cupo' || name === 'id_categoria') ? parseInt(value) || 0 : value
    }));
  };

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (competenciaEditando) {
        await competenciasService.actualizarCompetencia(competenciaEditando.id_competencia, formularioData);
      } else {
        await competenciasService.crearCompetencia(formularioData);
      }
      
      await cargarCompetencias();
      resetearFormulario();
      alert(competenciaEditando ? 'Competencia actualizada exitosamente' : 'Competencia creada exitosamente');
    } catch (err) {
      console.error('Error al guardar competencia:', err);
      alert('Error al guardar la competencia');
    }
  };

  const manejarEditar = (competencia: Competencia) => {
    setCompetenciaEditando(competencia);
    setFormularioData({
      titulo: competencia.titulo,
      descripcion: competencia.descripcion,
      horario: competencia.horario,
      cupo: competencia.cupo,
      id_categoria: competencia.id_categoria
    });
    setMostrarFormulario(true);
  };

  const manejarEliminar = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta competencia?')) {
      try {
        await competenciasService.eliminarCompetencia(id);
        await cargarCompetencias();
        alert('Competencia eliminada exitosamente');
      } catch (err) {
        console.error('Error al eliminar competencia:', err);
        alert('Error al eliminar la competencia');
      }
    }
  };

  const resetearFormulario = () => {
    setFormularioData({
      titulo: '',
      descripcion: '',
      horario: '',
      cupo: 0,
      id_categoria: 0
    });
    setCompetenciaEditando(null);
    setMostrarFormulario(false);
  };

  const puedeGestionar = esAdmin() || esOrganizador();

  if (loading) {
    return (
      <div className="competencias-panel">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando competencias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="competencias-panel">
      <div className="page-header">
        <h2 className="page-title">Gestión de Competencias</h2>
        <p className="page-subtitle">Administra las competencias del Congreso Tecnológico</p>
      </div>

      <div className="panel-content">
        {/* Stats Cards */}
        <div className="stats-row">
          <div className="stat-card blue">
            <div className="stat-icon">🏆</div>
            <div className="stat-info">
              <h3 className="stat-number">{competencias.length}</h3>
              <p className="stat-label">Total Competencias</p>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon">🎯</div>
            <div className="stat-info">
              <h3 className="stat-number">{competencias.filter(c => new Date(c.horario) > new Date()).length}</h3>
              <p className="stat-label">Próximas</p>
            </div>
          </div>
          <div className="stat-card orange">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3 className="stat-number">{competencias.reduce((sum, c) => sum + c.cupo, 0)}</h3>
              <p className="stat-label">Cupos Totales</p>
            </div>
          </div>
          <div className="stat-card purple">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <h3 className="stat-number">{competencias.reduce((sum, c) => sum + (c.inscritos || 0), 0)}</h3>
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
              ➕ Nueva Competencia
            </button>
            <button className="btn secondary">
              📊 Exportar Lista
            </button>
            <button className="btn secondary">
              🏅 Gestionar Resultados
            </button>
          </div>
        )}

        {/* Formulario */}
        {mostrarFormulario && puedeGestionar && (
          <div className="form-modal">
            <div className="form-container">
              <div className="form-header">
                <h3>{competenciaEditando ? 'Editar Competencia' : 'Nueva Competencia'}</h3>
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
                      <option value="2">Hackathon</option>
                      <option value="3">Algoritmos</option>
                      <option value="4">Desarrollo Web</option>
                      <option value="5">Inteligencia Artificial</option>
                      <option value="6">Ciberseguridad</option>
                      <option value="7">Innovación</option>
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
                    <label htmlFor="cupo">Cupo Máximo *</label>
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
                    {competenciaEditando ? 'Actualizar' : 'Crear'} Competencia
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lista de Competencias */}
        <div className="data-section">
          <div className="section-header">
            <h3>Lista de Competencias</h3>
          </div>

          {error ? (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={cargarCompetencias} className="btn primary">Reintentar</button>
            </div>
          ) : competencias.length === 0 ? (
            <div className="empty-state">
              <p>No hay competencias registradas</p>
              {puedeGestionar && (
                <button onClick={() => setMostrarFormulario(true)} className="btn primary">
                  Crear Primera Competencia
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
                    <th>Categoría</th>
                    <th>Horario</th>
                    <th>Cupo</th>
                    <th>Inscritos</th>
                    {puedeGestionar && <th>Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {competencias.map((competencia) => {
                    return (
                      <tr key={competencia.id_competencia}>
                        <td>
                          <div className="cell-content">
                            <strong>{competencia.titulo}</strong>
                          </div>
                        </td>
                        <td>
                          <div className="cell-content">
                            <small>{competencia.descripcion.substring(0, 60)}...</small>
                          </div>
                        </td>
                        <td>
                          <span className="badge info">{competencia.categoria?.nombre || 'Sin categoría'}</span>
                        </td>
                        <td>{new Date(competencia.horario).toLocaleString()}</td>
                        <td>
                          <span className="badge secondary">
                            {competencia.cupo}
                          </span>
                        </td>
                        <td>
                          <span className="badge success">
                            {competencia.inscritos || 0}
                          </span>
                        </td>
                        {puedeGestionar && (
                          <td>
                            <div className="action-buttons">
                              <button 
                                onClick={() => manejarEditar(competencia)}
                                className="btn small secondary"
                                title="Editar"
                              >
                                ✏️
                              </button>
                              <button 
                                onClick={() => manejarEliminar(competencia.id_competencia)}
                                className="btn small danger"
                                title="Eliminar"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompetenciasPanel;