import React from 'react';

const DiplomasPanel: React.FC = () => {
  return (
    <div className="diplomas-panel">
      <div className="page-header">
        <h2 className="page-title">Generación y Envío de Diplomas</h2>
        <p className="page-subtitle">Gestiona la creación y distribución de certificados de participación</p>
      </div>

      <div className="panel-content">
        {/* Stats Cards */}
        <div className="stats-row">
          <div className="stat-card purple">
            <div className="stat-icon">🎓</div>
            <div className="stat-info">
              <h3 className="stat-number">156</h3>
              <p className="stat-label">Diplomas Generados</p>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon">📧</div>
            <div className="stat-info">
              <h3 className="stat-number">142</h3>
              <p className="stat-label">Enviados</p>
            </div>
          </div>
          <div className="stat-card orange">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3 className="stat-number">14</h3>
              <p className="stat-label">Pendientes</p>
            </div>
          </div>
          <div className="stat-card blue">
            <div className="stat-icon">📋</div>
            <div className="stat-info">
              <h3 className="stat-number">189</h3>
              <p className="stat-label">Elegibles</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="btn primary">
            🎓 Generar Diplomas
          </button>
          <button className="btn secondary">
            📧 Enviar por Email
          </button>
          <button className="btn tertiary">
            📄 Vista Previa
          </button>
          <button className="btn quaternary">
            ⚙️ Configurar Plantilla
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
                <p>Congreso Tecnológico 2024</p>
              </div>
              <div className="diploma-content">
                <h6>Certificado de Participación</h6>
                <p>Se otorga a:</p>
                <div className="participant-name">[Nombre del Participante]</div>
                <p>Por su participación en el Congreso Tecnológico UMG 2024</p>
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