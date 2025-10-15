import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

// Importar páginas
import LandingPage from '../pages/LandingPage';
import Dashboard from '../pages/Dashboard';
import ForoConferencias from '../pages/ForoConferencias';
import NotFound from '../pages/NotFound';

// Importar componentes de autenticación
import LoginForm from '../components/Auth/LoginForm';
import RegisterForm from '../components/Auth/RegisterForm';

const AppRouter: React.FC = () => {
  return (
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />

          {/* Rutas protegidas */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/foros" 
            element={
              <ProtectedRoute>
                <ForoConferencias />
              </ProtectedRoute>
            } 
          />

          {/* Rutas protegidas con roles específicos (para futuro uso) */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="Admin">
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/organizador" 
            element={
              <ProtectedRoute requiredRole="Organizador">
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          {/* Redirección por defecto para usuarios autenticados */}
          <Route path="/home" element={<Navigate to="/dashboard" replace />} />

          {/* Página 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
  );
};

export default AppRouter;