import React from 'react';

const InscripcionesPanel: React.FC = () => {
  return (
    <div className="inscripciones-panel">
      <div className="page-header">
        <h2 className="page-title">Gestión de Inscripciones</h2>
        <p className="page-subtitle">Administra las inscripciones al Congreso Tecnológico UMG 2025</p>
      </div>

      <div className="panel-content">
        {/* Stats Cards */}
        <div className="stats-row">
          <div className="stat-card blue">
            <div className="stat-icon">📝</div>
            <div className="stat-info">
              <h3 className="stat-number">245</h3>
              <p className="stat-label">Total Inscripciones</p>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3 className="stat-number">189</h3>
              <p className="stat-label">Confirmadas</p>
            </div>
          </div>
          <div className="stat-card orange">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3 className="stat-number">34</h3>
              <p className="stat-label">Pendientes</p>
            </div>
          </div>
          <div className="stat-card red">
            <div className="stat-icon">❌</div>
            <div className="stat-info">
              <h3 className="stat-number">22</h3>
              <p className="stat-label">Canceladas</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="btn primary">
            ➕ Nueva Inscripción
          </button>
          <button className="btn secondary">
            📊 Exportar Lista
          </button>
          <button className="btn tertiary">
            📧 Enviar Notificaciones
          </button>
          <button className="btn quaternary">
            🔍 Buscar Inscripción
          </button>
        </div>

        {/* Placeholder Content */}
        <div className="placeholder-content">
          <div className="placeholder-icon">📝</div>
          <h3 className="placeholder-title">Panel de Inscripciones</h3>
          <p className="placeholder-description">
            Este módulo permitirá gestionar todas las inscripciones al congreso, incluyendo:
          </p>
          <ul className="placeholder-features">
            <li>✅ Registro de nuevos participantes</li>
            <li>✅ Validación de datos de inscripción</li>
            <li>✅ Gestión de estados (pendiente, confirmada, cancelada)</li>
            <li>✅ Exportación de listas de participantes</li>
            <li>✅ Envío de notificaciones automáticas</li>
            <li>✅ Búsqueda y filtrado avanzado</li>
            <li>✅ Reportes estadísticos</li>
            <li>✅ Integración con sistema de pagos</li>
          </ul>
          <div className="placeholder-note">
            <strong>Estado:</strong> En desarrollo - Funcionalidad próximamente disponible
          </div>
        </div>
      </div>
    </div>
  );
};

export default InscripcionesPanel;