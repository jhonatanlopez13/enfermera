import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    usuario: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [backendStatus, setBackendStatus] = useState({
    connected: false,
    checking: true
  });
  const navigate = useNavigate();

  useEffect(() => {
    checkBackend();
  }, []);

  const checkBackend = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/health');
      setBackendStatus({
        connected: response.ok,
        checking: false
      });
    } catch (error) {
      setBackendStatus({
        connected: false,
        checking: false
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.usuario || !formData.password) {
      setMessage('Usuario y contraseña son obligatorios');
      return;
    }

    if (!backendStatus.connected) {
      setMessage('El servidor backend no está disponible');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario: formData.usuario,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage('✅ Login exitoso, redirigiendo...');

        if (onLoginSuccess && typeof onLoginSuccess === 'function') {
          onLoginSuccess(data.user);
        } else {
          localStorage.setItem('user', JSON.stringify(data.user));

          setTimeout(() => {
            if (data.user.rol_id === 1) {
              navigate('/admin');
            } else if (data.user.rol_id === 2) {
              navigate('/enfermera');
            } else if (data.user.rol_id === 3) {
              navigate('/recepcionista');
            } else {
              navigate('/');
            }
          }, 1000);
        }
      } else {
        setMessage(`❌ ${data.error || 'Credenciales incorrectas'}`);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error completo:', error);
      setMessage('❌ Error de conexión con el servidor');
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const retryConnection = async () => {
    setBackendStatus({ connected: false, checking: true });
    await checkBackend();
  };

  if (backendStatus.checking) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body text-center py-5">
                <div className="spinner-border text-primary mb-3"></div>
                <p>Verificando conexión con el servidor...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          {/* Estado del backend */}
          <div className={`alert ${backendStatus.connected ? 'alert-success' : 'alert-danger'} mb-3`}>
            <div className="d-flex align-items-center">
              <i className={`bi ${backendStatus.connected ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2`}></i>
              <span>
                {backendStatus.connected
                  ? '✅ Backend conectado'
                  : '❌ Backend no disponible'}
              </span>
              {!backendStatus.connected && (
                <button
                  className="btn btn-sm btn-outline-warning ms-auto"
                  onClick={retryConnection}
                >
                  <i className="bi bi-arrow-clockwise"></i> Reintentar
                </button>
              )}
            </div>
          </div>

          <div className="card shadow">
            <div className="card-header bg-primary text-white text-center py-3">
              <h4 className="mb-0">
                <i className="bi bi-shield-lock me-2"></i>
                Inicio de Sesión
              </h4>
            </div>

            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Usuario</label>
                  <input
                    type="text"
                    className="form-control"
                    name="usuario"
                    value={formData.usuario}
                    onChange={handleChange}
                    placeholder="Ingresa tu usuario"
                    required
                    disabled={loading}
                    autoFocus
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Ingresa tu contraseña"
                    required
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2 mb-3"
                  disabled={loading || !backendStatus.connected}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Iniciar Sesión
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary w-100"
                  onClick={handleRegister}
                  disabled={loading}
                >
                  <i className="bi bi-person-plus me-2"></i>
                  Crear Cuenta
                </button>
              </form>

              {message && (
                <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'} mt-3`}>
                  {message}
                </div>
              )}

              {/* Credenciales de prueba */}
              <div className="mt-4 pt-3 border-top">
                <h6 className="text-muted mb-2">Credenciales de prueba:</h6>
                <div className="row g-2">
                  <div className="col-12">
                    <div className="card bg-light border">
                      <div className="card-body p-2">
                        <small>
                          <strong>Administrador:</strong><br />
                          Usuario: <code>admin</code><br />
                          Contraseña: <code>lopez</code>
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="card bg-light border">
                      <div className="card-body p-2">
                        <small>
                          <strong>Enfermera:</strong><br />
                          Usuario: <code>enfermera1</code><br />
                          Contraseña: <code>enfermera123</code>
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-footer text-center py-3">
              <small className="text-muted">
                Sistema de Gestión Enfermera Corazón
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Valor por defecto para onLoginSuccess
Login.defaultProps = {
  onLoginSuccess: null
};

export default Login;