import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Dashboard: React.FC = () => {
  const { usuario } = useAuth();

  const quickActions = [
    {
      title: 'Foros de Conferencias',
      description: 'Explora y participa en los foros de discusión',
      icon: '💬',
      link: '/foros',
      color: 'primary'
    },
    {
      title: 'Mi Perfil',
      description: 'Actualiza tu información personal',
      icon: '👤',
      link: '/profile',
      color: 'secondary'
    },
    {
      title: 'Certificados',
      description: 'Descarga tus certificados de participación',
      icon: '🏆',
      link: '/certificates',
      color: 'accent'
    },
    {
      title: 'Agenda',
      description: 'Revisa el cronograma de eventos',
      icon: '📅',
      link: '/agenda',
      color: 'info'
    }
  ];

  const recentActivities = [
    {
      type: 'login',
      message: 'Iniciaste sesión en el sistema',
      time: 'Hace 5 minutos',
      icon: '🔐'
    },
    {
      type: 'registration',
      message: 'Te registraste en el congreso',
      time: 'Hace 2 horas',
      icon: '✅'
    },
    {
      type: 'update',
      message: 'Actualizaste tu perfil',
      time: 'Ayer',
      icon: '📝'
    }
  ];

  const upcomingEvents = [
    {
      title: 'Conferencia: IA en el Futuro',
      speaker: 'Dr. María González',
      time: '10:00 AM - 11:30 AM',
      date: 'Mañana',
      room: 'Auditorio Principal'
    },
    {
      title: 'Taller: Desarrollo con React',
      speaker: 'Ing. Carlos Pérez',
      time: '2:00 PM - 4:00 PM',
      date: 'Mañana',
      room: 'Lab 1'
    },
    {
      title: 'Panel: Blockchain y Criptomonedas',
      speaker: 'Varios expertos',
      time: '9:00 AM - 10:30 AM',
      date: 'Pasado mañana',
      room: 'Sala de Conferencias'
    }
  ];

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar />
        <main className="main-content">
          {/* Header */}
          <div className="dashboard-header">
            <div className="welcome-section">
              <h1>¡Bienvenido, {usuario?.nombre}!</h1>
              <p className="user-info">
                {usuario?.rol} • {usuario?.institucion || 'Sin institución'}
              </p>
            </div>
            <div className="user-stats">
              <div className="stat-card">
                <div className="stat-value">5</div>
                <div className="stat-label">Eventos</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">3</div>
                <div className="stat-label">Certificados</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">12</div>
                <div className="stat-label">Conexiones</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <section className="dashboard-section">
            <h2 className="section-title">Acciones Rápidas</h2>
            <div className="quick-actions-grid">
              {quickActions.map((action, index) => (
                <Link 
                  key={index} 
                  to={action.link} 
                  className={`quick-action-card ${action.color}`}
                >
                  <div className="action-icon">{action.icon}</div>
                  <div className="action-content">
                    <h3>{action.title}</h3>
                    <p>{action.description}</p>
                  </div>
                  <div className="action-arrow">→</div>
                </Link>
              ))}
            </div>
          </section>

          {/* Dashboard Grid */}
          <div className="dashboard-grid">
            {/* Upcoming Events */}
            <section className="dashboard-card">
              <div className="card-header">
                <h3>Próximos Eventos</h3>
                <Link to="/agenda" className="view-all-link">Ver todos</Link>
              </div>
              <div className="events-list">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="event-item">
                    <div className="event-time">
                      <div className="event-date">{event.date}</div>
                      <div className="event-hour">{event.time}</div>
                    </div>
                    <div className="event-details">
                      <h4>{event.title}</h4>
                      <p className="event-speaker">Por: {event.speaker}</p>
                      <p className="event-location">📍 {event.room}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Activities */}
            <section className="dashboard-card">
              <div className="card-header">
                <h3>Actividad Reciente</h3>
              </div>
              <div className="activities-list">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-icon">{activity.icon}</div>
                    <div className="activity-content">
                      <p>{activity.message}</p>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Notifications */}
          <section className="dashboard-section">
            <h2 className="section-title">Notificaciones</h2>
            <div className="notifications-container">
              <div className="notification-item info">
                <div className="notification-icon">ℹ️</div>
                <div className="notification-content">
                  <h4>Recordatorio</h4>
                  <p>No olvides confirmar tu asistencia a las conferencias de mañana.</p>
                </div>
              </div>
              <div className="notification-item success">
                <div className="notification-icon">✅</div>
                <div className="notification-content">
                  <h4>Registro Exitoso</h4>
                  <p>Te has registrado exitosamente en el taller de React.</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;