import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UsuarioRegistro } from '../../types/Usuario';
import type { Rol } from '../../types/Rol';
import { rolesService } from '../../api/rolesService';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<UsuarioRegistro>({
    nombre: '',
    correo: '',
    password: '',
    telefono: '',
    colegio: '',
    tipo: 'E',
    id_rol: 1
  });
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [roles, setRoles] = useState<Rol[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
        // Si no se pueden cargar los roles, usar roles por defecto
        setRoles([
          { id: 1, nombre: 'Participante', descripcion: 'Participante del congreso' },
          { id: 2, nombre: 'Staff', descripcion: 'Personal de apoyo' },
          { id: 3, nombre: 'Organizador', descripcion: 'Organizador del evento' }
        ]);
      }
    };

    loadRoles();
  }, []);

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
    if (!formData.nombre || !formData.correo || !formData.password) {
      setError('Por favor, completa todos los campos obligatorios');
      return false;
    }

    if (!formData.correo.includes('@')) {
      setError('Por favor, ingresa un correo válido');
      return false;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    if (formData.password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await register(formData);
      // Redirigir al dashboard después del registro exitoso
      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      setError(error.message || 'Error en el registro');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <div className="auth-header">
          <h1>Crear Cuenta</h1>
          <p>Únete al Congreso Tecnológico UMG</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">Nombre Completo *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Tu nombre completo"
                required
                disabled={isLoading}
              />
            </div>

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
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
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
            <label htmlFor="rol">Rol</label>
            <select
              id="rol"
              name="id_rol"
              value={formData.id_rol}
              onChange={handleChange}
              disabled={isLoading}
            >
              {roles.map((rol) => (
                <option key={rol.id} value={rol.nombre}>
                  {rol.nombre} - {rol.descripcion}
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