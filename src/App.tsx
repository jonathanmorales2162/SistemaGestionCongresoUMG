import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRouter from './routes/AppRouter';

// Importar estilos globales
import './styles/components.css';
import './styles/pages.css';
import './styles/auth.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app">
          <AppRouter />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
