import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo y título */}
        <div className="navbar-brand">
          <Link to={usuario ? "/dashboard" : "/"} className="brand-link">
            <div className="brand-icon">🎓</div>
            <span className="brand-text">Congreso UMG</span>
          </Link>
        </div>

        {/* Navegación principal - Desktop */}
        <div className="navbar-nav desktop-nav">
          {usuario ? (
            <>
              <Link 
                to="/dashboard" 
                className={`nav-link ${isActivePath('/dashboard') ? 'active' : ''}`}
              >
                📊 Dashboard
              </Link>
              <Link 
                to="/foros" 
                className={`nav-link ${isActivePath('/foros') ? 'active' : ''}`}
              >
                💬 Foros
              </Link>
              <Link 
                to="/eventos" 
                className={`nav-link ${isActivePath('/eventos') ? 'active' : ''}`}
              >
                📅 Eventos
              </Link>
              <Link 
                to="/recursos" 
                className={`nav-link ${isActivePath('/recursos') ? 'active' : ''}`}
              >
                📚 Recursos
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/" 
                className={`nav-link ${isActivePath('/') ? 'active' : ''}`}
              >
                🏠 Inicio
              </Link>
              <Link 
                to="/about" 
                className={`nav-link ${isActivePath('/about') ? 'active' : ''}`}
              >
                ℹ️ Acerca de
              </Link>
              <Link 
                to="/contact" 
                className={`nav-link ${isActivePath('/contact') ? 'active' : ''}`}
              >
                📞 Contacto
              </Link>
            </>
          )}
        </div>

        {/* Acciones del usuario */}
        <div className="navbar-actions">
          {usuario ? (
            <div className="user-menu">
              <button 
                className="user-menu-trigger"
                onClick={toggleProfileMenu}
              >
                <div className="user-avatar">
                  {usuario.nombre.charAt(0).toUpperCase()}
                </div>
                <span className="user-name">{usuario.nombre}</span>
                <span className="dropdown-arrow">▼</span>
              </button>
              
              {isProfileMenuOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <div className="user-info">
                      <strong>{usuario.nombre} {usuario.apellido}</strong>
                      <span className="user-email">{usuario.correo}</span>
                      <span className="user-role">{usuario.id_rol?.toString()}</span>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link to="/profile" className="dropdown-item">
                    👤 Mi Perfil
                  </Link>
                  <Link to="/settings" className="dropdown-item">
                    ⚙️ Configuración
                  </Link>
                  <Link to="/help" className="dropdown-item">
                    ❓ Ayuda
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button 
                    onClick={handleLogout}
                    className="dropdown-item logout-item"
                  >
                    🚪 Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="auth-button login-btn">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="auth-button register-btn">
                Registrarse
              </Link>
            </div>
          )}

          {/* Botón de menú móvil */}
          <button 
            className="mobile-menu-toggle"
            onClick={toggleMenu}
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            {usuario ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`mobile-nav-link ${isActivePath('/dashboard') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  📊 Dashboard
                </Link>
                <Link 
                  to="/foros" 
                  className={`mobile-nav-link ${isActivePath('/foros') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  💬 Foros
                </Link>
                <Link 
                  to="/eventos" 
                  className={`mobile-nav-link ${isActivePath('/eventos') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  📅 Eventos
                </Link>
                <Link 
                  to="/recursos" 
                  className={`mobile-nav-link ${isActivePath('/recursos') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  📚 Recursos
                </Link>
                <div className="mobile-menu-divider"></div>
                <Link 
                  to="/profile" 
                  className="mobile-nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  👤 Mi Perfil
                </Link>
                <Link 
                  to="/settings" 
                  className="mobile-nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ⚙️ Configuración
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="mobile-nav-link logout-mobile"
                >
                  🚪 Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/" 
                  className={`mobile-nav-link ${isActivePath('/') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  🏠 Inicio
                </Link>
                <Link 
                  to="/about" 
                  className={`mobile-nav-link ${isActivePath('/about') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  ℹ️ Acerca de
                </Link>
                <Link 
                  to="/contact" 
                  className={`mobile-nav-link ${isActivePath('/contact') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  📞 Contacto
                </Link>
                <div className="mobile-menu-divider"></div>
                <Link 
                  to="/login" 
                  className="mobile-nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🔐 Iniciar Sesión
                </Link>
                <Link 
                  to="/register" 
                  className="mobile-nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  📝 Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Overlay para cerrar menús */}
      {(isMenuOpen || isProfileMenuOpen) && (
        <div 
          className="menu-overlay"
          onClick={() => {
            setIsMenuOpen(false);
            setIsProfileMenuOpen(false);
          }}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;