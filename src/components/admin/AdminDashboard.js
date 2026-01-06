import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/auth.service';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = authService.getCurrentUser();
      console.log('Usuario actual:', currentUser);

      if (!currentUser) {
        setMessage('❌ No hay sesión activa');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      if (currentUser.rol_id !== 1) {
        setMessage('❌ Acceso denegado. Solo administradores');
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      setUser(currentUser);
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleRefresh = async () => {
    setLoading(true);
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
    setMessage('✅ Sesión actualizada');
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body text-center py-5">
                <div className="spinner-border text-primary mb-3"></div>
                <p>Verificando permisos de administrador...</p>
                {message && <div className="alert alert-info mt-3">{message}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="text-primary">
            <i className="bi bi-shield-lock me-2"></i>
            Panel de Administración
          </h1>
          <p className="text-muted">
            Bienvenido, <strong>{user?.nombre}</strong>
            <span className="badge bg-danger ms-2">{user?.rol_nombre}</span>
          </p>
        </div>
        <div>
          <button className="btn btn-outline-info me-2" onClick={handleRefresh}>
            <i className="bi bi-arrow-clockwise me-1"></i>
            Actualizar
          </button>
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-1"></i>
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Mensajes */}
      {message && (
        <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-warning'}`}>
          {message}
        </div>
      )}

      {/* Información del usuario */}
      <div className="card mb-4">
        <div className="card-header bg-light">
          <h5 className="mb-0">
            <i className="bi bi-person-circle me-2"></i>
            Información de la Sesión
          </h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <th><i className="bi bi-person me-2"></i>ID:</th>
                    <td>{user?.id}</td>
                  </tr>
                  <tr>
                    <th><i className="bi bi-person-badge me-2"></i>Usuario:</th>
                    <td>{user?.usuario}</td>
                  </tr>
                  <tr>
                    <th><i className="bi bi-card-text me-2"></i>Nombre:</th>
                    <td>{user?.nombre}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-md-6">
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <th><i className="bi bi-shield me-2"></i>Rol:</th>
                    <td>
                      <span className="badge bg-danger">{user?.rol_nombre}</span>
                    </td>
                  </tr>
                  <tr>
                    <th><i className="bi bi-check-circle me-2"></i>Estado:</th>
                    <td>
                      <span className="badge bg-success">Activo</span>
                    </td>
                  </tr>
                  <tr>
                    <th><i className="bi bi-calendar me-2"></i>Sesión:</th>
                    <td>{new Date().toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Funcionalidades */}
      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card h-100 border-primary">
            <div className="card-body text-center">
              <i className="bi bi-people fs-1 text-primary mb-3"></i>
              <h5 className="card-title">Gestión de Usuarios</h5>
              <p className="card-text">Administra usuarios, roles y permisos del sistema.</p>
              <button className="btn btn-primary">
                <i className="bi bi-arrow-right me-1"></i>
                Ir a Usuarios
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card h-100 border-success">
            <div className="card-body text-center">
              <i className="bi bi-clipboard-data fs-1 text-success mb-3"></i>
              <h5 className="card-title">Solicitudes</h5>
              <p className="card-text">Revisa y gestiona todas las solicitudes de atención.</p>
              <Link to="/admin-solicitudes" className="btn btn-success">
                <i className="bi bi-arrow-right me-1"></i>
                Ver Solicitudes
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card h-100 border-warning">
            <div className="card-body text-center">
              <i className="bi bi-person-plus-fill fs-1 text-warning mb-3"></i>
              <h5 className="card-title">Registrar Enfermera</h5>
              <p className="card-text">Agrega nuevas enfermeras al personal del hospital.</p>
              <Link to="/admin/register-enfermera" className="btn btn-warning text-dark">
                <i className="bi bi-plus-lg me-1"></i>
                Registrar
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card h-100 border-info">
            <div className="card-body text-center">
              <i className="bi bi-bar-chart fs-1 text-info mb-3"></i>
              <h5 className="card-title">Reportes</h5>
              <p className="card-text">Genera reportes y estadísticas del sistema.</p>
              <button className="btn btn-info">
                <i className="bi bi-arrow-right me-1"></i>
                Ver Reportes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Información del sistema */}
      <div className="card mt-4">
        <div className="card-header bg-light">
          <h5 className="mb-0">
            <i className="bi bi-info-circle me-2"></i>
            Información del Sistema
          </h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <ul className="list-unstyled">
                <li><i className="bi bi-check-circle text-success me-2"></i> Backend conectado</li>
                <li><i className="bi bi-check-circle text-success me-2"></i> Base de datos activa</li>
                <li><i className="bi bi-check-circle text-success me-2"></i> Sesión válida</li>
              </ul>
            </div>
            <div className="col-md-6">
              <ul className="list-unstyled">
                <li><i className="bi bi-clock me-2"></i> Hora del servidor: {new Date().toLocaleTimeString()}</li>
                <li><i className="bi bi-calendar me-2"></i> Fecha: {new Date().toLocaleDateString()}</li>
                <li><i className="bi bi-person me-2"></i> Usuario: {user?.usuario}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Debug info (solo en desarrollo) */}
      <div className="mt-4">
        <details>
          <summary className="text-muted">
            <small><i className="bi bi-bug me-1"></i> Información de depuración</small>
          </summary>
          <div className="card bg-light mt-2">
            <div className="card-body">
              <pre className="mb-0" style={{ fontSize: '0.8rem' }}>
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};

export default AdminDashboard;