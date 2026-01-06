import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StarRating from '../shared/StarRating';
import authService from '../../services/auth.service';

const UserEnfermerasView = () => {
    const [enfermeras, setEnfermeras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedEnfermera, setSelectedEnfermera] = useState(null);
    const [ratingData, setRatingData] = useState({ puntuacion: 0, comentario: '' });
    const [submitting, setSubmitting] = useState(false);

    const navigate = useNavigate();
    const currentUser = authService.getCurrentUser();

    useEffect(() => {
        fetchEnfermeras();
    }, []);

    const fetchEnfermeras = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/public/enfermeras');
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Endpoint no encontrado (404). Por favor reinicia el servidor backend (node server.js).');
                }
                throw new Error(`Error del servidor: ${response.status}`);
            }
            const data = await response.json();
            setEnfermeras(data);
        } catch (err) {
            setError(err.message || 'No se pudieron cargar las enfermeras.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCalificarClick = (enfermera) => {
        if (!currentUser) {
            // Si no hay usuario, redirigir a login
            if (window.confirm('Debes iniciar sesión para calificar. ¿Ir al login?')) {
                navigate('/login');
            }
            return;
        }

        // Solo permitir calificar si es rol usuario/paciente (rol 4) o admin (rol 1)
        // O si queremos que todos califiquen, lo dejamos abierto.
        // Asumiremos que cualquiera logueado puede calificar por ahora.

        setSelectedEnfermera(enfermera);
        setRatingData({ puntuacion: 0, comentario: '' });
    };

    const handleSubmitCalificacion = async (e) => {
        e.preventDefault();
        if (ratingData.puntuacion === 0) {
            alert('Por favor selecciona una puntuación');
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch('http://localhost:3001/api/calificaciones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    enfermera_id: selectedEnfermera.id,
                    usuario_id: currentUser.id,
                    puntuacion: ratingData.puntuacion,
                    comentario: ratingData.comentario
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('¡Gracias por tu calificación!');
                setSelectedEnfermera(null);
                fetchEnfermeras(); // Recargar para actualizar promedio
            } else {
                alert(data.error || 'Error al enviar calificación');
            }
        } catch (err) {
            alert('Error de conexión');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="container py-5 text-center">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
        </div>
    );

    return (
        <div className="container py-5">
            <div className="text-center mb-5">
                <h1 className="display-4 fw-bold text-primary">Nuestras Enfermeras</h1>
                <p className="lead text-muted">Conoce a nuestro equipo de profesionales y su reputación</p>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="row g-4">
                {enfermeras.map(enfermera => (
                    <div className="col-md-6 col-lg-4" key={enfermera.id}>
                        <div className="card h-100 border-0 shadow-sm hover-shadow">
                            <div className="card-body text-center p-4">
                                <div className="mb-3">
                                    {enfermera.foto_perfil ? (
                                        <img src={enfermera.foto_perfil} alt={enfermera.nombre} className="rounded-circle img-thumbnail" style={{ width: '120px', height: '120px', objectFit: 'cover' }} />
                                    ) : (
                                        <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto text-primary" style={{ width: '120px', height: '120px', fontSize: '3rem' }}>
                                            {enfermera.genero === 'M' ? <i className="bi bi-person-standing"></i> : <i className="bi bi-person-standing-dress"></i>}
                                        </div>
                                    )}
                                </div>

                                <h5 className="card-title fw-bold mb-1">{enfermera.nombre} {enfermera.apellido}</h5>
                                <p className="text-muted mb-2">{enfermera.especialidad || 'Enfermería General'}</p>

                                <div className="d-flex justify-content-center mb-3">
                                    <StarRating rating={parseFloat(enfermera.promedio_calificacion)} readOnly={true} />
                                    <span className="text-muted ms-2 small">({enfermera.total_calificaciones} reseñas)</span>
                                </div>

                                <button
                                    className="btn btn-outline-primary rounded-pill px-4"
                                    onClick={() => handleCalificarClick(enfermera)}
                                >
                                    <i className="bi bi-star me-2"></i>
                                    Calificar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {enfermeras.length === 0 && !error && (
                    <div className="col-12 text-center py-5">
                        <p className="text-muted">No hay enfermeras registradas para mostrar.</p>
                    </div>
                )}
            </div>

            {/* Modal de Calificación (Implementación manual simple con CSS o Bootstrap classes) */}
            {selectedEnfermera && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">Calificar a {selectedEnfermera.nombre}</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedEnfermera(null)}></button>
                            </div>
                            <div className="modal-body p-4">
                                <form onSubmit={handleSubmitCalificacion}>
                                    <div className="mb-4 text-center">
                                        <label className="form-label mb-2">Tu Puntuación</label>
                                        <div className="d-flex justify-content-center">
                                            <StarRating
                                                rating={ratingData.puntuacion}
                                                onRatingChange={(val) => setRatingData({ ...ratingData, puntuacion: val })}
                                                size="fs-2"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Comentario (Opcional)</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            placeholder="Cuentanos tu experiencia..."
                                            value={ratingData.comentario}
                                            onChange={(e) => setRatingData({ ...ratingData, comentario: e.target.value })}
                                        ></textarea>
                                    </div>

                                    <div className="d-grid gap-2">
                                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                                            {submitting ? 'Enviando...' : 'Enviar Calificación'}
                                        </button>
                                        <button type="button" className="btn btn-outline-secondary" onClick={() => setSelectedEnfermera(null)}>
                                            Cancelar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserEnfermerasView;
