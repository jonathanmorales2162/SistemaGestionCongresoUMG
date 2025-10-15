import React from 'react';

const AsistenciaPanel: React.FC = () => {
  return (
    <div className="asistencia-panel">
      <div className="page-header">
        <h2 className="page-title">Registro y Reportes de Asistencia</h2>
        <p className="page-subtitle">Controla la asistencia de participantes en tiempo real</p>
      </div>

      <div className="panel-content">
        {/* Stats Cards */}
        <div className="stats-row">
          <div className="stat-card green">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3 className="stat-number">156</h3>
              <p className="stat-label">Presentes Hoy</p>
            </div>
          </div>
          <div className="stat-card blue">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3 className="stat-number">189</h3>
              <p className="stat-label">Total Esperados</p>
            </div>
          </div>
          <div className="stat-card orange">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3 className="stat-number">82%</h3>
              <p className="stat-label">Tasa Asistencia</p>
            </div>
          </div>
          <div className="stat-card purple">
            <div className="stat-icon">🕐</div>
            <div className="stat-info">
              <h3 className="stat-number">33</h3>
              <p className="stat-label">Llegadas Tardías</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="btn primary">
            📱 Registrar Asistencia
          </button>
          <button className="btn secondary">
            📊 Generar Reporte
          </button>
          <button className="btn tertiary">
            📧 Notificar Ausentes
          </button>
          <button className="btn quaternary">
            🔍 Buscar Participante
          </button>
        </div>

        {/* Placeholder Content */}
        <div className="placeholder-content">
          <div className="placeholder-icon">✅</div>
          <h3 className="placeholder-title">Sistema de Asistencia</h3>
          <p className="placeholder-description">
            Este módulo permitirá gestionar la asistencia de participantes, incluyendo:
          </p>
          <ul className="placeholder-features">
            <li>✅ Registro de entrada y salida</li>
            <li>✅ Escaneo de códigos QR/códigos de barras</li>
            <li>✅ Control de asistencia por sesiones</li>
            <li>✅ Reportes de asistencia en tiempo real</li>
            <li>✅ Notificaciones automáticas a ausentes</li>
            <li>✅ Estadísticas de participación</li>
            <li>✅ Exportación de datos de asistencia</li>
            <li>✅ Integración con sistema de certificados</li>
            <li>✅ Dashboard de monitoreo en vivo</li>
            <li>✅ Alertas de capacidad máxima</li>
          </ul>
          <div className="placeholder-note">
            <strong>Estado:</strong> En desarrollo - Funcionalidad próximamente disponible
          </div>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <h4 className="section-title">Resumen del Día</h4>
          <div className="stats-grid">
            <div className="quick-stat">
              <span className="quick-stat-label">Primera Sesión</span>
              <span className="quick-stat-value">142/189</span>
            </div>
            <div className="quick-stat">
              <span className="quick-stat-label">Segunda Sesión</span>
              <span className="quick-stat-value">138/189</span>
            </div>
            <div className="quick-stat">
              <span className="quick-stat-label">Tercera Sesión</span>
              <span className="quick-stat-value">156/189</span>
            </div>
            <div className="quick-stat">
              <span className="quick-stat-label">Promedio</span>
              <span className="quick-stat-value">145/189</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsistenciaPanel;