import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { resultadosService } from '../api/resultadosService';
import { competenciasService } from '../api/competenciasService';
import UsuariosGrid from '../components/UsuariosGrid';

const Dashboard: React.FC = () => {
  const { usuario } = useAuth();
  const [selectedService, setSelectedService] = useState<string>('usuarios');
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
    const currentService = adminServices.find(s => s.id === selectedService);
    
    // Renderizar contenido específico para usuarios
    if (selectedService === 'usuarios') {
      return <UsuariosGrid />;
    }
    
    // Para otros servicios, mostrar el contenido por defecto
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