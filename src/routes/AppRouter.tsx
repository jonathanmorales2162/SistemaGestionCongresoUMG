import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

// Importar páginas
import LandingPage from '../pages/LandingPage';
import Dashboard from '../pages/Dashboard';
import ForoConferencias from '../pages/ForoConferencias';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';

// Importar páginas de Landing
import Talleres from '../pages/Landing/Talleres';
import Competencias from '../pages/Landing/Competencias';
import Contacto from '../pages/Landing/Contacto';

// Importar paneles de administración
import TalleresPanel from '../pages/admin/TalleresPanel';
import CompetenciasPanel from '../pages/admin/CompetenciasPanel';
import ForosPanel from '../pages/admin/ForosPanel';
import Usuarios from '../pages/admin/Usuarios';

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
          <Route path="/talleres" element={<Talleres />} />
          <Route path="/competencias" element={<Competencias />} />
          <Route path="/contacto" element={<Contacto />} />

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

          <Route 
            path="/perfil" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />

          {/* Rutas de administración */}
          <Route 
            path="/admin/talleres" 
            element={
              <ProtectedRoute requiredRole="Admin">
                <TalleresPanel />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/competencias" 
            element={
              <ProtectedRoute requiredRole="Admin">
                <CompetenciasPanel />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/foros" 
            element={
              <ProtectedRoute requiredRole="Admin">
                <ForosPanel />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/usuarios" 
            element={
              <ProtectedRoute requiredRole="Admin">
                <Usuarios />
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