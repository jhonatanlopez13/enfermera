// src/components/auth/Register.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/auth.service';

const Register = () => {
  const [formData, setFormData] = useState({
    usuario: '',
    nombre: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [successful, setSuccessful] = useState(false);
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar roles disponibles
    authService.getRoles()
      .then(response => {
        if (response.data.success) {
          setRoles(response.data.data);
        }
      })
      .catch(error => {
        console.error('Error cargando roles:', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setMessage('');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setMessage('');
    setSuccessful(false);

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setMessage('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    authService.register(formData.usuario, formData.nombre, formData.password)
      .then(response => {
        setSuccessful(true);
        setLoading(false);

        setTimeout(() => {
          navigate('/login');
        }, 3000);
      })
      .catch(error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          'Error en el registro';

        setLoading(false);
        setMessage(resMessage);
        setSuccessful(false);
      });
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white text-center py-4">
              <h3 className="mb-0">
                <i className="bi bi-person-plus me-2"></i>
                Crear Cuenta
              </h3>
            </div>
            <div className="card-body p-4">
              {successful ? (
                <div className="text-center py-4">
                  <div className="alert alert-success">
                    <i className="bi bi-check-circle-fill fs-1 text-success mb-3"></i>
                    <h4>¡Registro Exitoso!</h4>
                    <p>Tu cuenta ha sido creada correctamente. Serás redirigido al login...</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRegister}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Usuario *</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-person"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          name="usuario"
                          value={formData.usuario}
                          onChange={handleChange}
                          required
                          disabled={loading}
                          placeholder="Ej: jperez"
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Nombre Completo *</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-card-text"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleChange}
                          required
                          disabled={loading}
                          placeholder="Ej: Juan Pérez"
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Contraseña *</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-lock"></i>
                        </span>
                        <input
                          type="password"
                          className="form-control"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          disabled={loading}
                          placeholder="Mínimo 6 caracteres"
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Confirmar Contraseña *</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-lock-fill"></i>
                        </span>
                        <input
                          type="password"
                          className="form-control"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          disabled={loading}
                          placeholder="Repite tu contraseña"
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="alert alert-info">
                        <i className="bi bi-info-circle me-2"></i>
                        Por defecto se asignará el rol de RECEPCIONISTA. Los roles de ADMIN y ENFERMERA deben ser asignados por un administrador.
                      </div>
                    </div>

                    {message && (
                      <div className="col-12">
                        <div className="alert alert-danger" role="alert">
                          <i className="bi bi-exclamation-triangle me-2"></i>
                          {message}
                        </div>
                      </div>
                    )}

                    <div className="col-12">
                      <button
                        type="submit"
                        className="btn btn-primary w-100 py-2"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Registrando...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-person-plus me-2"></i>
                            Registrarse
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}

              <div className="text-center mt-4">
                <p className="mb-2">
                  ¿Ya tienes cuenta?
                  <Link to="/login" className="ms-2 text-primary">
                    Inicia sesión aquí
                  </Link>
                </p>
                <Link to="/" className="btn btn-outline-secondary btn-sm">
                  <i className="bi bi-arrow-left me-1"></i>
                  Volver al inicio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;