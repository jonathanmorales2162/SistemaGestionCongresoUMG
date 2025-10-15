import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout: React.FC = () => {
  const { usuario, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    {
      path: '/admin',
      label: 'Dashboard',
      icon: '🏠'
    },
    {
      path: '/admin/perfil',
      label: 'Mi Perfil',
      icon: '👤'
    },
    {
      path: '/admin/inscripciones',
      label: 'Inscripciones',
      icon: '📝'
    },
    {
      path: '/admin/asistencia',
      label: 'Asistencia',
      icon: '✅'
    },
    {
      path: '/admin/diplomas',
      label: 'Diplomas',
      icon: '🎓'
    },
    {
      path: '/admin/resultados',
      label: 'Resultados',
      icon: '📊'
    }
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span className="brand-icon">⚙️</span>
            {!sidebarCollapsed && <span className="brand-text">Admin Panel</span>}
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? '▶️' : '◀️'}
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map((item) => (
              <li key={item.path} className="nav-item">
                <Link
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <h1 className="page-title">Panel de Administración</h1>
          </div>
          
          <div className="topbar-right">
            <div className="user-info">
              <div className="user-details">
                <span className="user-name">{usuario?.nombre || 'Usuario'}</span>
                <span className="user-role">{usuario?.id_rol || 'Sin rol'}</span>
              </div>
              <div className="user-avatar">
                {usuario?.nombre?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
            
            <button className="logout-btn" onClick={handleLogout}>
              <span className="logout-icon">🚪</span>
              Cerrar Sesión
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;