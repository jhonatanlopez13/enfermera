import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/auth.service';

const RegisterEnfermera = () => {
    const [formData, setFormData] = useState({
        usuario: '',
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        direccion: '',
        fecha_nacimiento: '',
        genero: '',
        password: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [successful, setSuccessful] = useState(false);
    const [backendStatus, setBackendStatus] = useState({
        connected: false,
        checking: true,
        url: 'http://localhost:3001/api/enfermeras'
    });

    const navigate = useNavigate();

    // Verificar conexión con el backend al cargar
    useEffect(() => {
        checkBackendConnection();
    }, []);

    const checkBackendConnection = async () => {
        try {
            console.log('🔍 Verificando conexión con backend...');
            const status = await authService.checkBackendHealth();

            setBackendStatus({
                connected: status.success,
                checking: false,
                url: 'http://localhost:3001/api/enfermeras',
                message: status.message
            });

            if (!status.success) {
                setMessage('⚠️ El servidor backend no está disponible. Verifica que esté corriendo en puerto 3001');
            }

        } catch (error) {
            console.error('Error verificando backend:', error);
            setBackendStatus({
                connected: false,
                checking: false,
                url: 'http://localhost:3001/api/enfermeras',
                message: 'No se pudo conectar con el backend'
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (message) setMessage('');
    };

    const validateForm = () => {
        if (!formData.usuario.trim()) {
            setMessage('El nombre de usuario es requerido');
            return false;
        }

        if (formData.usuario.length < 3) {
            setMessage('El usuario debe tener al menos 3 caracteres');
            return false;
        }

        if (!formData.nombre.trim()) {
            setMessage('El nombre es requerido');
            return false;
        }

        if (!formData.apellido.trim()) {
            setMessage('El apellido es requerido');
            return false;
        }

        if (!formData.email.trim()) {
            setMessage('El email es requerido');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setMessage('Por favor ingresa un email válido');
            return false;
        }

        if (formData.password.length < 6) {
            setMessage('La contraseña debe tener al menos 6 caracteres');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setMessage('Las contraseñas no coinciden');
            return false;
        }

        return true;
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (!backendStatus.connected) {
            setMessage('❌ No se puede registrar. El servidor backend no está disponible.');
            return;
        }

        setMessage('');
        setSuccessful(false);
        setLoading(true);

        try {
            console.log('🔄 Enviando datos de registro de ENFERMERA...');

            // Usar el método específico para enfermeras
            const response = await authService.registerEnfermera({
                usuario: formData.usuario.trim(),
                nombre: formData.nombre.trim(),
                apellido: formData.apellido.trim(),
                email: formData.email.trim(),
                telefono: formData.telefono.trim() || null,
                direccion: formData.direccion.trim() || null,
                fecha_nacimiento: formData.fecha_nacimiento || null,
                genero: formData.genero || null,
                password: formData.password
            });

            console.log('📨 Respuesta del backend:', response);

            if (response.success) {
                setSuccessful(true);
                setMessage('✅ ¡Registro exitoso! Enfermera creada con rol de ENFERMERA.');

                // Limpiar formulario
                setFormData({
                    usuario: '',
                    nombre: '',
                    apellido: '',
                    email: '',
                    telefono: '',
                    direccion: '',
                    fecha_nacimiento: '',
                    genero: '',
                    password: '',
                    confirmPassword: ''
                });

                // Redirigir después de 3 segundos
                setTimeout(() => {
                    navigate('/login');
                }, 3000);

            } else {
                setMessage(`❌ ${response.message || 'Error en el registro'}`);
            }

        } catch (error) {
            console.error('Error completo en registro:', error);
            setMessage('❌ Error al conectar con el servidor. Verifica la consola para más detalles.');

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-10 col-lg-8">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-success text-white text-center py-4">
                            <h3 className="mb-0">
                                <i className="bi bi-person-plus-fill me-2"></i>
                                Registro de Enfermera - Sistema Enfermera Corazón
                            </h3>
                            <p className="mb-0 mt-2 small">
                                <i className="bi bi-shield-check me-1"></i>
                                Se asignará automáticamente el rol de ENFERMERA
                            </p>
                        </div>

                        <div className="card-body p-4">
                            {/* Estado del backend */}
                            <div className={`alert ${backendStatus.connected ? 'alert-success' : 'alert-danger'} mb-4`}>
                                <div className="d-flex align-items-center">
                                    <div className="me-3">
                                        <i className={`bi ${backendStatus.connected ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} fs-4`}></i>
                                    </div>
                                    <div>
                                        <h6 className="mb-1">
                                            {backendStatus.connected ? '✅ Backend Conectado' : '❌ Backend Desconectado'}
                                        </h6>
                                        <p className="mb-0 small">
                                            {backendStatus.connected
                                                ? `Servidor funcionando en ${backendStatus.url}`
                                                : `No se puede conectar al servidor en ${backendStatus.url}`}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {successful ? (
                                <div className="text-center py-4">
                                    <div className="alert alert-success">
                                        <i className="bi bi-check-circle-fill fs-1 text-success mb-3"></i>
                                        <h4>¡Registro Exitoso!</h4>
                                        <p className="mb-0">{message}</p>
                                        <p className="mt-2">Redirigiendo al login en 3 segundos...</p>
                                        <div className="spinner-border text-success mt-3" role="status">
                                            <span className="visually-hidden">Redirigiendo...</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleRegister}>
                                    <div className="row g-3">
                                        {/* Usuario */}
                                        <div className="col-md-6">
                                            <label className="form-label">
                                                <i className="bi bi-person me-1"></i>
                                                Usuario *
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="usuario"
                                                value={formData.usuario}
                                                onChange={handleChange}
                                                required
                                                disabled={loading}
                                                placeholder="Ej: mperez"
                                                minLength="3"
                                            />
                                            <small className="text-muted">Mínimo 3 caracteres</small>
                                        </div>

                                        {/* Email */}
                                        <div className="col-md-6">
                                            <label className="form-label">
                                                <i className="bi bi-envelope me-1"></i>
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                disabled={loading}
                                                placeholder="Ej: maria@ejemplo.com"
                                            />
                                        </div>

                                        {/* Nombre */}
                                        <div className="col-md-6">
                                            <label className="form-label">
                                                <i className="bi bi-person-badge me-1"></i>
                                                Nombre *
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="nombre"
                                                value={formData.nombre}
                                                onChange={handleChange}
                                                required
                                                disabled={loading}
                                                placeholder="Ej: María"
                                            />
                                        </div>

                                        {/* Apellido */}
                                        <div className="col-md-6">
                                            <label className="form-label">
                                                <i className="bi bi-person-badge me-1"></i>
                                                Apellido *
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="apellido"
                                                value={formData.apellido}
                                                onChange={handleChange}
                                                required
                                                disabled={loading}
                                                placeholder="Ej: Pérez"
                                            />
                                        </div>

                                        {/* Teléfono */}
                                        <div className="col-md-6">
                                            <label className="form-label">
                                                <i className="bi bi-telephone me-1"></i>
                                                Teléfono
                                            </label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                name="telefono"
                                                value={formData.telefono}
                                                onChange={handleChange}
                                                disabled={loading}
                                                placeholder="Ej: 555-1234"
                                            />
                                        </div>

                                        {/* Fecha de Nacimiento */}
                                        <div className="col-md-6">
                                            <label className="form-label">
                                                <i className="bi bi-calendar me-1"></i>
                                                Fecha de Nacimiento
                                            </label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name="fecha_nacimiento"
                                                value={formData.fecha_nacimiento}
                                                onChange={handleChange}
                                                disabled={loading}
                                            />
                                        </div>

                                        {/* Género */}
                                        <div className="col-md-6">
                                            <label className="form-label">
                                                <i className="bi bi-gender-ambiguous me-1"></i>
                                                Género
                                            </label>
                                            <select
                                                className="form-select"
                                                name="genero"
                                                value={formData.genero}
                                                onChange={handleChange}
                                                disabled={loading}
                                            >
                                                <option value="">Seleccionar...</option>
                                                <option value="M">Masculino</option>
                                                <option value="F">Femenino</option>
                                                <option value="O">Otro</option>
                                            </select>
                                        </div>

                                        {/* Dirección */}
                                        <div className="col-md-6">
                                            <label className="form-label">
                                                <i className="bi bi-geo-alt me-1"></i>
                                                Dirección
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="direccion"
                                                value={formData.direccion}
                                                onChange={handleChange}
                                                disabled={loading}
                                                placeholder="Ej: Calle Principal #123"
                                            />
                                        </div>

                                        {/* Contraseña */}
                                        <div className="col-md-6">
                                            <label className="form-label">
                                                <i className="bi bi-lock me-1"></i>
                                                Contraseña *
                                            </label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                                disabled={loading}
                                                placeholder="Mínimo 6 caracteres"
                                                minLength="6"
                                            />
                                        </div>

                                        {/* Confirmar Contraseña */}
                                        <div className="col-md-6">
                                            <label className="form-label">
                                                <i className="bi bi-lock-fill me-1"></i>
                                                Confirmar Contraseña *
                                            </label>
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

                                        <div className="col-12 mt-3">
                                            <div className="alert alert-success">
                                                <i className="bi bi-info-circle me-2"></i>
                                                <strong>Información:</strong>
                                                <ul className="mb-0 mt-2">
                                                    <li>Los campos marcados con * son obligatorios</li>
                                                    <li>Se asignará automáticamente el rol de <strong>ENFERMERA</strong></li>
                                                    <li>Tendrás acceso completo al sistema de gestión de enfermeras</li>
                                                    <li>Podrás gestionar pruebas médicas, turnos y pacientes</li>
                                                </ul>
                                            </div>
                                        </div>

                                        {message && (
                                            <div className="col-12">
                                                <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'}`}>
                                                    <i className={`bi ${message.includes('✅') ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2`}></i>
                                                    {message}
                                                </div>
                                            </div>
                                        )}

                                        <div className="col-12 mt-4">
                                            <button
                                                type="submit"
                                                className="btn btn-success w-100 py-3"
                                                disabled={loading || !backendStatus.connected}
                                            >
                                                {loading ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                                        Registrando Enfermera...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="bi bi-person-plus-fill me-2"></i>
                                                        Registrar Enfermera
                                                    </>
                                                )}
                                            </button>

                                            {!backendStatus.connected && (
                                                <div className="alert alert-warning mt-2 mb-0">
                                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                                    No se puede registrar mientras el backend esté desconectado.
                                                    <button
                                                        className="btn btn-sm btn-outline-warning ms-2"
                                                        onClick={checkBackendConnection}
                                                    >
                                                        <i className="bi bi-arrow-clockwise me-1"></i>
                                                        Reintentar
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </form>
                            )}

                            <div className="text-center mt-4 pt-3 border-top">
                                <p className="mb-2">
                                    ¿Ya tienes cuenta?
                                    <Link to="/login" className="ms-2 text-success fw-bold">
                                        <i className="bi bi-box-arrow-in-right me-1"></i>
                                        Iniciar Sesión
                                    </Link>
                                </p>
                                <p className="text-muted small mb-0">
                                    <i className="bi bi-shield-check me-1"></i>
                                    Los datos se envían de forma segura al servidor
                                </p>
                            </div>
                        </div>

                        <div className="card-footer bg-light text-center py-3">
                            <small className="text-muted">
                                <i className="bi bi-server me-1"></i>
                                Backend: {backendStatus.url}
                                <span className="mx-2">•</span>
                                <i className="bi bi-database me-1"></i>
                                MySQL: enfermeras
                                <span className="mx-2">•</span>
                                <i className="bi bi-shield-fill-check me-1 text-success"></i>
                                Rol: ENFERMERA
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterEnfermera;
