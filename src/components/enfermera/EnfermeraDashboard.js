import React from 'react';
import { Link } from 'react-router-dom';

const EnfermeraDashboard = () => {
    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-12">
                    <h1 className="display-4 fw-bold mb-4">
                        <i className="bi bi-heart-pulse text-primary me-2"></i>
                        Panel de Enfermera
                    </h1>
                    <div className="alert alert-info">
                        <h4>Bienvenida Enfermera</h4>
                        <p>Desde aquí puedes gestionar tus pacientes, citas y reportes de atención.</p>
                    </div>
                    <div className="row mt-4">
                        <div className="col-md-4 mb-3">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body text-center">
                                    <i className="bi bi-calendar-check text-primary fs-1 mb-3"></i>
                                    <h5>Mis Citas</h5>
                                    <p>Gestiona tu agenda de citas</p>
                                    <Link to="/admin-solicitudes" className="btn btn-outline-primary">
                                        Ver Solicitudes
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-3">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body text-center">
                                    <i className="bi bi-file-medical text-primary fs-1 mb-3"></i>
                                    <h5>Historial Médico</h5>
                                    <p>Consulta historial de pacientes</p>
                                    <button className="btn btn-outline-primary" disabled>
                                        Próximamente
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-3">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body text-center">
                                    <i className="bi bi-clock-history text-primary fs-1 mb-3"></i>
                                    <h5>Turnos</h5>
                                    <p>Gestiona tus turnos de trabajo</p>
                                    <button className="btn btn-outline-primary" disabled>
                                        Próximamente
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <Link to="/" className="btn btn-primary">
                            <i className="bi bi-arrow-left me-2"></i>
                            Volver al inicio
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnfermeraDashboard;