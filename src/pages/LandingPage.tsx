import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage: React.FC = () => {
  const { isAuthenticated, usuario } = useAuth();

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <nav className="landing-nav">
          <div className="nav-brand">
            <h2>Congreso Tecnológico UMG</h2>
          </div>
          <div className="nav-links">
            {isAuthenticated ? (
              <>
                <span className="welcome-text">Bienvenido, {usuario?.nombre}</span>
                <Link to="/dashboard" className="nav-button primary">
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-button secondary">
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="nav-button primary">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Congreso Tecnológico
              <span className="highlight"> UMG 2024</span>
            </h1>
            <p className="hero-subtitle">
              Conectando el futuro de la tecnología con las mentes más brillantes
            </p>
            <p className="hero-description">
              Únete a nosotros en el evento tecnológico más importante del año. 
              Conferencias magistrales, talleres prácticos y networking con 
              expertos de la industria.
            </p>
            <div className="hero-buttons">
              {!isAuthenticated ? (
                <>
                  <Link to="/register" className="cta-button primary">
                    Registrarse Ahora
                  </Link>
                  <Link to="/login" className="cta-button secondary">
                    Ya tengo cuenta
                  </Link>
                </>
              ) : (
                <Link to="/dashboard" className="cta-button primary">
                  Ir al Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="hero-visual">
            <div className="tech-grid">
              <div className="tech-card">
                <div className="tech-icon">🚀</div>
                <h3>Innovación</h3>
              </div>
              <div className="tech-card">
                <div className="tech-icon">💡</div>
                <h3>Ideas</h3>
              </div>
              <div className="tech-card">
                <div className="tech-icon">🌐</div>
                <h3>Conectividad</h3>
              </div>
              <div className="tech-card">
                <div className="tech-icon">⚡</div>
                <h3>Velocidad</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">¿Por qué participar?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Conferencias Especializadas</h3>
              <p>Ponencias de expertos en IA, Blockchain, IoT y más tecnologías emergentes</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Networking</h3>
              <p>Conecta con profesionales, estudiantes y empresarios del sector tecnológico</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛠️</div>
              <h3>Talleres Prácticos</h3>
              <p>Aprende nuevas habilidades con talleres hands-on dirigidos por expertos</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Certificaciones</h3>
              <p>Obtén certificados de participación reconocidos en la industria</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Participantes</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Ponentes</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">20+</div>
              <div className="stat-label">Talleres</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">3</div>
              <div className="stat-label">Días</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>¿Listo para ser parte del futuro?</h2>
            <p>No te pierdas la oportunidad de estar en el evento tecnológico más importante del año</p>
            {!isAuthenticated && (
              <Link to="/register" className="cta-button primary large">
                Registrarse Ahora
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Congreso Tecnológico UMG</h3>
              <p>Universidad Mariano Gálvez de Guatemala</p>
            </div>
            <div className="footer-section">
              <h4>Contacto</h4>
              <p>Email: congreso@umg.edu.gt</p>
              <p>Teléfono: +502 2411-1800</p>
            </div>
            <div className="footer-section">
              <h4>Síguenos</h4>
              <div className="social-links">
                <a href="#" className="social-link">Facebook</a>
                <a href="#" className="social-link">Twitter</a>
                <a href="#" className="social-link">LinkedIn</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Universidad Mariano Gálvez. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;