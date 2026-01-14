import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/auth.service';
import {
  FaBell,
  FaUserNurse,
  FaCalendarDay,
  FaCamera,
  FaSearch,
  FaSync
} from 'react-icons/fa';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [novedadesPacientes, setNovedadesPacientes] = useState([]);
  const [novedadesEnfermeras, setNovedadesEnfermeras] = useState([]);
  const [loadingPacientes, setLoadingPacientes] = useState(false);
  const [loadingEnfermeras, setLoadingEnfermeras] = useState(false);
  const [searchPaciente, setSearchPaciente] = useState('');
  const [searchEnfermera, setSearchEnfermera] = useState('');
  const [filterTipoPaciente, setFilterTipoPaciente] = useState('todas');
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

      // Cargar novedades
      loadNovedadesPacientes();
      loadNovedadesEnfermeras();
    };

    checkAuth();
  }, [navigate]);

  // Cargar novedades de pacientes
  const loadNovedadesPacientes = async () => {
    setLoadingPacientes(true);
    try {
      const response = await fetch('http://localhost:3001/api/novedades-pacientes');
      const data = await response.json();
      setNovedadesPacientes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error cargando novedades de pacientes:', error);
      setNovedadesPacientes([]);
    } finally {
      setLoadingPacientes(false);
    }
  };

  // Cargar novedades de enfermeras (calendario)
  const loadNovedadesEnfermeras = async () => {
    setLoadingEnfermeras(true);
    try {
      const response = await fetch('http://localhost:3001/api/novedades');
      const data = await response.json();
      setNovedadesEnfermeras(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error cargando novedades de enfermeras:', error);
      setNovedadesEnfermeras([]);
    } finally {
      setLoadingEnfermeras(false);
    }
  };

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
    loadNovedadesPacientes();
    loadNovedadesEnfermeras();
  };

  // Filtrar novedades de pacientes
  const filteredNovedadesPacientes = novedadesPacientes.filter(novedad => {
    const matchesSearch = novedad.nombre?.toLowerCase().includes(searchPaciente.toLowerCase()) ||
      novedad.apellido?.toLowerCase().includes(searchPaciente.toLowerCase()) ||
      novedad.descripcion?.toLowerCase().includes(searchPaciente.toLowerCase());
    const matchesTipo = filterTipoPaciente === 'todas' || novedad.tipo_novedad === filterTipoPaciente;
    return matchesSearch && matchesTipo;
  });

  // Filtrar novedades de enfermeras
  const filteredNovedadesEnfermeras = novedadesEnfermeras.filter(novedad => {
    return novedad.nota?.toLowerCase().includes(searchEnfermera.toLowerCase()) ||
      novedad.usuario_nombre?.toLowerCase().includes(searchEnfermera.toLowerCase()) ||
      novedad.usuario_apellido?.toLowerCase().includes(searchEnfermera.toLowerCase());
  });

  const getTipoBadgeClass = (tipo) => {
    switch (tipo) {
      case 'mejoria': return 'bg-success';
      case 'empeoramiento': return 'bg-danger';
      case 'estable': return 'bg-info';
      case 'observacion': return 'bg-warning';
      default: return 'bg-secondary';
    }
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
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card h-100 border-primary">
            <div className="card-body text-center">
              <i className="bi bi-people fs-1 text-primary mb-3"></i>
              <h5 className="card-title">Gestión de Usuarios</h5>
              <p className="card-text">Administra usuarios, roles y permisos del sistema.</p>
              <Link to="/admin/usuarios" className="btn btn-primary">
                <i className="bi bi-arrow-right me-1"></i>
                Ir a Usuarios
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card h-100 border-success">
            <div className="card-body text-center">
              <i className="bi bi-chat-right-text fs-1 text-info mb-3"></i>
              <h5 className="card-title">Ver Solicitudes</h5>
              <p className="card-text">Revisa las solicitudes de atención pendientes.</p>
              <Link to="/admin-solicitudes" className="btn btn-info text-white">
                <i className="bi bi-eye me-1"></i>
                Ver Solicitudes
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card h-100 border-secondary">
            <div className="card-body text-center">
              <i className="bi bi-star-half fs-1 text-secondary mb-3"></i>
              <h5 className="card-title">Moderación de Reseñas</h5>
              <p className="card-text">Gestiona y elimina calificaciones de usuarios.</p>
              <Link to="/admin/calificaciones" className="btn btn-secondary">
                <i className="bi bi-shield-check me-1"></i>
                Moderar
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

      {/* Listado de Novedades de Pacientes */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header bg-white">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">
                  <FaBell className="me-2 text-primary" />
                  Novedades de Pacientes
                </h5>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={loadNovedadesPacientes}
                  disabled={loadingPacientes}
                >
                  <FaSync className={loadingPacientes ? 'fa-spin' : ''} />
                </button>
              </div>
              <div className="row g-2">
                <div className="col-md-6">
                  <div className="input-group input-group-sm">
                    <span className="input-group-text">
                      <FaSearch />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar por paciente o descripción..."
                      value={searchPaciente}
                      onChange={(e) => setSearchPaciente(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <select
                    className="form-select form-select-sm"
                    value={filterTipoPaciente}
                    onChange={(e) => setFilterTipoPaciente(e.target.value)}
                  >
                    <option value="todas">Todos los tipos</option>
                    <option value="mejoria">Mejoría</option>
                    <option value="empeoramiento">Empeoramiento</option>
                    <option value="estable">Estable</option>
                    <option value="observacion">Observación</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              {loadingPacientes ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              ) : filteredNovedadesPacientes.length === 0 ? (
                <div className="text-center py-5">
                  <FaBell size={48} className="text-muted mb-3" />
                  <h5>No hay novedades de pacientes</h5>
                  <p className="text-muted">No se encontraron novedades registradas</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Fecha</th>
                        <th>Paciente</th>
                        <th>Tipo</th>
                        <th>Descripción</th>
                        <th className="text-center">Evidencia</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredNovedadesPacientes.map(novedad => (
                        <tr key={novedad.id}>
                          <td>
                            <small className="text-muted">
                              <FaCalendarDay className="me-1" />
                              {new Date(novedad.fecha).toLocaleDateString('es-ES')}
                            </small>
                          </td>
                          <td>
                            <div className="fw-bold">
                              {novedad.nombre} {novedad.apellido}
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${getTipoBadgeClass(novedad.tipo_novedad)}`}>
                              {novedad.tipo_novedad}
                            </span>
                          </td>
                          <td>
                            <small>{novedad.descripcion}</small>
                          </td>
                          <td className="text-center">
                            {novedad.evidencia_foto && (
                              <span className="badge bg-success">
                                <FaCamera className="me-1" />
                                Foto
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Listado de Novedades de Enfermeras */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header bg-white">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">
                  <FaUserNurse className="me-2 text-success" />
                  Novedades de Enfermeras (Calendario)
                </h5>
                <button
                  className="btn btn-sm btn-outline-success"
                  onClick={loadNovedadesEnfermeras}
                  disabled={loadingEnfermeras}
                >
                  <FaSync className={loadingEnfermeras ? 'fa-spin' : ''} />
                </button>
              </div>
              <div className="input-group input-group-sm">
                <span className="input-group-text">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por enfermera o nota..."
                  value={searchEnfermera}
                  onChange={(e) => setSearchEnfermera(e.target.value)}
                />
              </div>
            </div>
            <div className="card-body p-0">
              {loadingEnfermeras ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              ) : filteredNovedadesEnfermeras.length === 0 ? (
                <div className="text-center py-5">
                  <FaUserNurse size={48} className="text-muted mb-3" />
                  <h5>No hay novedades de enfermeras</h5>
                  <p className="text-muted">No se encontraron novedades del calendario</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Fecha</th>
                        <th>Enfermera</th>
                        <th>Nota</th>
                        <th className="text-center">Evidencia</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredNovedadesEnfermeras.map(novedad => (
                        <tr key={novedad.id}>
                          <td>
                            <small className="text-muted">
                              <FaCalendarDay className="me-1" />
                              {new Date(novedad.fecha).toLocaleDateString('es-ES')}
                            </small>
                          </td>
                          <td>
                            <div className="fw-bold">
                              {novedad.usuario_nombre} {novedad.usuario_apellido}
                            </div>
                          </td>
                          <td>
                            <small>{novedad.nota}</small>
                          </td>
                          <td className="text-center">
                            {novedad.evidencia_foto && (
                              <span className="badge bg-success">
                                <FaCamera className="me-1" />
                                Foto
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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