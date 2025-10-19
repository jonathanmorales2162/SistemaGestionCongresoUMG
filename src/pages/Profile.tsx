import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { usuariosService } from '../api/usuariosService';
import { uploadImageCloudinary } from '../services/UploadService';
import Navbar from '../components/Navbar';

interface ProfileFormData {
  nombre: string;
  apellido: string;
  telefono: string;
  institucion: string;
  foto_perfil?: string;
}

const Profile: React.FC = () => {
  const { usuario, updateUser } = useAuth();
  const [formData, setFormData] = useState<ProfileFormData>({
    nombre: usuario?.nombre || '',
    apellido: usuario?.apellido || '',
    telefono: usuario?.telefono || '',
    institucion: usuario?.institucion || usuario?.colegio || '',
    foto_perfil: usuario?.foto_perfil || ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [previewImage, setPreviewImage] = useState<string>(usuario?.foto_perfil || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Por favor selecciona un archivo de imagen válido' });
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'La imagen no puede ser mayor a 5MB' });
      return;
    }

    setIsUploadingImage(true);
    setMessage(null);

    try {
      // Crear preview local
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Subir a Cloudinary
      const uploadResult = await uploadImageCloudinary(file);
      
      if (uploadResult.success && uploadResult.url) {
        setFormData(prev => ({
          ...prev,
          foto_perfil: uploadResult.url
        }));
        setPreviewImage(uploadResult.url);
        setMessage({ type: 'success', text: 'Imagen cargada exitosamente' });
      } else {
        setMessage({ type: 'error', text: uploadResult.error || 'Error al cargar la imagen' });
        // Restaurar imagen anterior si falla
        setPreviewImage(usuario?.foto_perfil || '');
      }
    } catch (error) {
      console.error('Error al cargar imagen:', error);
      setMessage({ type: 'error', text: 'Error al cargar la imagen' });
      setPreviewImage(usuario?.foto_perfil || '');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // Preparar datos para enviar
      const updateData: Partial<ProfileFormData> = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        institucion: formData.institucion
      };

      // Solo incluir foto_perfil si se cambió
      if (formData.foto_perfil !== usuario?.foto_perfil) {
        updateData.foto_perfil = formData.foto_perfil;
      }

      // Actualizar en el backend
      const usuarioActualizado = await usuariosService.updateProfile(updateData);
      
      // Actualizar contexto de autenticación
      await updateUser(usuarioActualizado);
      
      setMessage({ type: 'success', text: 'Perfil actualizado exitosamente' });
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Error al actualizar el perfil' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (nombre: string, apellido: string) => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Mi Perfil</h1>
            <p className="text-gray-300">Actualiza tu información personal</p>
          </div>

          {/* Profile Card */}
          <div className="profile-card">
            <form onSubmit={handleSubmit} className="profile-form">
              {/* Profile Image Section */}
              <div className="profile-image-section">
                <div className="profile-image-container" onClick={handleImageClick}>
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt="Foto de perfil" 
                      className="profile-image"
                    />
                  ) : (
                    <div className="profile-avatar">
                      <span className="profile-initials">
                        {getInitials(formData.nombre || 'U', formData.apellido || 'U')}
                      </span>
                    </div>
                  )}
                  
                  <div className="profile-image-overlay">
                    {isUploadingImage ? (
                      <div className="upload-spinner">
                        <div className="spinner"></div>
                      </div>
                    ) : (
                      <div className="upload-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 16L12 8M12 8L9 11M12 8L15 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                
                <p className="profile-image-hint">
                  Haz clic para cambiar tu foto de perfil
                </p>
              </div>

              {/* Form Fields */}
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="nombre" className="form-label">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Tu nombre"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="apellido" className="form-label">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Tu apellido"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="correo" className="form-label">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id="correo"
                    value={usuario?.correo || ''}
                    disabled
                    className="form-input form-input-disabled"
                    placeholder="correo@ejemplo.com"
                  />
                  <p className="form-hint">El correo no se puede modificar</p>
                </div>

                <div className="form-group">
                  <label htmlFor="telefono" className="form-label">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Tu número de teléfono"
                  />
                </div>

                <div className="form-group form-group-full">
                  <label htmlFor="institucion" className="form-label">
                    Institución
                  </label>
                  <input
                    type="text"
                    id="institucion"
                    name="institucion"
                    value={formData.institucion}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Tu institución educativa"
                  />
                </div>
              </div>

              {/* Message */}
              {message && (
                <div className={`form-message ${message.type === 'success' ? 'form-message-success' : 'form-message-error'}`}>
                  {message.text}
                </div>
              )}

              {/* Submit Button */}
              <div className="form-actions">
                <button
                  type="submit"
                  disabled={isLoading || isUploadingImage}
                  className="btn-primary"
                >
                  {isLoading ? (
                    <>
                      <div className="btn-spinner"></div>
                      Actualizando...
                    </>
                  ) : (
                    'Actualizar Perfil'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;