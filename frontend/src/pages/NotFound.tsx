import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    if (usuario) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        {/* Ilustración 404 */}
        <div className="error-illustration">
          <div className="error-number">404</div>
          <div className="error-icon">🔍</div>
        </div>

        {/* Contenido principal */}
        <div className="error-text">
          <h1>Página no encontrada</h1>
          <p>
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>
          <p className="error-subtitle">
            Puede que hayas escrito mal la URL o que el enlace esté desactualizado.
          </p>
        </div>

        {/* Acciones */}
        <div className="error-actions">
          <button 
            onClick={handleGoBack}
            className="action-button secondary"
          >
            ← Volver atrás
          </button>
          <button 
            onClick={handleGoHome}
            className="action-button primary"
          >
            🏠 Ir al inicio
          </button>
        </div>

        {/* Enlaces útiles */}
        <div className="helpful-links">
          <h3>Enlaces útiles:</h3>
          <div className="links-grid">
            {usuario ? (
              <>
                <Link to="/dashboard" className="helpful-link">
                  📊 Dashboard
                </Link>
                <Link to="/foros" className="helpful-link">
                  💬 Foros
                </Link>
              </>
            ) : (
              <>
                <Link to="/" className="helpful-link">
                  🏠 Página principal
                </Link>
                <Link to="/login" className="helpful-link">
                  🔐 Iniciar sesión
                </Link>
                <Link to="/register" className="helpful-link">
                  📝 Registrarse
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Información de contacto */}
        <div className="contact-info">
          <p>
            ¿Necesitas ayuda? Contacta con nuestro equipo de soporte:
          </p>
          <div className="contact-methods">
            <span className="contact-item">
              📧 soporte@congresotecnologico.com
            </span>
            <span className="contact-item">
              📞 +502 2345-6789
            </span>
          </div>
        </div>
      </div>

      {/* Decoración de fondo */}
      <div className="background-decoration">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>
    </div>
  );
};

export default NotFound;