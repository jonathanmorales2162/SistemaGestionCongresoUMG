import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface SidebarItem {
  path: string;
  label: string;
  icon: string;
  roles?: string[];
  children?: SidebarItem[];
}

const Sidebar: React.FC = () => {
  const { usuario } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const sidebarItems: SidebarItem[] = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: '📊'
    },
    {
      path: '/foros',
      label: 'Foros',
      icon: '💬',
      children: [
        { path: '/foros', label: 'Ver Foros', icon: '👁️' },
        { path: '/foros/mis-foros', label: 'Mis Foros', icon: '📝' },
        { path: '/foros/crear', label: 'Crear Foro', icon: '➕', roles: ['Administrador', 'Ponente'] }
      ]
    },
    {
      path: '/eventos',
      label: 'Eventos',
      icon: '📅',
      children: [
        { path: '/eventos', label: 'Ver Eventos', icon: '👁️' },
        { path: '/eventos/mis-eventos', label: 'Mis Eventos', icon: '📋' },
        { path: '/eventos/crear', label: 'Crear Evento', icon: '➕', roles: ['Administrador'] }
      ]
    },
    {
      path: '/recursos',
      label: 'Recursos',
      icon: '📚',
      children: [
        { path: '/recursos/documentos', label: 'Documentos', icon: '📄' },
        { path: '/recursos/videos', label: 'Videos', icon: '🎥' },
        { path: '/recursos/presentaciones', label: 'Presentaciones', icon: '📊' }
      ]
    },
    {
      path: '/participantes',
      label: 'Participantes',
      icon: '👥',
      roles: ['Administrador'],
      children: [
        { path: '/participantes', label: 'Ver Participantes', icon: '👁️' },
        { path: '/participantes/gestionar', label: 'Gestionar', icon: '⚙️' },
        { path: '/participantes/reportes', label: 'Reportes', icon: '📈' }
      ]
    },
    {
      path: '/configuracion',
      label: 'Configuración',
      icon: '⚙️',
      children: [
        { path: '/profile', label: 'Mi Perfil', icon: '👤' },
        { path: '/settings', label: 'Preferencias', icon: '🔧' },
        { path: '/configuracion/sistema', label: 'Sistema', icon: '🖥️', roles: ['Administrador'] }
      ]
    },
    {
      path: '/ayuda',
      label: 'Ayuda',
      icon: '❓',
      children: [
        { path: '/help', label: 'Centro de Ayuda', icon: '📖' },
        { path: '/help/faq', label: 'FAQ', icon: '❔' },
        { path: '/help/contacto', label: 'Contacto', icon: '📞' }
      ]
    }
  ];

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleExpanded = (path: string) => {
    setExpandedItems(prev => 
      prev.includes(path) 
        ? prev.filter(item => item !== path)
        : [...prev, path]
    );
  };

  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const hasPermission = (item: SidebarItem) => {
    if (!item.roles || !usuario?.rol) return true;
    return item.roles.includes(usuario.rol.nombre);
  };

  const renderSidebarItem = (item: SidebarItem, level: number = 0) => {
    if (!hasPermission(item)) return null;

    const isActive = isActivePath(item.path);
    const isExpanded = expandedItems.includes(item.path);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.path} className={`sidebar-item level-${level}`}>
        <div className="sidebar-item-content">
          {hasChildren ? (
            <button
              className={`sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => toggleExpanded(item.path)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {!isCollapsed && (
                <>
                  <span className="sidebar-label">{item.label}</span>
                  <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
                    ▼
                  </span>
                </>
              )}
            </button>
          ) : (
            <Link
              to={item.path}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {!isCollapsed && (
                <span className="sidebar-label">{item.label}</span>
              )}
            </Link>
          )}
        </div>

        {hasChildren && (isExpanded || isCollapsed) && !isCollapsed && (
          <div className="sidebar-children">
            {item.children!.map(child => renderSidebarItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Header del sidebar */}
      <div className="sidebar-header">
        <button 
          className="collapse-toggle"
          onClick={toggleCollapse}
          title={isCollapsed ? 'Expandir sidebar' : 'Contraer sidebar'}
        >
          {isCollapsed ? '▶️' : '◀️'}
        </button>
        {!isCollapsed && (
          <div className="sidebar-title">
            <span>Navegación</span>
          </div>
        )}
      </div>

      {/* Información del usuario */}
      {!isCollapsed && usuario && (
        <div className="sidebar-user-info">
          <div className="user-avatar-sidebar">
            {usuario.nombre.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <div className="user-name">{usuario.nombre}</div>
            <div className="user-role">{usuario.rol?.nombre}</div>
          </div>
        </div>
      )}

      {/* Navegación principal */}
      <nav className="sidebar-nav">
        <div className="sidebar-items">
          {sidebarItems.map(item => renderSidebarItem(item))}
        </div>
      </nav>

      {/* Footer del sidebar */}
      <div className="sidebar-footer">
        {!isCollapsed && (
          <div className="sidebar-footer-content">
            <div className="version-info">
              <span>v1.0.0</span>
            </div>
            <div className="footer-links">
              <Link to="/help" className="footer-link" title="Ayuda">
                ❓
              </Link>
              <Link to="/settings" className="footer-link" title="Configuración">
                ⚙️
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Indicador de estado de conexión */}
      <div className="connection-status">
        <div className="status-indicator online" title="Conectado"></div>
        {!isCollapsed && <span className="status-text">Conectado</span>}
      </div>
    </aside>
  );
};

export default Sidebar;