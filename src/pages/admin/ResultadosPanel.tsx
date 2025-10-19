import React, { useState, useEffect } from 'react';
import { resultadosService } from '../../api';
import { useAuth } from '../../context/AuthContext';
import type { Resultado } from '../../types/Resultado';

const ResultadosPanel: React.FC = () => {
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [estadisticas, setEstadisticas] = useState({
    totalResultados: 0,
    publicados: 0,
    pendientes: 0,
    visualizaciones: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { usuario } = useAuth();

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [resultadosData, estadisticasData] = await Promise.all([
        resultadosService.obtenerResultados(),
        resultadosService.obtenerEstadisticas()
      ]);
      
      setResultados(resultadosData.resultados);
      setEstadisticas(estadisticasData);
    } catch (err) {
      setError('Error al cargar los datos de resultados');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublicarResultado = async (id: number) => {
    try {
      await resultadosService.publicarResultado(id);
      await cargarDatos(); // Recargar datos
    } catch (err) {
      setError('Error al publicar resultado');
      console.error('Error:', err);
    }
  };

  const handleNotificarParticipantes = async (id: number) => {
    try {
      await resultadosService.notificarParticipantes(id);
      alert('Notificaciones enviadas exitosamente');
    } catch (err) {
      setError('Error al enviar notificaciones');
      console.error('Error:', err);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando resultados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="resultados-panel">
      <div className="page-header">
        <h2 className="page-title">Publicación de Resultados</h2>
        <p className="page-subtitle">Gestiona la publicación y distribución de resultados del congreso</p>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="panel-content">
        {/* Stats Cards */}
        <div className="stats-row">
          <div className="stat-card blue">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3 className="stat-number">{estadisticas.totalResultados}</h3>
              <p className="stat-label">Total Resultados</p>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3 className="stat-number">{estadisticas.publicados}</h3>
              <p className="stat-label">Publicados</p>
            </div>
          </div>
          <div className="stat-card orange">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3 className="stat-number">{estadisticas.pendientes}</h3>
              <p className="stat-label">Pendientes</p>
            </div>
          </div>
          <div className="stat-card purple">
            <div className="stat-icon">👁️</div>
            <div className="stat-info">
              <h3 className="stat-number">{estadisticas.visualizaciones}</h3>
              <p className="stat-label">Visualizaciones</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            className="btn btn-primary"
            onClick={() => {/* TODO: Implementar modal de creación */}}
          >
            <span className="btn-icon">📤</span>
            Publicar Nuevo Resultado
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => {/* TODO: Implementar notificación masiva */}}
          >
            <span className="btn-icon">📧</span>
            Notificar Participantes
          </button>
          <button 
            className="btn btn-outline"
            onClick={() => {/* TODO: Implementar generación de reporte */}}
          >
            <span className="btn-icon">📊</span>
            Generar Reporte
          </button>
        </div>

        {/* Tabla de Resultados */}
        <div className="results-table-section">
          <h3>Resultados Recientes</h3>
          <div className="table-container">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Categoría</th>
                  <th>Ganador</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {resultados.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="no-data">
                      No hay resultados disponibles
                    </td>
                  </tr>
                ) : (
                  resultados.map((resultado) => (
                    <tr key={resultado.id_resultado}>
                      <td>{resultado.categoria?.nombre || 'Sin categoría'}</td>
                      <td>{resultado.ganadores[0]?.usuario?.nombre && resultado.ganadores[0]?.usuario?.apellido 
                          ? `${resultado.ganadores[0].usuario.nombre} ${resultado.ganadores[0].usuario.apellido}`
                          : 'Sin ganador'}</td>
                      <td>
                        <span className={`status-badge ${resultado.publicado ? 'published' : 'draft'}`}>
                          {resultado.publicado ? 'Publicado' : 'Borrador'}
                        </span>
                      </td>
                      <td>{new Date(resultado.fecha_publicacion || resultado.creado_en).toLocaleDateString()}</td>
                      <td>
                        <div className="action-buttons-inline">
                          {!resultado.publicado && (
                            <button
                              className="btn-small btn-success"
                              onClick={() => handlePublicarResultado(resultado.id_resultado)}
                              title="Publicar resultado"
                            >
                              ✅
                            </button>
                          )}
                          <button
                            className="btn-small btn-info"
                            onClick={() => handleNotificarParticipantes(resultado.id_resultado)}
                            title="Notificar participantes"
                          >
                            📧
                          </button>
                          <button
                            className="btn-small btn-warning"
                            onClick={() => {/* TODO: Implementar edición */}}
                            title="Editar resultado"
                          >
                            ✏️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results Categories */}
        <div className="categories-section">
          <h4 className="section-title">Categorías de Resultados</h4>
          <div className="categories-grid">
            <div className="category-card">
              <div className="category-icon">🏆</div>
              <h5 className="category-title">Mejor Proyecto</h5>
              <p className="category-status">Publicado</p>
              <div className="category-stats">
                <span>3 ganadores</span>
                <span>245 votos</span>
              </div>
            </div>
            
            <div className="category-card">
              <div className="category-icon">💡</div>
              <h5 className="category-title">Innovación</h5>
              <p className="category-status">Pendiente</p>
              <div className="category-stats">
                <span>En evaluación</span>
                <span>189 participantes</span>
              </div>
            </div>
            
            <div className="category-card">
              <div className="category-icon">🎯</div>
              <h5 className="category-title">Impacto Social</h5>
              <p className="category-status">Publicado</p>
              <div className="category-stats">
                <span>2 ganadores</span>
                <span>156 votos</span>
              </div>
            </div>
            
            <div className="category-card">
              <div className="category-icon">🚀</div>
              <h5 className="category-title">Startup Pitch</h5>
              <p className="category-status">En revisión</p>
              <div className="category-stats">
                <span>5 finalistas</span>
                <span>89 participantes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="activity-section">
          <h4 className="section-title">Actividad Reciente</h4>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">🏆</div>
              <div className="activity-content">
                <p className="activity-text">Resultado publicado: "Mejor Proyecto de IA"</p>
                <span className="activity-time">Hace 2 horas</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">📧</div>
              <div className="activity-content">
                <p className="activity-text">Notificaciones enviadas a 245 participantes</p>
                <span className="activity-time">Hace 4 horas</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">📊</div>
              <div className="activity-content">
                <p className="activity-text">Reporte generado: "Estadísticas de Participación"</p>
                <span className="activity-time">Hace 6 horas</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultadosPanel;