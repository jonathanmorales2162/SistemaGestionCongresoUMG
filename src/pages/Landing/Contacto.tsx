import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Contacto: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  });
  const [enviando, setEnviando] = useState(false);
  const [mensajeEnviado, setMensajeEnviado] = useState(false);

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);

    try {
      // Aquí iría la lógica para enviar el mensaje de contacto
      // Por ahora simulamos el envío
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMensajeEnviado(true);
      setFormData({
        nombre: '',
        email: '',
        asunto: '',
        mensaje: ''
      });
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      alert('Error al enviar el mensaje. Por favor, intenta nuevamente.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="contacto-page">
      {/* Header */}
      <header className="page-header">
        <nav className="nav-container">
          <Link to="/" className="nav-brand">
            <h2>Congreso Tecnológico UMG</h2>
          </Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">Inicio</Link>
            <Link to="/talleres" className="nav-link">Talleres</Link>
            <Link to="/competencias" className="nav-link">Competencias</Link>
            <Link to="/foros" className="nav-link">Foros</Link>
            <Link to="/contacto" className="nav-link active">Contacto</Link>
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn primary">Dashboard</Link>
            ) : (
              <Link to="/login" className="btn primary">Iniciar Sesión</Link>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Contacto</h1>
          <p>¿Tienes preguntas? Estamos aquí para ayudarte</p>
        </div>
      </section>

      {/* Contacto Content */}
      <section className="contacto-section">
        <div className="container">
          <div className="contacto-grid">
            {/* Información de Contacto */}
            <div className="contacto-info">
              <h2>Información del Evento</h2>
              
              <div className="info-card">
                <h3>📍 Ubicación</h3>
                <p>Universidad Mariano Gálvez de Guatemala</p>
                <p>Campus Central, Guatemala City</p>
                <p>3a Avenida 9-00, Zona 2</p>
              </div>

              <div className="info-card">
                <h3>📅 Fechas del Congreso</h3>
                <p>15 - 17 de Octubre, 2025</p>
                <p>Horario: 8:00 AM - 6:00 PM</p>
              </div>

              <div className="info-card">
                <h3>📞 Contacto Directo</h3>
                <p>Teléfono: +502 2411-1800</p>
                <p>Email: congreso@umg.edu.gt</p>
                <p>WhatsApp: +502 5555-1234</p>
              </div>

              <div className="info-card">
                <h3>🌐 Redes Sociales</h3>
                <div className="social-links">
                  <a href="#" className="social-link facebook">
                    <span className="icon">📘</span>
                    Facebook
                  </a>
                  <a href="#" className="social-link twitter">
                    <span className="icon">🐦</span>
                    Twitter
                  </a>
                  <a href="#" className="social-link instagram">
                    <span className="icon">📷</span>
                    Instagram
                  </a>
                  <a href="#" className="social-link linkedin">
                    <span className="icon">💼</span>
                    LinkedIn
                  </a>
                </div>
              </div>

              <div className="info-card">
                <h3>🎯 Organizadores</h3>
                <p><strong>Coordinador General:</strong></p>
                <p>Dr. Juan Carlos Méndez</p>
                <p>jmendez@umg.edu.gt</p>
                
                <p><strong>Coordinadora Académica:</strong></p>
                <p>Ing. María Elena Rodríguez</p>
                <p>mrodriguez@umg.edu.gt</p>
              </div>
            </div>

            {/* Formulario de Contacto */}
            <div className="contacto-form">
              <h2>Envíanos un Mensaje</h2>
              
              {mensajeEnviado ? (
                <div className="mensaje-exito">
                  <div className="exito-icon">✅</div>
                  <h3>¡Mensaje Enviado!</h3>
                  <p>Gracias por contactarnos. Te responderemos pronto.</p>
                  <button 
                    onClick={() => setMensajeEnviado(false)}
                    className="btn secondary"
                  >
                    Enviar Otro Mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={manejarEnvio} className="form">
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre Completo *</label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={manejarCambio}
                      required
                      placeholder="Tu nombre completo"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Correo Electrónico *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={manejarCambio}
                      required
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="asunto">Asunto *</label>
                    <select
                      id="asunto"
                      name="asunto"
                      value={formData.asunto}
                      onChange={manejarCambio}
                      required
                    >
                      <option value="">Selecciona un asunto</option>
                      <option value="inscripcion">Consulta sobre Inscripción</option>
                      <option value="talleres">Información sobre Talleres</option>
                      <option value="competencias">Información sobre Competencias</option>
                      <option value="hospedaje">Hospedaje y Alojamiento</option>
                      <option value="patrocinio">Oportunidades de Patrocinio</option>
                      <option value="ponente">Ser Ponente</option>
                      <option value="tecnico">Soporte Técnico</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="mensaje">Mensaje *</label>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      value={formData.mensaje}
                      onChange={manejarCambio}
                      required
                      rows={6}
                      placeholder="Escribe tu mensaje aquí..."
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn primary full-width"
                    disabled={enviando}
                  >
                    {enviando ? 'Enviando...' : 'Enviar Mensaje'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2>Preguntas Frecuentes</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>¿Cuál es el costo de inscripción?</h3>
              <p>La inscripción es completamente gratuita para estudiantes de UMG. Para participantes externos, consulta nuestras tarifas especiales.</p>
            </div>
            <div className="faq-item">
              <h3>¿Necesito experiencia previa?</h3>
              <p>No, tenemos actividades para todos los niveles, desde principiantes hasta expertos en tecnología.</p>
            </div>
            <div className="faq-item">
              <h3>¿Hay certificados de participación?</h3>
              <p>Sí, todos los participantes recibirán certificados digitales de participación en las actividades completadas.</p>
            </div>
            <div className="faq-item">
              <h3>¿Puedo participar virtualmente?</h3>
              <p>Algunas actividades ofrecen modalidad híbrida. Consulta la descripción de cada evento para más detalles.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="page-footer">
        <div className="container">
          <p>&copy; 2025 Congreso Tecnológico UMG. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Contacto;