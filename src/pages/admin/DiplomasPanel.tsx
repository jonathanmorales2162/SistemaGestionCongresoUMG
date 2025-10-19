import React, { useState, useEffect } from 'react';
import { diplomasService } from '../../api';
import { useAuth } from '../../context/AuthContext';

const DiplomasPanel: React.FC = () => {
  const [estadisticas, setEstadisticas] = useState({
    diplomasGenerados: 0,
    enviados: 0,
    pendientes: 0,
    elegibles: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { usuario } = useAuth();

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      const stats = await diplomasService.obtenerEstadisticas();
      setEstadisticas(stats);
    } catch (err) {
      setError('Error al cargar estadísticas de diplomas');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerarDiplomas = async () => {
    try {
      await diplomasService.generarDiplomasMasivo();
      await cargarEstadisticas();
      alert('Diplomas generados exitosamente');
    } catch (err) {
      setError('Error al generar diplomas');
      console.error('Error:', err);
    }
  };

  const handleEnviarDiplomas = async () => {
    try {
      await diplomasService.enviarDiplomasMasivo();
      await cargarEstadisticas();
      alert('Diplomas enviados exitosamente');
    } catch (err) {
      setError('Error al enviar diplomas');
      console.error('Error:', err);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando estadísticas de diplomas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="diplomas-panel">
      <div className="page-header">
        <h2 className="page-title">Generación y Envío de Diplomas</h2>
        <p className="page-subtitle">Gestiona la creación y distribución de certificados de participación</p>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="panel-content">
        {/* Stats Cards */}
        <div className="stats-row">
          <div className="stat-card purple">
            <div className="stat-icon">🎓</div>
            <div className="stat-info">
              <h3 className="stat-number">{estadisticas.diplomasGenerados}</h3>
              <p className="stat-label">Diplomas Generados</p>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon">📧</div>
            <div className="stat-info">
              <h3 className="stat-number">{estadisticas.enviados}</h3>
              <p className="stat-label">Enviados</p>
            </div>
          </div>
          <div className="stat-card orange">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3 className="stat-number">{estadisticas.pendientes}</h3>
              <p className="stat-label">Pendientes</p>
            </div>
          </div>
          <div className="stat-card blue">
            <div className="stat-icon">📋</div>
            <div className="stat-info">
              <h3 className="stat-number">{estadisticas.elegibles}</h3>
              <p className="stat-label">Elegibles</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            className="btn btn-primary"
            onClick={handleGenerarDiplomas}
          >
            <span className="btn-icon">🎓</span>
            Generar Diplomas
          </button>
          <button 
            className="btn btn-secondary"
            onClick={handleEnviarDiplomas}
          >
            <span className="btn-icon">📧</span>
            Enviar por Email
          </button>
          <button 
            className="btn btn-outline"
            onClick={() => {/* TODO: Implementar descarga de plantilla */}}
          >
            <span className="btn-icon">📄</span>
            Descargar Plantilla
          </button>
          <button 
            className="btn btn-outline"
            onClick={() => {/* TODO: Implementar configuración de diseño */}}
          >
            <span className="btn-icon">⚙️</span>
            Configurar Diseño
          </button>
        </div>

        {/* Placeholder Content */}
        <div className="placeholder-content">
          <div className="placeholder-icon">🎓</div>
          <h3 className="placeholder-title">Sistema de Diplomas</h3>
          <p className="placeholder-description">
            Este módulo permitirá gestionar la generación y distribución de diplomas, incluyendo:
          </p>
          <ul className="placeholder-features">
            <li>✅ Generación automática de diplomas PDF</li>
            <li>✅ Plantillas personalizables</li>
            <li>✅ Validación de requisitos de asistencia</li>
            <li>✅ Envío masivo por correo electrónico</li>
            <li>✅ Códigos QR de verificación</li>
            <li>✅ Registro de entregas</li>
            <li>✅ Reenvío de diplomas perdidos</li>
            <li>✅ Estadísticas de distribución</li>
            <li>✅ Integración con base de datos de participantes</li>
            <li>✅ Firma digital y autenticación</li>
          </ul>
          <div className="placeholder-note">
            <strong>Estado:</strong> En desarrollo - Funcionalidad próximamente disponible
          </div>
        </div>

        {/* Template Preview */}
        <div className="template-section">
          <h4 className="section-title">Vista Previa de Plantilla</h4>
          <div className="template-preview">
            <div className="diploma-mockup">
              <div className="diploma-header">
                <h5>Universidad Mariano Gálvez</h5>
                <p>Congreso Tecnológico 2025</p>
              </div>
              <div className="diploma-content">
                <h6>Certificado de Participación</h6>
                <p>Se otorga a:</p>
                <div className="participant-name">[Nombre del Participante]</div>
                <p>Por su participación en el Congreso Tecnológico UMG 2025</p>
              </div>
              <div className="diploma-footer">
                <div className="signature-section">
                  <div className="signature">
                    <div className="signature-line"></div>
                    <p>Director del Congreso</p>
                  </div>
                  <div className="qr-code">
                    <div className="qr-placeholder">QR</div>
                    <p>Código de Verificación</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiplomasPanel;