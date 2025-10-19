import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UsuarioLogin } from '../../types/Usuario';
import Notification from '../Notification';

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<UsuarioLogin>({
    correo: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [notification, setNotification] = useState({
    message: '',
    type: 'success' as 'success' | 'error',
    isVisible: false
  });

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener la ruta desde donde vino el usuario
  const from = location.state?.from?.pathname || '/dashboard';

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({
      message,
      type,
      isVisible: true
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validaciones básicas
    if (!formData.correo || !formData.password) {
      showNotification('Por favor, completa todos los campos', 'error');
      setIsLoading(false);
      return;
    }

    if (!formData.correo.includes('@')) {
      showNotification('Por favor, ingresa un correo válido', 'error');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Iniciando login con:', formData);
      await login(formData);
      console.log('Login exitoso, redirigiendo a:', from);
      
      // Redirigir inmediatamente después del login exitoso
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error('Error en login:', error);
      showNotification(error.message || 'Error en el inicio de sesión', 'error');
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
      
      <div className="auth-card">
        <div className="auth-header">
          <h1>Iniciar Sesión</h1>
          <p>Accede al Sistema de Gestión del Congreso UMG</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
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

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
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

          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner-small"></span>
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="auth-link">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;