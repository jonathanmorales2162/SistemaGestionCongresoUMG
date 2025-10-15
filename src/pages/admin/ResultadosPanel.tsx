import React from 'react';

const ResultadosPanel: React.FC = () => {
  return (
    <div className="resultados-panel">
      <div className="page-header">
        <h2 className="page-title">Publicación de Resultados</h2>
        <p className="page-subtitle">Gestiona la publicación y distribución de resultados del congreso</p>
      </div>

      <div className="panel-content">
        {/* Stats Cards */}
        <div className="stats-row">
          <div className="stat-card blue">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3 className="stat-number">12</h3>
              <p className="stat-label">Resultados Publicados</p>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3 className="stat-number">8</h3>
              <p className="stat-label">Aprobados</p>
            </div>
          </div>
          <div className="stat-card orange">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3 className="stat-number">4</h3>
              <p className="stat-label">Pendientes</p>
            </div>
          </div>
          <div className="stat-card purple">
            <div className="stat-icon">👁️</div>
            <div className="stat-info">
              <h3 className="stat-number">1,245</h3>
              <p className="stat-label">Visualizaciones</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="btn primary">
            📊 Publicar Resultado
          </button>
          <button className="btn secondary">
            📧 Notificar Participantes
          </button>
          <button className="btn tertiary">
            📄 Generar Reporte
          </button>
          <button className="btn quaternary">
            ⚙️ Configurar Publicación
          </button>
        </div>

        {/* Placeholder Content */}
        <div className="placeholder-content">
          <div className="placeholder-icon">📊</div>
          <h3 className="placeholder-title">Sistema de Resultados</h3>
          <p className="placeholder-description">
            Este módulo permitirá gestionar la publicación de resultados del congreso, incluyendo:
          </p>
          <ul className="placeholder-features">
            <li>✅ Publicación de resultados por categorías</li>
            <li>✅ Gestión de ganadores y menciones</li>
            <li>✅ Notificaciones automáticas a participantes</li>
            <li>✅ Galería de proyectos destacados</li>
            <li>✅ Estadísticas de participación</li>
            <li>✅ Exportación de reportes</li>
            <li>✅ Sistema de comentarios y feedback</li>
            <li>✅ Integración con redes sociales</li>
            <li>✅ Archivo histórico de resultados</li>
            <li>✅ Panel de control de visibilidad</li>
          </ul>
          <div className="placeholder-note">
            <strong>Estado:</strong> En desarrollo - Funcionalidad próximamente disponible
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