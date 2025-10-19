import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { forosService } from '../api/forosService';
import { competenciasService } from '../api/competenciasService';
import { talleresService } from '../api/talleresService';
import { usuariosService } from '../api/usuariosService';
import type { Foro } from '../types/Foro';
import type { Competencia } from '../types/Competencia';
import type { Taller } from '../types/Taller';
import type { Usuario } from '../types/Usuario';

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  // Estados para los datos de la API
  const [foros, setForos] = useState<Foro[]>([]);
  const [competencias, setCompetencias] = useState<Competencia[]>([]);
  const [talleres, setTalleres] = useState<Taller[]>([]);
  const [ponentes, setPonentes] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  // Función para cargar datos de la API
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        
        // Cargar datos en paralelo
        const [forosData, competenciasData, talleresData, ponentesData] = await Promise.all([
          forosService.obtenerForos(1, 6), // Obtener 6 foros
          competenciasService.obtenerCompetencias(1, 6), // Obtener 6 competencias
          talleresService.obtenerTalleres(1, 6), // Obtener 6 talleres
          usuariosService.obtenerUsuariosPorRol('staff', 4) // Obtener 4 usuarios staff
        ]);

        setForos(forosData.foros);
        setCompetencias(competenciasData.competencias);
        setTalleres(talleresData.talleres);
        setPonentes(ponentesData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  return (
    <div className="landing-page">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
          <div className="floating-shape shape-4"></div>
          <div className="particles-container">
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
          </div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <span className="badge-text">🎯 Evento 2025</span>
            </div>
            <h1 className="hero-title">
              <span className="title-line">Congreso Tecnológico</span>
              <span className="title-highlight">UMG 2025</span>
              <div className="title-underline"></div>
            </h1>
            <p className="hero-subtitle">
              Conectando el futuro de la tecnología con las mentes más brillantes
            </p>
            <p className="hero-description">
              Únete a nosotros en el evento tecnológico más importante del año. 
              Conferencias magistrales, talleres prácticos y networking con 
              expertos de la industria.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">3</span>
                <span className="stat-label">Días</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">Ponentes</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Asistentes</span>
              </div>
            </div>

          </div>
          <div className="hero-visual">
            <div className="tech-grid">
              <div className="tech-card floating">
                <div className="tech-icon">🚀</div>
                <h3>Innovación</h3>
                <div className="card-glow"></div>
              </div>
              <div className="tech-card floating">
                <div className="tech-icon">💡</div>
                <h3>Ideas</h3>
                <div className="card-glow"></div>
              </div>
              <div className="tech-card floating">
                <div className="tech-icon">🌐</div>
                <h3>Conectividad</h3>
                <div className="card-glow"></div>
              </div>
              <div className="tech-card floating">
                <div className="tech-icon">⚡</div>
                <h3>Velocidad</h3>
                <div className="card-glow"></div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Foros Section */}
      <section className="schedule-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Foros de Discusión</h2>
            <p className="section-subtitle">
              Participa en debates y discusiones sobre los temas más relevantes
            </p>
          </div>
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Cargando foros...</p>
            </div>
          ) : (
            <div className="schedule-timeline">
              {foros.length > 0 ? (
                foros.map((foro) => (
                  <div key={foro.id_foro} className="timeline-day">
                    <div className="day-header">
                      <h3>{foro.titulo}</h3>
                      <span className="day-date">
                        {new Date(foro.fecha_creacion).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long'
                        })}
                      </span>
                    </div>
                    <div className="day-events">
                      <div className="event-item">
                        <span className="event-time">
                          General
                        </span>
                        <div className="event-content">
                          <h4>{foro.titulo}</h4>
                          <p>{foro.descripcion}</p>
                          <div className="foro-meta">
                            <span>👤 {foro.usuario_creador?.nombre} {foro.usuario_creador?.apellido}</span>
                            <span>💬 {foro.total_mensajes || 0} mensajes</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-content">
                  <p>No hay foros disponibles en este momento.</p>
                </div>
              )}
            </div>
          )}
          <div className="section-footer">
            <Link to="/foros" className="cta-button secondary">
              Ver Todos los Foros
            </Link>
          </div>
        </div>
      </section>

      {/* Competencias Section */}
      <section className="schedule-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Competencias Tecnológicas</h2>
            <p className="section-subtitle">
              Demuestra tus habilidades en emocionantes competencias
            </p>
          </div>
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Cargando competencias...</p>
            </div>
          ) : (
            <div className="schedule-timeline">
              {competencias.length > 0 ? (
                competencias.map((competencia) => (
                  <div key={competencia.id_competencia} className="timeline-day">
                    <div className="day-header">
                      <h3>{competencia.titulo}</h3>
                      <span className="day-date">
                        {new Date(competencia.horario).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long'
                        })}
                      </span>
                    </div>
                    <div className="day-events">
                      <div className="event-item">
                        <span className="event-time">
                          {new Date(competencia.horario).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <div className="event-content">
                          <h4>{competencia.titulo}</h4>
                          <p>{competencia.descripcion}</p>
                          <div className="competencia-meta">
                            <span>🏆 {competencia.categoria?.nombre || 'General'}</span>
                            <span>👥 {competencia.cupo} cupos</span>
                            <span>📊 {competencia.inscritos || 0} inscritos</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-content">
                  <p>No hay competencias disponibles en este momento.</p>
                </div>
              )}
            </div>
          )}
          <div className="section-footer">
            <Link to="/competencias" className="cta-button secondary">
              Ver Todas las Competencias
            </Link>
          </div>
        </div>
      </section>

      {/* Talleres Section */}
      <section className="schedule-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Talleres Prácticos</h2>
            <p className="section-subtitle">
              Aprende nuevas tecnologías con talleres hands-on
            </p>
          </div>
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Cargando talleres...</p>
            </div>
          ) : (
            <div className="schedule-timeline">
              {talleres.length > 0 ? (
                talleres.map((taller) => (
                  <div key={taller.id_taller} className="timeline-day">
                    <div className="day-header">
                      <h3>{taller.titulo}</h3>
                      <span className="day-date">
                        {new Date(taller.horario).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long'
                        })}
                      </span>
                    </div>
                    <div className="day-events">
                      <div className="event-item">
                        <span className="event-time">
                          {new Date(taller.horario).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <div className="event-content">
                          <h4>{taller.titulo}</h4>
                          <p>{taller.descripcion}</p>
                          <div className="taller-meta">
                            <span>📚 {taller.categoria?.nombre || 'General'}</span>
                            <span>👥 {taller.cupo} cupos</span>
                            <span>📊 {taller.inscritos || 0} inscritos</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-content">
                  <p>No hay talleres disponibles en este momento.</p>
                </div>
              )}
            </div>
          )}
          <div className="section-footer">
            <Link to="/talleres" className="cta-button secondary">
              Ver Todos los Talleres
            </Link>
          </div>
        </div>
      </section>

      {/* Speakers Section */}
      <section className="speakers-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Ponentes Destacados</h2>
            <p className="section-subtitle">
              Conoce a los expertos que compartirán su conocimiento
            </p>
          </div>
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Cargando ponentes...</p>
            </div>
          ) : (
            <div className="speakers-grid">
              {ponentes.length > 0 ? (
                ponentes.map((ponente) => (
                  <div key={ponente.id_usuario} className="speaker-card">
                    <div className="speaker-image">
                      <div className="avatar">
                        {(ponente.foto_url || ponente.foto_perfil) ? (
                          <img 
                            src={ponente.foto_url || ponente.foto_perfil} 
                            alt={`${ponente.nombre} ${ponente.apellido}`}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <span>👨‍💼</span>
                        )}
                      </div>
                    </div>
                    <div className="speaker-info">
                      <h3>{ponente.nombre} {ponente.apellido}</h3>
                      <p className="speaker-title">
                        {ponente.especialidad || 'Especialista en Tecnología'}
                      </p>
                      <p className="speaker-company">
                        {ponente.institucion || 'Universidad Mariano Gálvez'}
                      </p>
                      <div className="speaker-contact">
                        <span>📧 {ponente.correo}</span>
                        {ponente.telefono && (
                          <span>📱 {ponente.telefono}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="speakers-grid">
                  <div className="speaker-card">
                    <div className="speaker-image">
                      <div className="avatar">👩‍💼</div>
                    </div>
                    <div className="speaker-info">
                      <h3>Dra. María González</h3>
                      <p className="speaker-title">Experta en Inteligencia Artificial</p>
                      <p className="speaker-company">MIT Technology Review</p>
                      <div className="speaker-social">
                        <span>🔗 LinkedIn</span>
                        <span>🐦 Twitter</span>
                      </div>
                    </div>
                  </div>
                  <div className="speaker-card">
                    <div className="speaker-image">
                      <div className="avatar">👨‍💻</div>
                    </div>
                    <div className="speaker-info">
                      <h3>Ing. Carlos Mendoza</h3>
                      <p className="speaker-title">Chief Information Security Officer</p>
                      <p className="speaker-company">TechCorp Guatemala</p>
                      <div className="speaker-social">
                        <span>🔗 LinkedIn</span>
                        <span>🐦 Twitter</span>
                      </div>
                    </div>
                  </div>
                  <div className="speaker-card">
                    <div className="speaker-image">
                      <div className="avatar">👩‍🔬</div>
                    </div>
                    <div className="speaker-info">
                      <h3>Dra. Ana Rodríguez</h3>
                      <p className="speaker-title">Directora de Innovación</p>
                      <p className="speaker-company">Google Cloud LATAM</p>
                      <div className="speaker-social">
                        <span>🔗 LinkedIn</span>
                        <span>🐦 Twitter</span>
                      </div>
                    </div>
                  </div>
                  <div className="speaker-card">
                    <div className="speaker-image">
                      <div className="avatar">👨‍🚀</div>
                    </div>
                    <div className="speaker-info">
                      <h3>Ing. Roberto Silva</h3>
                      <p className="speaker-title">Fundador & CEO</p>
                      <p className="speaker-company">InnovaTech Startup</p>
                      <div className="speaker-social">
                        <span>🔗 LinkedIn</span>
                        <span>🐦 Twitter</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">¿Por qué asistir?</h2>
            <p className="section-subtitle">
              Descubre las ventajas de participar en nuestro congreso
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Conferencias Magistrales</h3>
              <p>Aprende de los mejores expertos en tecnología del país y la región</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Networking</h3>
              <p>Conecta con profesionales, estudiantes y empresarios del sector</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💼</div>
              <h3>Oportunidades Laborales</h3>
              <p>Descubre nuevas oportunidades de carrera y emprendimiento</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Certificación</h3>
              <p>Obtén certificados de participación reconocidos en la industria</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔬</div>
              <h3>Talleres Prácticos</h3>
              <p>Participa en talleres hands-on con las últimas tecnologías</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌟</div>
              <h3>Innovación</h3>
              <p>Conoce las últimas tendencias y avances tecnológicos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Lo que dicen nuestros participantes</h2>
            <p className="section-subtitle">
              Experiencias reales de ediciones anteriores
            </p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="quote-icon">"</div>
                <p>"El congreso UMG 2024 cambió mi perspectiva sobre la tecnología. Las conferencias fueron increíbles y el networking me ayudó a conseguir mi trabajo actual."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">👨‍🎓</div>
                <div className="author-info">
                  <h4>Luis Morales</h4>
                  <span>Desarrollador Full Stack</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="quote-icon">"</div>
                <p>"Los talleres prácticos fueron excepcionales. Aprendí tecnologías que inmediatamente pude aplicar en mi empresa. Definitivamente regresaré este año."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">👩‍💼</div>
                <div className="author-info">
                  <h4>Carmen López</h4>
                  <span>Project Manager</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="quote-icon">"</div>
                <p>"Como estudiante, el congreso me abrió los ojos a las posibilidades en el mundo tech. Los ponentes fueron inspiradores y accesibles."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">👩‍🎓</div>
                <div className="author-info">
                  <h4>Sofia Hernández</h4>
                  <span>Estudiante de Ingeniería</span>
                </div>
              </div>
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
            <div className="footer-section footer-brand">
              <div className="footer-logo">
                <img src="https://umg.edu.gt/img/Umg.png" alt="Universidad Mariano Gálvez" className="umg-logo" />
              </div>
              <h3>Congreso Tecnológico UMG</h3>
              <p>Universidad Mariano Gálvez de Guatemala</p>
            </div>
            <div className="footer-section">
              <h4>Contacto</h4>
              <div className="contact-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="contact-icon">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <span>info@umg.edu.gt</span>
              </div>
              <div className="contact-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="contact-icon">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                <span>PBX: 2411 1800</span>
              </div>
            </div>
            <div className="footer-section">
              <h4>Síguenos</h4>
              <div className="social-links">
                <a href="https://www.facebook.com/u.marianogalvez" target="_blank" rel="noopener noreferrer" className="social-link" title="Facebook">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/marianogalvez" target="_blank" rel="noopener noreferrer" className="social-link" title="Instagram">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://www.youtube.com/@umarianogalvez" target="_blank" rel="noopener noreferrer" className="social-link" title="YouTube">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a href="https://www.tiktok.com/@u.marianogalvez" target="_blank" rel="noopener noreferrer" className="social-link" title="TikTok">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </a>
                <a href="https://linkedin.com/edu/school?id=12870" target="_blank" rel="noopener noreferrer" className="social-link" title="LinkedIn">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="https://ssg.umg.edu.gt/" target="_blank" rel="noopener noreferrer" className="social-link" title="Sitio Web UMG">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                </a>
                <a href="https://radio.umg.edu.gt/" target="_blank" rel="noopener noreferrer" className="social-link" title="Radio UMG">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.24 6.15C2.51 6.43 2 7.17 2 8v12c0 1.1.89 2 2 2h16c1.11 0 2-.9 2-2V8c0-1.11-.89-2-2-2H8.3l8.26-3.34L15.88 1 3.24 6.15zM7 20c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm0-4c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm9-8h4v2h-4V8zm0 4h4v2h-4v-2z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Universidad Mariano Gálvez. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;