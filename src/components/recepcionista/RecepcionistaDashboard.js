import React from 'react';
import { Link } from 'react-router-dom';
import authService from '../../services/auth.service';

const RecepcionistaDashboard = () => {
    const currentUser = authService.getCurrentUser();

    return (
        <div className="container py-5">
            <div className="row mb-4">
                <div className="col-md-12">
                    <div className="card shadow-sm border-0 bg-light">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center">
                                <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '64px', height: '64px' }}>
                                    <i className="bi bi-reception-4 fs-2"></i>
                                </div>
                                <div>
                                    <h2 className="card-title fw-bold mb-1">Panel de Recepción</h2>
                                    <p className="card-text text-muted mb-0">Bienvenido/a, {currentUser?.nombre || currentUser?.usuario}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {/* Tarjeta de Gestión de Enfermeras */}
                <div className="col-md-6 col-lg-4">
                    <div className="card h-100 border-success shadow-sm hover-shadow transition-all">
                        <div className="card-body text-center p-4">
                            <div className="mb-3 text-success">
                                <i className="bi bi-person-plus-fill fs-1"></i>
                            </div>
                            <h5 className="card-title fw-bold">Registrar Enfermera</h5>
                            <p className="card-text text-muted">Dar de alta a nuevas enfermeras en el sistema.</p>
                            <Link to="/recepcionista/register-enfermera" className="btn btn-outline-success stretched-link">
                                <i className="bi bi-plus-circle me-1"></i>
                                Registrar
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Tarjeta de Registro de Novedades */}
                <div className="col-md-6 col-lg-4">
                    <div className="card h-100 border-primary shadow-sm hover-shadow transition-all">
                        <div className="card-body text-center p-4">
                            <div className="mb-3 text-primary">
                                <i className="bi bi-file-earmark-medical-fill fs-1"></i>
                            </div>
                            <h5 className="card-title fw-bold">Registro de Novedades</h5>
                            <p className="card-text text-muted">Registrar novedades y evolución de los pacientes.</p>
                            <Link to="/recepcionista/novedades-pacientes" className="btn btn-outline-primary stretched-link">
                                <i className="bi bi-pencil-square me-1"></i>
                                Registrar
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Tarjeta de Calendario y Asistencia */}
                <div className="col-md-6 col-lg-4">
                    <div className="card h-100 border-info shadow-sm hover-shadow transition-all">
                        <div className="card-body text-center p-4">
                            <div className="mb-3 text-info">
                                <i className="bi bi-calendar-check-fill fs-1"></i>
                            </div>
                            <h5 className="card-title fw-bold">Calendario y Asistencia</h5>
                            <p className="card-text text-muted">Gestionar calendario, registrar novedades y asistencia.</p>
                            <Link to="/recepcionista/calendario" className="btn btn-outline-info stretched-link">
                                <i className="bi bi-calendar-week me-1"></i>
                                Ver Calendario
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecepcionistaDashboard;
