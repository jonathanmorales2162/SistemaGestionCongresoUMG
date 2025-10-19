import React from 'react';
import { useAuth } from '../../context/AuthContext';

const DashboardHome: React.FC = () => {
  const { usuario } = useAuth();

  const statsCards = [
    {
      title: 'Total Inscripciones',
      value: '245',
      icon: '📝',
      color: 'blue',
      change: '+12%'
    },
    {
      title: 'Asistentes Confirmados',
      value: '189',
      icon: '✅',
      color: 'green',
      change: '+8%'
    },
    {
      title: 'Diplomas Generados',
      value: '156',
      icon: '🎓',
      color: 'purple',
      change: '+15%'
    },
    {
      title: 'Conferencias Activas',
      value: '12',
      icon: '🎤',
      color: 'orange',
      change: '+2'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'Nueva inscripción registrada',
      user: 'María González',
      time: 'Hace 5 minutos',
      type: 'inscription'
    },
    {
      id: 2,
      action: 'Diploma generado y enviado',
      user: 'Carlos Rodríguez',
      time: 'Hace 15 minutos',
      type: 'diploma'
    },
    {
      id: 3,
      action: 'Asistencia confirmada',
      user: 'Ana Martínez',
      time: 'Hace 30 minutos',
      type: 'attendance'
    },
    {
      id: 4,
      action: 'Resultado publicado',
      user: 'Sistema',
      time: 'Hace 1 hora',
      type: 'result'
    }
  ];

  return (
    <div className="dashboard-home">
      {/* Welcome Section */}
      <div className="welcome-section">
        <h2 className="welcome-title">
          ¡Bienvenido, {usuario?.nombre}! 👋
        </h2>
        <p className="page-subtitle">
            Aquí tienes un resumen de la actividad del Congreso Tecnológico UMG 2025
          </p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {statsCards.map((stat, index) => (
          <div key={index} className={`stat-card ${stat.color}`}>
            <div className="stat-header">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-change positive">{stat.change}</div>
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-title">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Recent Activities */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Actividad Reciente</h3>
            <button className="card-action">Ver todo</button>
          </div>
          <div className="card-content">
            <div className="activities-list">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">
                    {activity.type === 'inscription' && '📝'}
                    {activity.type === 'diploma' && '🎓'}
                    {activity.type === 'attendance' && '✅'}
                    {activity.type === 'result' && '📊'}
                  </div>
                  <div className="activity-content">
                    <p className="activity-action">{activity.action}</p>
                    <p className="activity-details">
                      <span className="activity-user">{activity.user}</span>
                      <span className="activity-time">{activity.time}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Acciones Rápidas</h3>
          </div>
          <div className="card-content">
            <div className="quick-actions">
              <button className="quick-action-btn primary">
                <span className="action-icon">➕</span>
                Nueva Inscripción
              </button>
              <button className="quick-action-btn secondary">
                <span className="action-icon">📊</span>
                Generar Reporte
              </button>
              <button className="quick-action-btn tertiary">
                <span className="action-icon">📧</span>
                Enviar Notificación
              </button>
              <button className="quick-action-btn quaternary">
                <span className="action-icon">🎓</span>
                Procesar Diplomas
              </button>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Estado del Sistema</h3>
          </div>
          <div className="card-content">
            <div className="system-status">
              <div className="status-item">
                <div className="status-indicator online"></div>
                <span className="status-label">Servidor Principal</span>
                <span className="status-value">Online</span>
              </div>
              <div className="status-item">
                <div className="status-indicator online"></div>
                <span className="status-label">Base de Datos</span>
                <span className="status-value">Conectada</span>
              </div>
              <div className="status-item">
                <div className="status-indicator warning"></div>
                <span className="status-label">Servicio de Email</span>
                <span className="status-value">Lento</span>
              </div>
              <div className="status-item">
                <div className="status-indicator online"></div>
                <span className="status-label">Almacenamiento</span>
                <span className="status-value">78% usado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;