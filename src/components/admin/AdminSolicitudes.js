import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminSolicitudes = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const API_URL = 'http://localhost:3001/api';

    useEffect(() => {
        fetchSolicitudes();
    }, []);

    const fetchSolicitudes = async () => {
        try {
            const response = await fetch(`${API_URL}/solicitudes`);
            if (!response.ok) throw new Error('Error al cargar solicitudes');
            const data = await response.json();
            setSolicitudes(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const response = await fetch(`${API_URL}/solicitudes/${id}/estado`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ estado: newStatus }),
            });

            if (!response.ok) throw new Error('Error al actualizar estado');

            // Actualizar estado localmente
            setSolicitudes(solicitudes.map(sol =>
                sol.id === id ? { ...sol, estado: newStatus } : sol
            ));
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar esta solicitud?')) return;

        try {
            const response = await fetch(`${API_URL}/solicitudes/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Error al eliminar solicitud');

            // Eliminar de la lista local
            setSolicitudes(solicitudes.filter(sol => sol.id !== id));
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pendiente': return 'bg-warning text-dark';
            case 'en_proceso': return 'bg-info text-dark';
            case 'completada': return 'bg-success';
            case 'cancelada': return 'bg-danger';
            default: return 'bg-secondary';
        }
    };

    const getUrgenciaBadge = (urgencia) => {
        switch (urgencia) {
            case 'Urgente': return 'bg-danger';
            case 'Alta': return 'bg-warning text-dark';
            case 'Normal': return 'bg-primary';
            case 'Baja': return 'bg-success';
            default: return 'bg-secondary';
        }
    };

    if (loading) return (
        <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
        </div>
    );

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>
                    <i className="bi bi-inbox-fill text-primary me-2"></i>
                    Gestión de Solicitudes
                </h2>
                <button className="btn btn-outline-primary" onClick={fetchSolicitudes}>
                    <i className="bi bi-arrow-clockwise me-2"></i>Actualizar
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="card shadow-sm">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th>Fecha</th>
                                    <th>Paciente</th>
                                    <th>Servicio</th>
                                    <th>Urgencia</th>
                                    <th>Contacto</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {solicitudes.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4 text-muted">
                                            No hay solicitudes registradas
                                        </td>
                                    </tr>
                                ) : (
                                    solicitudes.map((solicitud) => (
                                        <tr key={solicitud.id}>
                                            <td>
                                                {new Date(solicitud.fecha_creacion).toLocaleDateString()}
                                                <small className="d-block text-muted">
                                                    {new Date(solicitud.fecha_creacion).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </small>
                                            </td>
                                            <td>
                                                <div className="fw-bold">{solicitud.nombre_paciente}</div>
                                                <small className="text-muted">{solicitud.edad_paciente} años</small>
                                            </td>
                                            <td>
                                                {solicitud.tipo_servicio}
                                                <small className="d-block text-muted text-truncate" style={{ maxWidth: '200px' }}>
                                                    {solicitud.description}
                                                </small>
                                            </td>
                                            <td>
                                                <span className={`badge ${getUrgenciaBadge(solicitud.urgencia)}`}>
                                                    {solicitud.urgencia}
                                                </span>
                                            </td>
                                            <td>
                                                <div>{solicitud.nombre_contacto}</div>
                                                <small className="text-muted">{solicitud.telefono}</small>
                                            </td>
                                            <td>
                                                <div className="dropdown">
                                                    <button
                                                        className={`btn btn-sm dropdown-toggle badge ${getStatusBadge(solicitud.estado)} border-0`}
                                                        type="button"
                                                        data-bs-toggle="dropdown"
                                                        aria-expanded="false"
                                                    >
                                                        {solicitud.estado.replace('_', ' ').toUpperCase()}
                                                    </button>
                                                    <ul className="dropdown-menu">
                                                        <li><button className="dropdown-item" onClick={() => handleStatusChange(solicitud.id, 'pendiente')}>Pendiente</button></li>
                                                        <li><button className="dropdown-item" onClick={() => handleStatusChange(solicitud.id, 'en_proceso')}>En Proceso</button></li>
                                                        <li><button className="dropdown-item" onClick={() => handleStatusChange(solicitud.id, 'completada')}>Completada</button></li>
                                                        <li><hr className="dropdown-divider" /></li>
                                                        <li><button className="dropdown-item text-danger" onClick={() => handleStatusChange(solicitud.id, 'cancelada')}>Cancelar</button></li>
                                                    </ul>
                                                </div>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDelete(solicitud.id)}
                                                    title="Eliminar solicitud"
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSolicitudes;
