import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth.service';

const Login = () => {
  const [formData, setFormData] = useState({
    usuario: 'admin',
    password: 'lopez'
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
    const status = await authService.checkBackendHealth();
    setBackendStatus({
      connected: status.success,
      checking: false
    });
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
      console.log('Enviando login...');
      const response = await authService.login(formData.usuario, formData.password);
      console.log('Respuesta login:', response);

      if (response.success) {
        setMessage('✅ Login exitoso, redirigiendo...');

        // Pequeña pausa para mostrar mensaje
        setTimeout(() => {
          // Redirigir según el rol
          if (response.user.rol_id === 1) {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }, 1000);
      } else {
        setMessage(`❌ ${response.message}`);
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

  const handleTestLogin = async () => {
    setLoading(true);
    setMessage('Probando login con admin...');

    const result = await authService.testLogin();

    if (result.success) {
      setMessage('✅ Prueba exitosa! Redirigiendo...');
      setTimeout(() => {
        if (result.user.rol_id === 1) {
          navigate('/admin');
        }
      }, 1000);
    } else {
      setMessage(`❌ Prueba fallida: ${result.message}`);
      setLoading(false);
    }
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
                Inicio de Sesión - Sistema Enfermera Corazón
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
                    placeholder="admin"
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
                    placeholder="lopez"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary py-2"
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
                    className="btn btn-outline-info py-2"
                    onClick={handleTestLogin}
                    disabled={loading || !backendStatus.connected}
                  >
                    <i className="bi bi-bug me-2"></i>
                    Probar Login Automático
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary py-2"
                    onClick={handleRegister}
                    disabled={loading}
                  >
                    <i className="bi bi-person-plus me-2"></i>
                    Crear Cuenta
                  </button>
                </div>
              </form>

              {message && (
                <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'} mt-3`}>
                  <i className={`bi ${message.includes('✅') ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2`}></i>
                  {message}
                </div>
              )}

              {/* Credenciales de prueba */}
              <div className="mt-4 pt-3 border-top">
                <h6 className="text-muted mb-2">
                  <i className="bi bi-info-circle me-2"></i>
                  Credenciales de prueba:
                </h6>
                <div className="row g-2">
                  <div className="col-12">
                    <div className="card bg-light border">
                      <div className="card-body p-2">
                        <small>
                          <strong><i className="bi bi-person-fill-gear me-1"></i> Administrador:</strong><br />
                          Usuario: <code>admin</code><br />
                          Contraseña: <code>lopez</code><br />
                          <span className="text-muted">(Rol: ADMIN)</span>
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-footer text-center py-3">
              <small className="text-muted">
                <i className="bi bi-shield-check me-1"></i>
                Sistema seguro |
                <i className="bi bi-server ms-2 me-1"></i>
                Backend: {backendStatus.connected ? 'Conectado ✓' : 'Desconectado ✗'}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;