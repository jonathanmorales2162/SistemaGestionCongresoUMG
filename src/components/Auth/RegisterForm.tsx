import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UsuarioRegistro } from '../../types/Usuario';
import type { Rol } from '../../types/Rol';
import { rolesService } from '../../api/rolesService';
import Notification from '../Notification';
import '../../styles/auth.css';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<UsuarioRegistro>({
    nombre: '',
    apellido: '',
    correo: '',
    password: '',
    telefono: '',
    colegio: '',
    tipo: 'E',
    id_rol: 0
  });
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [roles, setRoles] = useState<Rol[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false
  });

  const { register } = useAuth();
  const navigate = useNavigate();

  // Cargar roles disponibles
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const rolesData = await rolesService.getRoles();
        setRoles(rolesData);
      } catch (error) {
        console.error('Error al cargar roles:', error);
        // Fallback con roles por defecto
        setRoles([
          { id_rol: 1, nombre: 'Admin' },
          { id_rol: 2, nombre: 'Organizador' },
          { id_rol: 3, nombre: 'Staff' },
          { id_rol: 4, nombre: 'Participante' }
        ]);
      }
    };

    loadRoles();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prev => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.nombre.trim()) {
      errors.push('El nombre es requerido');
    }

    if (!formData.apellido.trim()) {
      errors.push('El apellido es requerido');
    }

    if (!formData.correo.trim()) {
      errors.push('El email es requerido');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.correo)) {
        errors.push('El formato del email no es válido');
      }
    }

    if (!formData.password) {
      errors.push('La contraseña es requerida');
    } else if (formData.password.length < 6) {
      errors.push('La contraseña debe tener al menos 6 caracteres');
    }

    if (formData.password !== confirmPassword) {
      errors.push('Las contraseñas no coinciden');
    }

    if (!formData.tipo || (formData.tipo !== 'I' && formData.tipo !== 'E')) {
      errors.push('Debes seleccionar el tipo de estudiante');
    }

    if (!formData.id_rol || formData.id_rol === 0) {
      errors.push('Debes seleccionar un rol');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({
      message,
      type,
      isVisible: true
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setValidationErrors([]);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Convertir id_rol a número antes de enviar
      const dataToSend = {
        ...formData,
        id_rol: Number(formData.id_rol)
      };
      
      await register(dataToSend);
      
      // Mostrar notificación de éxito
      showNotification('¡Cuenta creada exitosamente! Redirigiendo al login...', 'success');
      
      // Redirigir al login después del registro exitoso
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
    } catch (error: any) {
      const errorMessage = error.message || 'Error en el registro. Por favor, intenta nuevamente.';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
      
      {/* Botón de retorno a la landing page */}
      <Link to="/" className="back-to-home-btn">
        ← Volver al inicio
      </Link>
      
      <div className="auth-card register-card">
        <div className="auth-header">
          <h1>Crear Cuenta</h1>
          <p>Únete al Congreso Tecnológico UMG</p>
        </div>

        <div className="register-content">
          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">Nombre *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Tu nombre"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="apellido">Apellido *</label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Tu apellido"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                placeholder="tu@email.com"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Contraseña *</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  minLength={6}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={togglePasswordVisibility}
                  disabled={isLoading}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña *</label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={toggleConfirmPasswordVisibility}
                  disabled={isLoading}
                  aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="+502 1234-5678"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="institucion">Institución</label>
              <input
                type="text"
                id="institucion"
                name="colegio"
                value={formData.colegio}
                onChange={handleChange}
                placeholder="Universidad, empresa, etc."
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tipo">Tipo de Estudiante *</label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              disabled={isLoading}
              required
            >
              <option value="E">Estudiante Externo</option>
              <option value="I">Estudiante Interno</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="rol">Rol</label>
            <select
              id="rol"
              name="id_rol"
              value={formData.id_rol}
              onChange={handleChange}
              disabled={isLoading}
              required
            >
              <option value={0}>Selecciona un rol</option>
              {roles.map((rol) => (
                <option key={rol.id_rol} value={rol.id_rol}>
                  {rol.nombre}{rol.descripcion ? ` - ${rol.descripcion}` : ''}
                </option>
              ))}
            </select>
          </div>

            <button 
              type="submit" 
              className="auth-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner-small"></span>
                  Creando cuenta...
                </>
              ) : (
                'Crear Cuenta'
              )}
            </button>
          </form>

          {/* Panel de validaciones */}
          {validationErrors.length > 0 && (
            <div className="validation-panel">
              <h3>Campos requeridos:</h3>
              <ul>
                {validationErrors.map((error, index) => (
                  <li key={index}>
                    <span className="validation-icon">❌</span>
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="auth-footer">
          <p>
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="auth-link">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;