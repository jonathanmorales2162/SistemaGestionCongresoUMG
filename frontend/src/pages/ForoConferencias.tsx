import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

interface ForoData {
  id: number;
  titulo: string;
  ponente: string;
  descripcion: string;
  horario: string;
  fecha: string;
  sala: string;
  categoria: string;
  participantes: number;
  estado: 'activo' | 'programado' | 'finalizado';
}

const ForoConferencias: React.FC = () => {
  const { usuario } = useAuth();
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');

  // Datos estáticos de foros (en el futuro vendrán del backend)
  const foros: ForoData[] = [
    {
      id: 1,
      titulo: 'Inteligencia Artificial en la Medicina',
      ponente: 'Dra. Ana Martínez',
      descripcion: 'Exploraremos cómo la IA está revolucionando el diagnóstico médico y el tratamiento personalizado.',
      horario: '09:00 - 10:30',
      fecha: '2024-11-15',
      sala: 'Auditorio Principal',
      categoria: 'Inteligencia Artificial',
      participantes: 45,
      estado: 'activo'
    },
    {
      id: 2,
      titulo: 'Blockchain y el Futuro de las Finanzas',
      ponente: 'Ing. Carlos Rodríguez',
      descripcion: 'Análisis profundo de cómo blockchain está transformando el sector financiero global.',
      horario: '11:00 - 12:30',
      fecha: '2024-11-15',
      sala: 'Sala de Conferencias A',
      categoria: 'Blockchain',
      participantes: 32,
      estado: 'programado'
    },
    {
      id: 3,
      titulo: 'Desarrollo Sostenible con IoT',
      ponente: 'Ing. María González',
      descripcion: 'Cómo el Internet de las Cosas contribuye a un desarrollo más sostenible y eficiente.',
      horario: '14:00 - 15:30',
      fecha: '2024-11-15',
      sala: 'Lab de Innovación',
      categoria: 'IoT',
      participantes: 28,
      estado: 'activo'
    },
    {
      id: 4,
      titulo: 'Ciberseguridad en la Era Digital',
      ponente: 'Dr. Roberto Silva',
      descripcion: 'Estrategias y mejores prácticas para proteger datos en un mundo cada vez más conectado.',
      horario: '16:00 - 17:30',
      fecha: '2024-11-14',
      sala: 'Auditorio Secundario',
      categoria: 'Ciberseguridad',
      participantes: 67,
      estado: 'finalizado'
    },
    {
      id: 5,
      titulo: 'Machine Learning para Principiantes',
      ponente: 'Ing. Laura Pérez',
      descripcion: 'Introducción práctica al aprendizaje automático con ejemplos reales y herramientas accesibles.',
      horario: '10:00 - 11:30',
      fecha: '2024-11-16',
      sala: 'Lab de Computación',
      categoria: 'Machine Learning',
      participantes: 15,
      estado: 'programado'
    },
    {
      id: 6,
      titulo: 'Realidad Virtual en Educación',
      ponente: 'Dra. Carmen López',
      descripcion: 'Explorando las aplicaciones de VR en el ámbito educativo y su impacto en el aprendizaje.',
      horario: '13:00 - 14:30',
      fecha: '2024-11-16',
      sala: 'Centro de Realidad Virtual',
      categoria: 'Realidad Virtual',
      participantes: 22,
      estado: 'programado'
    }
  ];

  const categorias = ['todas', ...Array.from(new Set(foros.map(foro => foro.categoria)))];
  const estados = ['todos', 'activo', 'programado', 'finalizado'];

  const forosFiltrados = foros.filter(foro => {
    const cumpleCategoria = filtroCategoria === 'todas' || foro.categoria === filtroCategoria;
    const cumpleEstado = filtroEstado === 'todos' || foro.estado === filtroEstado;
    return cumpleCategoria && cumpleEstado;
  });

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo': return 'success';
      case 'programado': return 'warning';
      case 'finalizado': return 'info';
      default: return 'default';
    }
  };

  const getEstadoText = (estado: string) => {
    switch (estado) {
      case 'activo': return 'En Vivo';
      case 'programado': return 'Programado';
      case 'finalizado': return 'Finalizado';
      default: return estado;
    }
  };

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar />
        <main className="main-content">
          {/* Header */}
          <div className="page-header">
            <div className="header-content">
              <h1>Foros de Conferencias</h1>
              <p>Participa en discusiones sobre las últimas tendencias tecnológicas</p>
            </div>
            <div className="header-stats">
              <div className="stat-item">
                <span className="stat-number">{foros.length}</span>
                <span className="stat-label">Total Foros</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{foros.filter(f => f.estado === 'activo').length}</span>
                <span className="stat-label">En Vivo</span>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="filters-section">
            <div className="filter-group">
              <label htmlFor="categoria">Categoría:</label>
              <select 
                id="categoria"
                value={filtroCategoria} 
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="filter-select"
              >
                {categorias.map(categoria => (
                  <option key={categoria} value={categoria}>
                    {categoria === 'todas' ? 'Todas las categorías' : categoria}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="estado">Estado:</label>
              <select 
                id="estado"
                value={filtroEstado} 
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="filter-select"
              >
                {estados.map(estado => (
                  <option key={estado} value={estado}>
                    {estado === 'todos' ? 'Todos los estados' : getEstadoText(estado)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Lista de Foros */}
          <div className="foros-grid">
            {forosFiltrados.map(foro => (
              <div key={foro.id} className="foro-card">
                <div className="foro-header">
                  <div className="foro-categoria">{foro.categoria}</div>
                  <div className={`foro-estado ${getEstadoColor(foro.estado)}`}>
                    {getEstadoText(foro.estado)}
                  </div>
                </div>
                
                <div className="foro-content">
                  <h3 className="foro-titulo">{foro.titulo}</h3>
                  <p className="foro-ponente">👤 {foro.ponente}</p>
                  <p className="foro-descripcion">{foro.descripcion}</p>
                </div>

                <div className="foro-details">
                  <div className="detail-item">
                    <span className="detail-icon">📅</span>
                    <span>{foro.fecha}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">🕒</span>
                    <span>{foro.horario}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">📍</span>
                    <span>{foro.sala}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">👥</span>
                    <span>{foro.participantes} participantes</span>
                  </div>
                </div>

                <div className="foro-actions">
                  {foro.estado === 'activo' && (
                    <button className="action-button primary">
                      🔴 Unirse Ahora
                    </button>
                  )}
                  {foro.estado === 'programado' && (
                    <button className="action-button secondary">
                      📝 Registrarse
                    </button>
                  )}
                  {foro.estado === 'finalizado' && (
                    <button className="action-button info">
                      📹 Ver Grabación
                    </button>
                  )}
                  <button className="action-button outline">
                    ℹ️ Más Info
                  </button>
                </div>
              </div>
            ))}
          </div>

          {forosFiltrados.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No se encontraron foros</h3>
              <p>Intenta ajustar los filtros para ver más resultados</p>
            </div>
          )}

          {/* Información adicional */}
          <div className="info-section">
            <div className="info-card">
              <h3>💡 ¿Cómo participar?</h3>
              <ul>
                <li>Regístrate en los foros de tu interés</li>
                <li>Únete a las sesiones en vivo</li>
                <li>Participa en las discusiones</li>
                <li>Haz preguntas a los ponentes</li>
              </ul>
            </div>
            <div className="info-card">
              <h3>🎯 Beneficios</h3>
              <ul>
                <li>Acceso a contenido exclusivo</li>
                <li>Networking con expertos</li>
                <li>Certificados de participación</li>
                <li>Grabaciones disponibles</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ForoConferencias;