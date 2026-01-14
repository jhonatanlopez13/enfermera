import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import authService from '../../services/auth.service';
import {
    FaBell,
    FaUserNurse,
    FaCalendarDay,
    FaCamera,
    FaSearch,
    FaSync
} from 'react-icons/fa';

const RecepcionistaDashboard = () => {
    const currentUser = authService.getCurrentUser();
    const [novedadesPacientes, setNovedadesPacientes] = useState([]);
    const [novedadesEnfermeras, setNovedadesEnfermeras] = useState([]);
    const [loadingPacientes, setLoadingPacientes] = useState(false);
    const [loadingEnfermeras, setLoadingEnfermeras] = useState(false);
    const [searchPaciente, setSearchPaciente] = useState('');
    const [searchEnfermera, setSearchEnfermera] = useState('');
    const [filterTipoPaciente, setFilterTipoPaciente] = useState('todas');

    // Cargar novedades de pacientes
    const loadNovedadesPacientes = async () => {
        setLoadingPacientes(true);
        try {
            const response = await fetch('http://localhost:3001/api/novedades-pacientes');
            const data = await response.json();
            setNovedadesPacientes(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error cargando novedades de pacientes:', error);
            setNovedadesPacientes([]);
        } finally {
            setLoadingPacientes(false);
        }
    };

    // Cargar novedades de enfermeras (calendario)
    const loadNovedadesEnfermeras = async () => {
        setLoadingEnfermeras(true);
        try {
            const response = await fetch('http://localhost:3001/api/novedades');
            const data = await response.json();
            setNovedadesEnfermeras(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error cargando novedades de enfermeras:', error);
            setNovedadesEnfermeras([]);
        } finally {
            setLoadingEnfermeras(false);
        }
    };

    useEffect(() => {
        loadNovedadesPacientes();
        loadNovedadesEnfermeras();
    }, []);

    // Filtrar novedades de pacientes
    const filteredNovedadesPacientes = novedadesPacientes.filter(novedad => {
        const matchesSearch = novedad.nombre?.toLowerCase().includes(searchPaciente.toLowerCase()) ||
            novedad.apellido?.toLowerCase().includes(searchPaciente.toLowerCase()) ||
            novedad.descripcion?.toLowerCase().includes(searchPaciente.toLowerCase());
        const matchesTipo = filterTipoPaciente === 'todas' || novedad.tipo_novedad === filterTipoPaciente;
        return matchesSearch && matchesTipo;
    });

    // Filtrar novedades de enfermeras
    const filteredNovedadesEnfermeras = novedadesEnfermeras.filter(novedad => {
        return novedad.nota?.toLowerCase().includes(searchEnfermera.toLowerCase()) ||
            novedad.usuario_nombre?.toLowerCase().includes(searchEnfermera.toLowerCase()) ||
            novedad.usuario_apellido?.toLowerCase().includes(searchEnfermera.toLowerCase());
    });

    const getTipoBadgeClass = (tipo) => {
        switch (tipo) {
            case 'mejoria': return 'bg-success';
            case 'empeoramiento': return 'bg-danger';
            case 'estable': return 'bg-info';
            case 'observacion': return 'bg-warning';
            default: return 'bg-secondary';
        }
    };

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

            <div className="row g-4 mb-4">
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

            {/* Listado de Novedades de Pacientes */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card shadow">
                        <div className="card-header bg-white">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0">
                                    <FaBell className="me-2 text-primary" />
                                    Novedades de Pacientes
                                </h5>
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={loadNovedadesPacientes}
                                    disabled={loadingPacientes}
                                >
                                    <FaSync className={loadingPacientes ? 'fa-spin' : ''} />
                                </button>
                            </div>
                            <div className="row g-2">
                                <div className="col-md-6">
                                    <div className="input-group input-group-sm">
                                        <span className="input-group-text">
                                            <FaSearch />
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Buscar por paciente o descripción..."
                                            value={searchPaciente}
                                            onChange={(e) => setSearchPaciente(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <select
                                        className="form-select form-select-sm"
                                        value={filterTipoPaciente}
                                        onChange={(e) => setFilterTipoPaciente(e.target.value)}
                                    >
                                        <option value="todas">Todos los tipos</option>
                                        <option value="mejoria">Mejoría</option>
                                        <option value="empeoramiento">Empeoramiento</option>
                                        <option value="estable">Estable</option>
                                        <option value="observacion">Observación</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            {loadingPacientes ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Cargando...</span>
                                    </div>
                                </div>
                            ) : filteredNovedadesPacientes.length === 0 ? (
                                <div className="text-center py-5">
                                    <FaBell size={48} className="text-muted mb-3" />
                                    <h5>No hay novedades de pacientes</h5>
                                    <p className="text-muted">No se encontraron novedades registradas</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Fecha</th>
                                                <th>Paciente</th>
                                                <th>Tipo</th>
                                                <th>Descripción</th>
                                                <th className="text-center">Evidencia</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredNovedadesPacientes.map(novedad => (
                                                <tr key={novedad.id}>
                                                    <td>
                                                        <small className="text-muted">
                                                            <FaCalendarDay className="me-1" />
                                                            {new Date(novedad.fecha).toLocaleDateString('es-ES')}
                                                        </small>
                                                    </td>
                                                    <td>
                                                        <div className="fw-bold">
                                                            {novedad.nombre} {novedad.apellido}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${getTipoBadgeClass(novedad.tipo_novedad)}`}>
                                                            {novedad.tipo_novedad}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <small>{novedad.descripcion}</small>
                                                    </td>
                                                    <td className="text-center">
                                                        {novedad.evidencia_foto && (
                                                            <span className="badge bg-success">
                                                                <FaCamera className="me-1" />
                                                                Foto
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Listado de Novedades de Enfermeras */}
            <div className="row">
                <div className="col-12">
                    <div className="card shadow">
                        <div className="card-header bg-white">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0">
                                    <FaUserNurse className="me-2 text-success" />
                                    Novedades de Enfermeras (Calendario)
                                </h5>
                                <button
                                    className="btn btn-sm btn-outline-success"
                                    onClick={loadNovedadesEnfermeras}
                                    disabled={loadingEnfermeras}
                                >
                                    <FaSync className={loadingEnfermeras ? 'fa-spin' : ''} />
                                </button>
                            </div>
                            <div className="input-group input-group-sm">
                                <span className="input-group-text">
                                    <FaSearch />
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Buscar por enfermera o nota..."
                                    value={searchEnfermera}
                                    onChange={(e) => setSearchEnfermera(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="card-body p-0">
                            {loadingEnfermeras ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-success" role="status">
                                        <span className="visually-hidden">Cargando...</span>
                                    </div>
                                </div>
                            ) : filteredNovedadesEnfermeras.length === 0 ? (
                                <div className="text-center py-5">
                                    <FaUserNurse size={48} className="text-muted mb-3" />
                                    <h5>No hay novedades de enfermeras</h5>
                                    <p className="text-muted">No se encontraron novedades del calendario</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Fecha</th>
                                                <th>Enfermera</th>
                                                <th>Nota</th>
                                                <th className="text-center">Evidencia</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredNovedadesEnfermeras.map(novedad => (
                                                <tr key={novedad.id}>
                                                    <td>
                                                        <small className="text-muted">
                                                            <FaCalendarDay className="me-1" />
                                                            {new Date(novedad.fecha).toLocaleDateString('es-ES')}
                                                        </small>
                                                    </td>
                                                    <td>
                                                        <div className="fw-bold">
                                                            {novedad.usuario_nombre} {novedad.usuario_apellido}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <small>{novedad.nota}</small>
                                                    </td>
                                                    <td className="text-center">
                                                        {novedad.evidencia_foto && (
                                                            <span className="badge bg-success">
                                                                <FaCamera className="me-1" />
                                                                Foto
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecepcionistaDashboard;
