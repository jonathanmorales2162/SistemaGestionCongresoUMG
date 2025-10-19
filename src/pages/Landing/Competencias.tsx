import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { competenciasService } from '../../api';
import type { Competencia } from '../../types';

const Competencias: React.FC = () => {
  const [competencias, setCompetencias] = useState<Competencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    cargarCompetencias();
  }, []);

  const cargarCompetencias = async () => {
    try {
      setLoading(true);
      const response = await competenciasService.obtenerCompetencias();
      if (response.competencias) {
        setCompetencias(response.competencias);
      }
    } catch (err) {
      setError('Error al cargar las competencias');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const manejarInscripcion = async (_competenciaId: number) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      // Aquí iría la lógica de inscripción usando inscripcionesService
  
      alert('¡Inscripción exitosa!');
    } catch (err) {
      console.error('Error en inscripción:', err);
      alert('Error al procesar la inscripción');
    }
  };



  if (loading) {
    return (
      <div className="competencias-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando competencias...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="competencias-page">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={cargarCompetencias} className="btn primary">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="competencias-page">
      {/* Header */}
      <header className="page-header">
        <nav className="nav-container">
          <Link to="/" className="nav-brand">
            <h2>Congreso Tecnológico UMG</h2>
          </Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">Inicio</Link>
            <Link to="/talleres" className="nav-link">Talleres</Link>
            <Link to="/competencias" className="nav-link active">Competencias</Link>
            <Link to="/foros" className="nav-link">Foros</Link>
            <Link to="/contacto" className="nav-link">Contacto</Link>
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
          <h1>Competencias Tecnológicas</h1>
          <p>Demuestra tus habilidades en desafíos tecnológicos emocionantes</p>
        </div>
      </section>

      {/* Competencias Grid */}
      <section className="competencias-section">
        <div className="container">
          <div className="section-header">
            <h2>Competencias Disponibles</h2>
            <p>Participa en nuestras competencias y demuestra tu talento</p>
          </div>

          {competencias.length === 0 ? (
            <div className="empty-state">
              <h3>No hay competencias disponibles</h3>
              <p>Pronto publicaremos nuevas competencias</p>
            </div>
          ) : (
            <div className="competencias-grid">
              {competencias.map((competencia) => (
                <div key={competencia.id_competencia} className="competencia-card">
                  <div className="card-header">
                    <h3 className="competencia-titulo">{competencia.titulo}</h3>
                    <span className="competencia-categoria">
                      {competencia.categoria?.nombre || 'General'}
                    </span>
                  </div>
                  
                  <div className="card-body">
                    <p className="competencia-descripcion">{competencia.descripcion}</p>
                    
                    <div className="competencia-info">
                      <div className="info-item">
                        <span className="icon">🏆</span>
                        <span>Categoría: {competencia.categoria?.nombre || 'General'}</span>
                      </div>
                      <div className="info-item">
                        <span className="icon">📅</span>
                        <span>Fecha: {new Date(competencia.horario).toLocaleDateString()}</span>
                      </div>
                      <div className="info-item">
                        <span className="icon">🕐</span>
                        <span>Horario: {new Date(competencia.horario).toLocaleTimeString()}</span>
                      </div>
                      <div className="info-item">
                        <span className="icon">👥</span>
                        <span>Cupo máximo: {competencia.cupo}</span>
                      </div>
                      <div className="info-item">
                        <span className="icon">📊</span>
                        <span>Disponibles: {competencia.disponibles || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="card-footer">
                    <button 
                      onClick={() => manejarInscripcion(competencia.id_competencia)}
                      className="btn primary full-width"
                      disabled={(competencia.disponibles || 0) === 0}
                    >
                      {(competencia.disponibles || 0) === 0 ? 'Sin Cupos' : 'Participar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Premios Section */}
      <section className="premios-section">
        <div className="container">
          <h2>Premios y Reconocimientos</h2>
          <div className="premios-grid">
            <div className="premio-card">
              <div className="premio-icon">🥇</div>
              <h3>Primer Lugar</h3>
              <p>Certificado de excelencia y premio en efectivo</p>
            </div>
            <div className="premio-card">
              <div className="premio-icon">🥈</div>
              <h3>Segundo Lugar</h3>
              <p>Certificado de mérito y reconocimiento</p>
            </div>
            <div className="premio-card">
              <div className="premio-icon">🥉</div>
              <h3>Tercer Lugar</h3>
              <p>Certificado de participación destacada</p>
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

export default Competencias;