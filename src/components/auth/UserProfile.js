// src/components/auth/UserProfile.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/auth.service';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    setUser(currentUser);
    setLoading(false);
  }, [navigate]);

  const getRoleBadge = (role) => {
    const roleConfig = {
      'ADMIN': { color: 'danger', icon: 'bi-shield-fill', title: 'Administrador' },
      'ENFERMERA': { color: 'info', icon: 'bi-heart-pulse-fill', title: 'Enfermera' },
      'RECEPCIONISTA': { color: 'success', icon: 'bi-reception-4', title: 'Recepcionista' }
    };
    
    const config = roleConfig[role] || { color: 'secondary', icon: 'bi-person-fill', title: 'Usuario' };
    
    return (
      <span className={`badge bg-${config.color} d-inline-flex align-items-center px-3 py-2`}>
        <i className={`bi ${config.icon} me-2`}></i>
        {config.title}
      </span>
    );
  };

  const getDashboardLink = () => {
    if (!user) return '#';
    
    switch(user.rol_nombre) {
      case 'ADMIN': return '/admin/dashboard';
      case 'ENFERMERA': return '/enfermera/dashboard';
      case 'RECEPCIONISTA': return '/recepcionista/dashboard';
      default: return '#';
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-4">
              <h2 className="mb-0">
                <i className="bi bi-person-circle text-primary me-2"></i>
                Mi Perfil
              </h2>
            </div>
            <div className="card-body p-4">
              <div className="row align-items-center mb-4">
                <div className="col-auto">
                  <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white" 
                       style={{ width: '80px', height: '80px' }}>
                    <i className="bi bi-person-fill fs-2"></i>
                  </div>
                </div>
                <div className="col">
                  <h3 className="mb-1">{user.nombre}</h3>
                  <p className="text-muted mb-0">
                    <i className="bi bi-person-badge me-1"></i>
                    {user.usuario}
                  </p>
                  <div className="mt-2">
                    {getRoleBadge(user.rol_nombre)}
                  </div>
                </div>
              </div>
              
              <hr />
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <h5 className="text-muted">
                    <i className="bi bi-shield-check me-2"></i>
                    Rol de Usuario
                  </h5>
                  <div className="mt-2">
                    {getRoleBadge(user.rol_nombre)}
                  </div>
                  <small className="text-muted d-block mt-1">
                    {user.rol_descripcion || 'Sin descripción del rol'}
                  </small>
                </div>
                
                <div className="col-md-6 mb-3">
                  <h5 className="text-muted">
                    <i className="bi bi-calendar me-2"></i>
                    Estado de Cuenta
                  </h5>
                  <p className="fs-5">
                    <span className="badge bg-success">
                      Activa
                    </span>
                  </p>
                </div>
              </div>
              
              <hr />
              
              <div className="d-flex justify-content-between">
                <Link to="/" className="btn btn-outline-primary">
                  <i className="bi bi-house me-2"></i>
                  Ir al Inicio
                </Link>
                
                <div>
                  <Link 
                    to={getDashboardLink()}
                    className="btn btn-outline-secondary me-2"
                  >
                    <i className="bi bi-speedometer2 me-2"></i>
                    Ir al Panel
                  </Link>
                  
                  <button 
                    className="btn btn-danger"
                    onClick={() => {
                      authService.logout();
                      navigate('/login');
                    }}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;