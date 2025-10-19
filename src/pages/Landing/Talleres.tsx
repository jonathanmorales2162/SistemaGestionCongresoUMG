import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { talleresService } from '../../api';
import type { Taller } from '../../types';

const Talleres: React.FC = () => {
  const [talleres, setTalleres] = useState<Taller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    cargarTalleres();
  }, []);

  const cargarTalleres = async () => {
    try {
      setLoading(true);
      const response = await talleresService.obtenerTalleres();
      if (response.talleres) {
        setTalleres(response.talleres);
      }
    } catch (err) {
      setError('Error al cargar los talleres');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const manejarInscripcion = async (tallerId: number) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      // Aquí iría la lógica de inscripción usando inscripcionesService
      console.log('Inscribiendo al taller:', tallerId);
      alert('¡Inscripción exitosa!');
    } catch (err) {
      console.error('Error en inscripción:', err);
      alert('Error al procesar la inscripción');
    }
  };

  if (loading) {
    return (
      <div className="talleres-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando talleres...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="talleres-page">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={cargarTalleres} className="btn primary">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="talleres-page">
      {/* Header */}
      <header className="page-header">
        <nav className="nav-container">
          <Link to="/" className="nav-brand">
            <h2>Congreso Tecnológico UMG</h2>
          </Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">Inicio</Link>
            <Link to="/talleres" className="nav-link active">Talleres</Link>
            <Link to="/competencias" className="nav-link">Competencias</Link>
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
          <h1>Talleres Especializados</h1>
          <p>Participa en talleres prácticos dirigidos por expertos de la industria</p>
        </div>
      </section>

      {/* Talleres Grid */}
      <section className="talleres-section">
        <div className="container">
          <div className="section-header">
            <h2>Talleres Disponibles</h2>
            <p>Descubre y participa en nuestros talleres especializados</p>
          </div>

          {talleres.length === 0 ? (
            <div className="empty-state">
              <h3>No hay talleres disponibles</h3>
              <p>Pronto publicaremos nuevos talleres</p>
            </div>
          ) : (
            <div className="talleres-grid">
              {talleres.map((taller) => (
                <div key={taller.id_taller} className="taller-card">
                  <div className="card-header">
                    <h3 className="taller-titulo">{taller.titulo}</h3>
                    <span className="taller-categoria">{taller.categoria?.nombre || 'General'}</span>
                  </div>
                  
                  <div className="card-body">
                    <p className="taller-descripcion">{taller.descripcion}</p>
                    
                    <div className="taller-info">
                      <div className="info-item">
                        <span className="icon">👨‍🏫</span>
                        <span>Instructor: {taller.instructor || 'No asignado'}</span>
                      </div>
                      <div className="info-item">
                        <span className="icon">📅</span>
                        <span>Fecha: {new Date(taller.horario).toLocaleDateString()}</span>
                      </div>
                      <div className="info-item">
                        <span className="icon">🕐</span>
                        <span>Horario: {new Date(taller.horario).toLocaleTimeString()}</span>
                      </div>
                      <div className="info-item">
                        <span className="icon">👥</span>
                        <span>Cupos disponibles: {taller.disponibles || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="card-footer">
                    <button 
                      onClick={() => manejarInscripcion(taller.id_taller)}
                      className="btn primary full-width"
                      disabled={(taller.disponibles || 0) === 0}
                    >
                      {(taller.disponibles || 0) === 0 ? 'Sin Cupos' : 'Inscribirme'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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

export default Talleres;