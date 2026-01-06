import React, { useState } from 'react';
import authService from '../../services/auth.service';

const RegisterEnfermeraForm = ({ onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        usuario: '',
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        direccion: '',
        especialidad: '',
        numero_licencia: '',
        fecha_nacimiento: '',
        genero: '',
        password: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (message.text) setMessage({ type: '', text: '' });
    };

    const validateForm = () => {
        if (!formData.usuario.trim()) {
            setMessage({ type: 'error', text: 'El nombre de usuario es requerido' });
            return false;
        }

        if (formData.usuario.length < 3) {
            setMessage({ type: 'error', text: 'El usuario debe tener al menos 3 caracteres' });
            return false;
        }

        if (!formData.nombre.trim()) {
            setMessage({ type: 'error', text: 'El nombre es requerido' });
            return false;
        }

        if (!formData.apellido.trim()) {
            setMessage({ type: 'error', text: 'El apellido es requerido' });
            return false;
        }

        if (!formData.email.trim()) {
            setMessage({ type: 'error', text: 'El email es requerido' });
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setMessage({ type: 'error', text: 'Por favor ingresa un email válido' });
            return false;
        }

        if (formData.password.length < 6) {
            setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres' });
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
            return false;
        }

        if (!formData.especialidad.trim()) {
            setMessage({ type: 'error', text: 'La especialidad es requerida' });
            return false;
        }

        if (!formData.numero_licencia.trim()) {
            setMessage({ type: 'error', text: 'El número de licencia es requerido' });
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setMessage({ type: '', text: '' });
        setLoading(true);

        try {
            console.log('🔄 Registrando enfermera desde panel...');

            const response = await authService.registerEnfermera({
                usuario: formData.usuario.trim(),
                nombre: formData.nombre.trim(),
                apellido: formData.apellido.trim(),
                email: formData.email.trim(),
                telefono: formData.telefono.trim() || null,
                direccion: formData.direccion.trim() || null,
                especialidad: formData.especialidad.trim(),
                numero_licencia: formData.numero_licencia.trim(),
                fecha_nacimiento: formData.fecha_nacimiento || null,
                genero: formData.genero || null,
                password: formData.password
            });

            if (response.success) {
                setMessage({
                    type: 'success',
                    text: '✅ Enfermera registrada exitosamente'
                });

                // Limpiar formulario
                setFormData({
                    usuario: '',
                    nombre: '',
                    apellido: '',
                    email: '',
                    telefono: '',
                    direccion: '',
                    especialidad: '',
                    numero_licencia: '',
                    fecha_nacimiento: '',
                    genero: '',
                    password: '',
                    confirmPassword: ''
                });

                // Llamar callback de éxito si existe
                if (onSuccess) {
                    setTimeout(() => {
                        onSuccess(response.user);
                    }, 1500);
                }

            } else {
                setMessage({
                    type: 'error',
                    text: `❌ ${response.message || 'Error en el registro'}`
                });
            }

        } catch (error) {
            console.error('Error en registro:', error);
            setMessage({
                type: 'error',
                text: '❌ Error al conectar con el servidor'
            });

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card border-0 shadow-sm">
            <div className="card-header bg-success text-white">
                <h5 className="mb-0">
                    <i className="bi bi-person-plus-fill me-2"></i>
                    Registrar Nueva Enfermera
                </h5>
            </div>

            <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
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

                        {/* Especialidad */}
                        <div className="col-md-6">
                            <label className="form-label">
                                <i className="bi bi-award me-1"></i>
                                Especialidad *
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="especialidad"
                                value={formData.especialidad}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                placeholder="Ej: Pediatría, general, etc."
                            />
                        </div>

                        {/* Número de Licencia */}
                        <div className="col-md-6">
                            <label className="form-label">
                                <i className="bi bi-card-checklist me-1"></i>
                                Número de Licencia *
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="numero_licencia"
                                value={formData.numero_licencia}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                placeholder="Ej: LIC-12345678"
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

                        {/* Mensaje de información */}
                        <div className="col-12">
                            <div className="alert alert-info mb-0">
                                <i className="bi bi-info-circle me-2"></i>
                                <strong>Información:</strong> Se asignará automáticamente el rol de <strong>ENFERMERA</strong>
                            </div>
                        </div>

                        {/* Mensajes de error/éxito */}
                        {message.text && (
                            <div className="col-12">
                                <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'} mb-0`}>
                                    <i className={`bi ${message.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2`}></i>
                                    {message.text}
                                </div>
                            </div>
                        )}

                        {/* Botones */}
                        <div className="col-12 mt-4">
                            <div className="d-flex gap-2">
                                <button
                                    type="submit"
                                    className="btn btn-success flex-grow-1"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Registrando...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-person-plus-fill me-2"></i>
                                            Registrar Enfermera
                                        </>
                                    )}
                                </button>

                                {onCancel && (
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={onCancel}
                                        disabled={loading}
                                    >
                                        <i className="bi bi-x-circle me-1"></i>
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterEnfermeraForm;
