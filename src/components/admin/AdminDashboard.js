// src/components/admin/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth.service';
import axios from 'axios';

const AdminDashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.rol_nombre !== 'ADMIN') {
      navigate('/unauthorized');
      return;
    }
    
    setCurrentUser(user);
    loadUsers();
  }, [navigate]);

  const loadUsers = () => {
    axios.get('http://localhost:5000/api/users/all', {
      headers: authService.authHeader()
    })
    .then(response => {
      if (response.data.success) {
        setUsers(response.data.data);
      }
      setLoading(false);
    })
    .catch(error => {
      console.error('Error al cargar usuarios:', error);
      setLoading(false);
    });
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (!currentUser) {
    return <div className="text-center mt-5">Cargando...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Panel de Administración</h1>
          <p className="text-muted">Bienvenido, {currentUser.nombre}</p>
        </div>
        <button className="btn btn-danger" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>

      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">Total Usuarios</h5>
              <h2>{users.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">Activos</h5>
              <h2>{users.filter(u => u.activo).length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h5 className="card-title">Enfermeras</h5>
              <h2>{users.filter(u => u.rol_nombre === 'ENFERMERA').length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <h5 className="card-title">Recepcionistas</h5>
              <h2>{users.filter(u => u.rol_nombre === 'RECEPCIONISTA').length}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Gestión de Usuarios</h5>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Usuario</th>
                    <th>Nombre</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Fecha Registro</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.usuario}</td>
                      <td>{user.nombre}</td>
                      <td>
                        <span className={`badge ${
                          user.rol_nombre === 'ADMIN' ? 'bg-danger' :
                          user.rol_nombre === 'ENFERMERA' ? 'bg-info' :
                          'bg-secondary'
                        }`}>
                          {user.rol_nombre}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${
                          user.activo ? 'bg-success' : 'bg-danger'
                        }`}>
                          {user.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td>{new Date(user.creado_en).toLocaleDateString()}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-1">
                          Editar
                        </button>
                        <button className="btn btn-sm btn-outline-danger">
                          Desactivar
                        </button>
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
  );
};

export default AdminDashboard;