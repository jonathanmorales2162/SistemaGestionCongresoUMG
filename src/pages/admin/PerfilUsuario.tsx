import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const PerfilUsuario: React.FC = () => {
  const { usuario } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: usuario?.nombre || '',
    correo: usuario?.correo || '',
    telefono: usuario?.telefono || '',
    institucion: usuario?.colegio || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Aquí iría la lógica para guardar los cambios
    console.log('Guardando cambios:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      nombre: usuario?.nombre || '',
      correo: usuario?.correo || '',
      telefono: usuario?.telefono || '',
      institucion: usuario?.colegio || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="perfil-usuario">
      <div className="page-header">
        <h2 className="page-title">Mi Perfil</h2>
        <p className="page-subtitle">Gestiona tu información personal y configuraciones</p>
      </div>

      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar-section">
            <div className="profile-avatar large">
              {usuario?.nombre?.charAt(0).toUpperCase() || 'U'}
            </div>
            <button className="change-avatar-btn">
              📷 Cambiar Foto
            </button>
          </div>
          
          <div className="profile-info">
            <h3 className="profile-name">{usuario?.nombre}</h3>
            <p className="profile-role">{usuario?.id_rol || 'Sin rol asignado'}</p>
            <p className="profile-email">{usuario?.correo}</p>
            <div className="profile-badges">
              <span className="badge active">Activo</span>
              <span className="badge verified">Verificado</span>
            </div>
          </div>

          <div className="profile-actions">
            {!isEditing ? (
              <button 
                className="btn primary"
                onClick={() => setIsEditing(true)}
              >
                ✏️ Editar Perfil
              </button>
            ) : (
              <div className="edit-actions">
                <button 
                  className="btn success"
                  onClick={handleSave}
                >
                  ✅ Guardar
                </button>
                <button 
                  className="btn secondary"
                  onClick={handleCancel}
                >
                  ❌ Cancelar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="profile-content">
          {/* Personal Information */}
          <div className="profile-section">
            <h4 className="section-title">Información Personal</h4>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Nombre Completo</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                ) : (
                  <p className="form-value">{usuario?.nombre || 'No especificado'}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Correo Electrónico</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                ) : (
                  <p className="form-value">{usuario?.correo || 'No especificado'}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Teléfono</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Ej: +502 1234-5678"
                  />
                ) : (
                  <p className="form-value">{formData.telefono || 'No especificado'}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Institución</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="institucion"
                    value={formData.institucion}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Ej: Universidad Mariano Gálvez"
                  />
                ) : (
                  <p className="form-value">{formData.institucion || 'No especificado'}</p>
                )}
              </div>

            </div>
          </div>

          {/* Account Settings */}
          <div className="profile-section">
            <h4 className="section-title">Configuración de Cuenta</h4>
            <div className="settings-list">
              <div className="setting-item">
                <div className="setting-info">
                  <h5 className="setting-title">Notificaciones por Email</h5>
                  <p className="setting-description">Recibir notificaciones sobre el congreso</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h5 className="setting-title">Notificaciones Push</h5>
                  <p className="setting-description">Recibir notificaciones en tiempo real</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h5 className="setting-title">Perfil Público</h5>
                  <p className="setting-description">Permitir que otros vean tu perfil</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="profile-section">
            <h4 className="section-title">Seguridad</h4>
            <div className="security-actions">
              <button className="btn secondary">
                🔒 Cambiar Contraseña
              </button>
              <button className="btn secondary">
                🔐 Configurar 2FA
              </button>
              <button className="btn secondary">
                📱 Dispositivos Conectados
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilUsuario;