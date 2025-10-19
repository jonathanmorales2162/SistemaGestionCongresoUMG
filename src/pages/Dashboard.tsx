import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { resultadosService } from '../api/resultadosService';
import { competenciasService } from '../api/competenciasService';

const Dashboard: React.FC = () => {
  const { usuario } = useAuth();
  const [selectedService, setSelectedService] = useState<string>('overview');
  const [stats, setStats] = useState({
    totalResultados: 0,
    publicados: 0,
    pendientes: 0,
    visualizaciones: 0,
    totalUsuarios: 0,
    totalCompetencias: 0
  });
  const [loading, setLoading] = useState(true);

  const getRoleName = (idRol: number): string => {
    switch (idRol) {
      case 1:
        return 'Administrador';
      case 2:
        return 'Organizador';
      case 3:
        return 'Participante';
      default:
        return 'Usuario';
    }
  };

  const loadStats = async () => {
    try {
      setLoading(true);
      const [resultadosStats, competencias] = await Promise.all([
        resultadosService.obtenerEstadisticas(),
        competenciasService.obtenerCompetencias()
      ]);

      setStats({
        totalResultados: resultadosStats.totalResultados,
        publicados: resultadosStats.publicados,
        pendientes: resultadosStats.pendientes,
        visualizaciones: resultadosStats.visualizaciones,
        totalUsuarios: 0, // No disponible por ahora
        totalCompetencias: competencias.competencias.length
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      // Valores por defecto en caso de error
      setStats({
        totalResultados: 0,
        publicados: 0,
        pendientes: 0,
        visualizaciones: 0,
        totalUsuarios: 0,
        totalCompetencias: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const adminServices = [
    {
      id: 'usuarios',
      name: 'Usuarios',
      icon: '👥',
      description: 'Gestión de usuarios del sistema',
      route: '/admin/usuarios'
    },
    {
      id: 'talleres',
      name: 'Talleres',
      icon: '🎓',
      description: 'Administración de talleres',
      route: '/admin/talleres'
    },
    {
      id: 'competencias',
      name: 'Competencias',
      icon: '🏆',
      description: 'Gestión de competencias',
      route: '/admin/competencias'
    },
    {
      id: 'foros',
      name: 'Foros',
      icon: '💬',
      description: 'Administración de foros',
      route: '/admin/foros'
    },
    {
      id: 'categorias',
      name: 'Categorías',
      icon: '📂',
      description: 'Gestión de categorías',
      route: '/admin/categorias'
    },
    {
      id: 'resultados',
      name: 'Resultados',
      icon: '📊',
      description: 'Administración de resultados',
      route: '/admin/resultados'
    },
    {
      id: 'inscripciones',
      name: 'Inscripciones',
      icon: '📝',
      description: 'Gestión de inscripciones',
      route: '/admin/inscripciones'
    },
    {
      id: 'asistencia',
      name: 'Asistencia',
      icon: '✅',
      description: 'Control de asistencia',
      route: '/admin/asistencia'
    },
    {
      id: 'diplomas',
      name: 'Diplomas',
      icon: '🎖️',
      description: 'Gestión de diplomas',
      route: '/admin/diplomas'
    },
    {
      id: 'roles',
      name: 'Roles',
      icon: '🔐',
      description: 'Administración de roles',
      route: '/admin/roles'
    }
  ];

  const renderMainContent = () => {
    if (selectedService === 'overview') {
      return (
        <div className="admin-overview">
          <div className="overview-header">
            <h1>Panel de Control</h1>
            <p>Centro de Ayuda</p>
          </div>
          
          {/* Estadísticas principales */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                <h3>Resultados</h3>
                <span className="stat-period">Ver todo</span>
              </div>
              <div className="stat-content">
                <div className="stat-number">{loading ? '...' : stats.totalResultados}</div>
                <div className="stat-details">
                  <div className="stat-item">
                    <span className="stat-label">Publicados</span>
                    <span className="stat-value">{loading ? '...' : stats.publicados}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Pendientes</span>
                    <span className="stat-value">{loading ? '...' : stats.pendientes}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <h3>Uso de Recursos</h3>
                <span className="stat-period">27 ene - 3 feb</span>
              </div>
              <div className="stat-content">
                <div className="stat-chart">
                  <div className="chart-circle">
                    <div className="chart-percentage">
                      {loading ? '...' : Math.round((stats.publicados / Math.max(stats.totalResultados, 1)) * 100)}%
                    </div>
                  </div>
                  <div className="chart-details">
                    <div className="chart-item">
                      <span className="chart-color blue"></span>
                      <span>Publicados: {loading ? '...' : stats.publicados}</span>
                    </div>
                    <div className="chart-item">
                      <span className="chart-color purple"></span>
                      <span>Pendientes: {loading ? '...' : stats.pendientes}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <h3>Competencias</h3>
                <span className="stat-period">Total registradas</span>
              </div>
              <div className="stat-content">
                <div className="stat-number">{loading ? '...' : stats.totalCompetencias}</div>
                <div className="stat-details">
                  <div className="stat-item">
                    <span className="stat-label">Activas</span>
                    <span className="stat-value">{loading ? '...' : stats.totalCompetencias}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Participantes</span>
                    <span className="stat-value">{loading ? '...' : stats.visualizaciones}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resumen de actividades */}
          <div className="charts-grid">
            <div className="chart-card">
              <div className="chart-header">
                <h3>Actividades del Congreso</h3>
                <span className="chart-period">Resumen general</span>
              </div>
              <div className="activity-summary">
                <div className="activity-item">
                  <span className="activity-icon">💬</span>
                  <div className="activity-info">
                    <span className="activity-label">Foros</span>
                    <span className="activity-count">Disponibles</span>
                  </div>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">🏆</span>
                  <div className="activity-info">
                    <span className="activity-label">Competencias</span>
                    <span className="activity-count">{loading ? '...' : stats.totalCompetencias}</span>
                  </div>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">🎓</span>
                  <div className="activity-info">
                    <span className="activity-label">Talleres</span>
                    <span className="activity-count">Disponibles</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h3>Estado de Resultados</h3>
                <span className="chart-period">Publicación</span>
              </div>
              <div className="chart-value">{loading ? '...' : stats.totalResultados} Total</div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${stats.totalResultados > 0 ? (stats.publicados / stats.totalResultados) * 100 : 0}%` 
                  }}
                ></div>
              </div>
              <div className="progress-label">
                {loading ? '...' : Math.round((stats.publicados / Math.max(stats.totalResultados, 1)) * 100)}% Publicados
              </div>
            </div>
          </div>

          {/* Servicios administrativos */}
          <div className="services-section">
            <h2>Servicios Administrativos</h2>
            <div className="services-grid">
              {adminServices.map((service) => (
                <div key={service.id} className="service-card">
                  <div className="service-icon">{service.icon}</div>
                  <div className="service-content">
                    <h3 className="service-title">{service.name}</h3>
                    <p>{service.description}</p>
                    <Link to={service.route} className="btn btn-primary">
                      Administrar
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    const currentService = adminServices.find(s => s.id === selectedService);
    return (
      <div className="service-content">
        <div className="service-header">
          <div className="service-title">
            <span className="service-icon-large">{currentService?.icon}</span>
            <div>
              <h2>{currentService?.name}</h2>
              <p>{currentService?.description}</p>
            </div>
          </div>
          <Link 
            to={currentService?.route || '#'} 
            className="btn-primary"
          >
            Ir a {currentService?.name}
          </Link>
        </div>
        <div className="service-placeholder">
          <p>Contenido del servicio {currentService?.name} se cargará aquí</p>
          <p>Funcionalidades disponibles:</p>
          <ul>
            <li>Crear nuevo registro</li>
            <li>Listar registros existentes</li>
            <li>Editar registros</li>
            <li>Eliminar registros</li>
            <li>Buscar y filtrar</li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="admin-dashboard">
      <Navbar />
      <div className="admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="sidebar-header">
            <h3>Administración</h3>
            <p className="user-role">{getRoleName(usuario?.id_rol || 4)}</p>
          </div>
          
          <nav className="sidebar-nav">
            <button
              className={`nav-item ${selectedService === 'overview' ? 'active' : ''}`}
              onClick={() => setSelectedService('overview')}
            >
              <span className="nav-icon">📊</span>
              <span className="nav-label">Resumen</span>
            </button>
            
            {adminServices.map((service) => (
              <button
                key={service.id}
                className={`nav-item ${selectedService === service.id ? 'active' : ''}`}
                onClick={() => setSelectedService(service.id)}
              >
                <span className="nav-icon">{service.icon}</span>
                <span className="nav-label">{service.name}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          <div className="admin-header">
            <div className="welcome-section">
              <h1>¡Bienvenido, {usuario?.nombre}!</h1>
              <p className="user-info">
                {usuario ? getRoleName(usuario.id_rol) : 'Usuario'} • {usuario?.colegio || 'Sin colegio'}
              </p>
            </div>
          </div>
          
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;