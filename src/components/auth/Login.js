// src/components/auth/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth.service';

const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    authService.login(usuario, password)
      .then(response => {
        if (response.success) {
          // Redirigir según el rol
          switch (response.data.rol_nombre) {
            case 'ADMIN':
              navigate('/admin/dashboard');
              break;
            case 'ENFERMERA':
              navigate('/enfermera/dashboard');
              break;
            case 'RECEPCIONISTA':
              navigate('/recepcionista/dashboard');
              break;
            default:
              navigate('/dashboard');
          }
          window.location.reload();
        } else {
          setMessage(response.message || 'Error en el inicio de sesión');
          setLoading(false);
        }
      })
      .catch(error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          'Error de conexión';

        setLoading(false);
        setMessage(resMessage);
      });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Inicio de Sesión</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="usuario" className="form-label">Usuario</label>
                  <input
                    type="text"
                    className="form-control"
                    id="usuario"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Iniciando sesión...
                    </>
                  ) : (
                    'Iniciar Sesión'
                  )}
                </button>

                {message && (
                  <div className="alert alert-danger mt-3" role="alert">
                    {message}
                  </div>
                )}
              </form>
            </div>
            <div className="card-footer text-center">
              <small className="text-muted">
                Sistema de Gestión Hospitalaria
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;