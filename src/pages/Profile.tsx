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
  foto_url?: string;
}

const Profile: React.FC = () => {
  const { usuario, updateUser } = useAuth();
  const [formData, setFormData] = useState<ProfileFormData>({
    nombre: usuario?.nombre || '',
    apellido: usuario?.apellido || '',
    telefono: usuario?.telefono || '',
    institucion: usuario?.institucion || usuario?.colegio || '',
    foto_url: usuario?.foto_url || usuario?.foto_perfil || ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [previewImage, setPreviewImage] = useState<string>(usuario?.foto_url || usuario?.foto_perfil || '');
  const [showJsonPreview, setShowJsonPreview] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Función para generar el JSON que se enviará al servidor
  const generateRequestJson = () => {
    const updateData: Partial<ProfileFormData> = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      telefono: formData.telefono,
      institucion: formData.institucion
    };

    // Solo incluir foto_url si se cambió
    if (formData.foto_url !== (usuario?.foto_url || usuario?.foto_perfil)) {
      updateData.foto_url = formData.foto_url;
    }

    return updateData;
  };

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
      // Crear preview local temporal
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      console.log('🔄 Iniciando subida de imagen a Cloudinary...');
      
      // PASO 1: Subir imagen a Cloudinary
      const uploadResult = await uploadImageCloudinary(file);
      
      if (uploadResult.success && uploadResult.url) {
        console.log('✅ Imagen subida exitosamente a Cloudinary:', uploadResult.url);
        
        // PASO 2: Actualizar el estado del formulario con la URL de Cloudinary
        setFormData(prev => ({
          ...prev,
          foto_url: uploadResult.url // Esta es la URL que se enviará en el PUT
        }));
        
        // Actualizar preview con la URL de Cloudinary
        setPreviewImage(uploadResult.url);
        setImageError(false); // Limpiar estado de error
        setMessage({ type: 'success', text: 'Imagen cargada exitosamente. Recuerda guardar los cambios.' });
        
        console.log('📝 URL de imagen guardada en formData.foto_url:', uploadResult.url);
      } else {
        console.error('❌ Error al subir imagen a Cloudinary:', uploadResult.error);
        setMessage({ type: 'error', text: uploadResult.error || 'Error al cargar la imagen' });
        // Restaurar imagen anterior si falla
        setPreviewImage(usuario?.foto_url || usuario?.foto_perfil || '');
        setImageError(false); // Limpiar estado de error al restaurar
      }
    } catch (error) {
      console.error('❌ Error inesperado al cargar imagen:', error);
      setMessage({ type: 'error', text: 'Error al cargar la imagen' });
      setPreviewImage(usuario?.foto_url || usuario?.foto_perfil || '');
      setImageError(false); // Limpiar estado de error al restaurar
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      console.log('🔄 Iniciando actualización de perfil...');
      
      // PASO 3: Preparar datos para enviar al backend (PUT)
      const updateData: Partial<ProfileFormData> = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        institucion: formData.institucion
      };

      // Solo incluir foto_perfil si se cambió (contiene la URL de Cloudinary)
      if (formData.foto_url !== usuario?.foto_url) {
        updateData.foto_url = formData.foto_url; // URL de Cloudinary obtenida en handleImageChange
        console.log('📸 Incluyendo nueva foto_url en PUT:', updateData.foto_url);
      }

      console.log('📤 Datos a enviar en PUT /usuarios/:id:', updateData);

      // PASO 4: Enviar PUT al backend con la URL de Cloudinary
      const usuarioActualizado = await usuariosService.updateProfile(updateData);
      
      console.log('✅ Perfil actualizado exitosamente:', usuarioActualizado);
      
      // Verificar que tenemos un usuario válido antes de actualizar el contexto
      if (usuarioActualizado && typeof usuarioActualizado === 'object') {
        // PASO 5: Actualizar contexto de autenticación
        await updateUser(usuarioActualizado);
        setMessage({ type: 'success', text: 'Perfil actualizado exitosamente' });
      } else {
        console.error('❌ Usuario actualizado no válido:', usuarioActualizado);
        setMessage({ 
          type: 'error', 
          text: 'Error: Respuesta del servidor no válida' 
        });
      }
    } catch (error) {
      console.error('❌ Error al actualizar perfil:', error);
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

  // Función helper para obtener la URL de imagen con respaldo
  const getImageUrl = () => {
    // Si hay error de imagen, no mostrar ninguna imagen
    if (imageError) return null;
    
    // Prioridad: previewImage > usuario.foto_url > usuario.foto_perfil > null
    if (previewImage) return previewImage;
    if (usuario?.foto_url) return usuario.foto_url;
    if (usuario?.foto_perfil) return usuario.foto_perfil;
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Mi Perfil</h1>
            <p className="text-gray-300 text-sm">Actualiza tu información personal</p>
          </div>

          {/* Profile Card */}
          <div className="profile-card">
            <form onSubmit={handleSubmit} className="profile-form">
              {/* Profile Image Section */}
              <div className="profile-image-section mb-6">
                <div className="profile-image-container w-24 h-24 mx-auto" onClick={handleImageClick}>
                  {getImageUrl() ? (
                    <img 
                      src={getImageUrl()!} 
                      alt="Foto de perfil" 
                      className="profile-image w-full h-full rounded-full object-cover"
                      onError={(e) => {
                        // Si la imagen falla al cargar, marcar error y mostrar avatar con iniciales
                        console.log('❌ Error al cargar imagen de perfil:', e.currentTarget.src);
                        setImageError(true);
                        setPreviewImage(''); // Limpiar previewImage para mostrar avatar
                      }}
                      onLoad={() => {
                        // Si la imagen se carga correctamente, limpiar el estado de error
                        setImageError(false);
                      }}
                    />
                  ) : (
                    <div className="profile-avatar w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="profile-initials text-white text-lg font-bold">
                        {getInitials(formData.nombre || 'U', formData.apellido || 'U')}
                      </span>
                    </div>
                  )}
                  
                  <div className="profile-image-overlay absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                    {isUploadingImage ? (
                      <div className="upload-spinner">
                        <div className="spinner w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <div className="upload-icon text-white">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                
                <p className="profile-image-hint text-center text-gray-400 text-xs mt-2">
                  Haz clic para cambiar tu foto
                </p>
              </div>

              {/* Form Fields - Compact Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="form-group">
                  <label htmlFor="nombre" className="form-label block text-sm font-medium text-gray-300 mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    className="form-input w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tu nombre"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="apellido" className="form-label block text-sm font-medium text-gray-300 mb-1">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    required
                    className="form-input w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tu apellido"
                  />
                </div>

                <div className="form-group md:col-span-2">
                  <label htmlFor="correo" className="form-label block text-sm font-medium text-gray-300 mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id="correo"
                    value={usuario?.correo || ''}
                    disabled
                    className="form-input-disabled w-full px-3 py-2 bg-gray-600/50 border border-gray-500 rounded-lg text-gray-400 cursor-not-allowed"
                    placeholder="correo@ejemplo.com"
                  />
                  <p className="form-hint text-xs text-gray-500 mt-1">El correo no se puede modificar</p>
                </div>

                <div className="form-group">
                  <label htmlFor="telefono" className="form-label block text-sm font-medium text-gray-300 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className="form-input w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tu teléfono"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="institucion" className="form-label block text-sm font-medium text-gray-300 mb-1">
                    Institución
                  </label>
                  <input
                    type="text"
                    id="institucion"
                    name="institucion"
                    value={formData.institucion}
                    onChange={handleInputChange}
                    className="form-input w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tu institución"
                  />
                </div>
              </div>

              {/* Message Display */}
              {message && (
                <div className={`message-alert mb-4 p-3 rounded-lg text-sm ${
                  message.type === 'success' 
                    ? 'bg-green-500/20 border border-green-500/30 text-green-300' 
                    : 'bg-red-500/20 border border-red-500/30 text-red-300'
                }`}>
                  {message.text}
                </div>
              )}

              {/* JSON Preview Section */}
              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => setShowJsonPreview(!showJsonPreview)}
                  className="w-full bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg p-3 text-left text-gray-300 text-sm transition-all duration-200 flex items-center justify-between"
                >
                  <span>🔍 Preview del JSON que se enviará</span>
                  <span className={`transform transition-transform duration-200 ${showJsonPreview ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                
                {showJsonPreview && (
                  <div className="mt-3 bg-gray-900/50 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400 font-mono">PUT /usuarios/perfil</span>
                      <span className="text-xs text-blue-400">Request Body</span>
                    </div>
                    <pre className="text-xs text-green-300 font-mono bg-black/30 p-3 rounded border overflow-x-auto">
{JSON.stringify(generateRequestJson(), null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="submit-button bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium py-2 px-8 rounded-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center mx-auto min-w-[140px]"
                >
                  {isLoading ? (
                    <>
                      <div className="spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
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