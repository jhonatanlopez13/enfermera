import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StarRating from '../shared/StarRating';
import authService from '../../services/auth.service';

const AdminCalificaciones = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/calificaciones');
            const data = await response.json();

            if (data.success) {
                setReviews(data.reviews);
            } else {
                setError(data.error || 'Error al cargar calificaciones');
            }
        } catch (err) {
            setError('Error de conexión con el servidor');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta calificación?')) return;

        try {
            const response = await fetch(`http://localhost:3001/api/calificaciones/${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();

            if (data.success) {
                setReviews(reviews.filter(review => review.id !== id));
            } else {
                alert(data.error || 'Error al eliminar');
            }
        } catch (err) {
            alert('Error de conexión');
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
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>
                    <i className="bi bi-star-half me-2 text-warning"></i>
                    Gestión de Calificaciones
                </h2>
                <Link to="/admin" className="btn btn-outline-secondary">
                    <i className="bi bi-arrow-left me-1"></i>
                    Volver al Panel
                </Link>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="row g-4">
                {reviews.map(review => (
                    <div className="col-md-6" key={review.id}>
                        <div className="card shadow-sm h-100">
                            <div className="card-header bg-light d-flex justify-content-between align-items-center">
                                <div>
                                    <small className="text-muted">Para:</small>
                                    <strong className="ms-1">{review.enfermera_nombre} {review.enfermera_apellido}</strong>
                                </div>
                                <span className="text-muted small">
                                    {new Date(review.fecha).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="card-body">
                                <div className="mb-2">
                                    <StarRating rating={review.puntuacion} readOnly={true} />
                                </div>
                                <p className="card-text fst-italic">"{review.comentario}"</p>
                                <div className="d-flex justify-content-between align-items-end mt-3">
                                    <div className="small text-muted">
                                        <i className="bi bi-person me-1"></i>
                                        Por: {review.usuario_nombre || review.usuario_alias || 'Anónimo'}
                                    </div>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDelete(review.id)}
                                    >
                                        <i className="bi bi-trash me-1"></i>
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {reviews.length === 0 && (
                    <div className="col-12 text-center py-5">
                        <p className="text-muted fs-5">No hay calificaciones registradas</p>
                        <i className="bi bi-chat-square-text text-muted" style={{ fontSize: '3rem' }}></i>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCalificaciones;
