import React, { useState, useEffect } from 'react';
import {
    FaClipboardCheck,
    FaCalendarAlt,
    FaCamera,
    FaUserInjured,
    FaChartBar,
    FaPlus,
    FaEdit,
    FaTrash,
    FaCheckCircle,
    FaClock,
    FaMapMarkerAlt,
    FaCalendarDay,
    FaUserCheck,
    FaFileMedical,
    FaArrowLeft,
    FaArrowRight,
    FaSearch,
    FaFilter,
    FaTimes,
    FaSave,
    FaUpload,
    FaEye
} from 'react-icons/fa';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import './EnfermeraDashboard.css';

// Componente principal del Dashboard de Enfermera
const EnfermeraDashboard = () => {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('pruebas');
    const [pruebas, setPruebas] = useState([]);
    const [turnos, setTurnos] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    const [estadisticas, setEstadisticas] = useState({});
    const [currentDate, setCurrentDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [showAddPruebaModal, setShowAddPruebaModal] = useState(false);
    const [showAsistenciaModal, setShowAsistenciaModal] = useState(false);
    const [selectedTurno, setSelectedTurno] = useState(null);

    useEffect(() => {
        if (currentUser) {
            loadData();
        }
    }, [currentUser, currentDate]);

    const loadData = async () => {
        setLoading(true);
        try {
            // Cargar pruebas
            const pruebasRes = await fetch(`http://localhost:3001/api/enfermera/pruebas?enfermeraId=${currentUser.id}`);
            const pruebasData = await pruebasRes.json();
            setPruebas(pruebasData);

            // Cargar turnos del mes
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;
            const turnosRes = await fetch(
                `http://localhost:3001/api/enfermera/turnos?enfermeraId=${currentUser.id}&year=${year}&month=${month}`
            );
            const turnosData = await turnosRes.json();
            setTurnos(turnosData);

            // Cargar pacientes
            const pacientesRes = await fetch('http://localhost:3001/api/enfermera/pacientes');
            const pacientesData = await pacientesRes.json();
            setPacientes(pacientesData);

            // Cargar estadísticas
            const statsRes = await fetch(`http://localhost:3001/api/enfermera/estadisticas?enfermeraId=${currentUser.id}`);
            const statsData = await statsRes.json();
            setEstadisticas(statsData);
        } catch (error) {
            console.error('Error cargando datos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrevMonth = () => {
        setCurrentDate(subMonths(currentDate, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(addMonths(currentDate, 1));
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    const handleRegistrarAsistencia = (turno) => {
        setSelectedTurno(turno);
        setShowAsistenciaModal(true);
    };

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary"></div>
                <p className="mt-3">Cargando panel de enfermera...</p>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4 enfermera-dashboard">
            {/* Header */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card bg-primary text-white shadow">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h1 className="h3 mb-1">
                                        <FaUserCheck className="me-2" />
                                        Panel de Enfermera
                                    </h1>
                                    <p className="mb-0 opacity-75">
                                        Bienvenida, <strong>{currentUser.nombre}</strong>
                                    </p>
                                </div>
                                <div className="text-end">
                                    <p className="mb-0">
                                        <FaCalendarDay className="me-1" />
                                        {format(new Date(), "EEEE d 'de' MMMM, yyyy", { locale: es })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Estadísticas */}
            <div className="row mb-4">
                <div className="col-md-3 mb-3">
                    <div className="card estadistica-card bg-success text-white h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="card-title">Pruebas Completadas</h6>
                                    <h2 className="mb-0">{estadisticas.pruebas_completadas || 0}</h2>
                                </div>
                                <FaCheckCircle size={40} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-3">
                    <div className="card estadistica-card bg-warning text-white h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="card-title">Pruebas Pendientes</h6>
                                    <h2 className="mb-0">{estadisticas.pruebas_pendientes || 0}</h2>
                                </div>
                                <FaClock size={40} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-3">
                    <div className="card estadistica-card bg-info text-white h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="card-title">Turnos Este Mes</h6>
                                    <h2 className="mb-0">{estadisticas.turnos_este_mes || 0}</h2>
                                </div>
                                <FaCalendarAlt size={40} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 mb-3">
                    <div className="card estadistica-card bg-purple text-white h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="card-title">Total Pruebas</h6>
                                    <h2 className="mb-0">{estadisticas.total_pruebas || 0}</h2>
                                </div>
                                <FaFileMedical size={40} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs de navegación */}
            <div className="row mb-4">
                <div className="col-12">
                    <ul className="nav nav-tabs enfermera-tabs">
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'pruebas' ? 'active' : ''}`}
                                onClick={() => setActiveTab('pruebas')}
                            >
                                <FaClipboardCheck className="me-2" />
                                Pruebas Médicas
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'calendario' ? 'active' : ''}`}
                                onClick={() => setActiveTab('calendario')}
                            >
                                <FaCalendarAlt className="me-2" />
                                Calendario de Turnos
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'pacientes' ? 'active' : ''}`}
                                onClick={() => setActiveTab('pacientes')}
                            >
                                <FaUserInjured className="me-2" />
                                Mis Pacientes
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Contenido de las pestañas */}
            <div className="row">
                <div className="col-12">
                    {activeTab === 'pruebas' && (
                        <PruebasMedicas
                            pruebas={pruebas}
                            pacientes={pacientes}
                            onRefresh={loadData}
                            onAddPrueba={() => setShowAddPruebaModal(true)}
                        />
                    )}

                    {activeTab === 'calendario' && (
                        <CalendarioTurnos
                            currentDate={currentDate}
                            turnos={turnos}
                            onPrevMonth={handlePrevMonth}
                            onNextMonth={handleNextMonth}
                            onToday={handleToday}
                            onRegistrarAsistencia={handleRegistrarAsistencia}
                        />
                    )}

                    {activeTab === 'pacientes' && (
                        <PacientesList pacientes={pacientes} />
                    )}
                </div>
            </div>

            {/* Modales */}
            {showAddPruebaModal && (
                <AddPruebaModal
                    pacientes={pacientes}
                    enfermeraId={currentUser.id}
                    onClose={() => setShowAddPruebaModal(false)}
                    onSuccess={() => {
                        setShowAddPruebaModal(false);
                        loadData();
                    }}
                />
            )}

            {showAsistenciaModal && selectedTurno && (
                <AsistenciaModal
                    turno={selectedTurno}
                    onClose={() => {
                        setShowAsistenciaModal(false);
                        setSelectedTurno(null);
                    }}
                    onSuccess={() => {
                        setShowAsistenciaModal(false);
                        setSelectedTurno(null);
                        loadData();
                    }}
                />
            )}
        </div>
    );
};

// Componente de Pruebas Médicas
const PruebasMedicas = ({ pruebas, pacientes, onRefresh, onAddPrueba }) => {
    const [filter, setFilter] = useState('todas');
    const [showDetalle, setShowDetalle] = useState(false);
    const [pruebaDetalle, setPruebaDetalle] = useState(null);

    const filteredPruebas = pruebas.filter(prueba => {
        if (filter === 'todas') return true;
        if (filter === 'completadas') return prueba.estado === 'completada';
        if (filter === 'pendientes') return prueba.estado === 'pendiente';
        return true;
    });

    const handleUpdateEstado = async (id, nuevoEstado) => {
        try {
            await fetch(`http://localhost:3001/api/enfermera/pruebas/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado: nuevoEstado })
            });
            onRefresh();
        } catch (error) {
            console.error('Error:', error);
            alert('Error al actualizar el estado');
        }
    };

    const handleDeletePrueba = async (id) => {
        if (window.confirm('¿Está seguro de eliminar esta prueba?')) {
            try {
                await fetch(`http://localhost:3001/api/enfermera/pruebas/${id}`, {
                    method: 'DELETE',
                });
                onRefresh();
                alert('Prueba eliminada exitosamente');
            } catch (error) {
                console.error('Error:', error);
                alert('Error al eliminar la prueba');
            }
        }
    };

    const handleViewDetalle = (prueba) => {
        setPruebaDetalle(prueba);
        setShowDetalle(true);
    };

    return (
        <>
            <div className="card shadow">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                        <FaClipboardCheck className="me-2 text-primary" />
                        Registro de Pruebas Médicas
                    </h5>
                    <div className="d-flex gap-2">
                        <div className="btn-group">
                            <button
                                className={`btn btn-sm ${filter === 'todas' ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setFilter('todas')}
                            >
                                Todas
                            </button>
                            <button
                                className={`btn btn-sm ${filter === 'completadas' ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setFilter('completadas')}
                            >
                                Completadas
                            </button>
                            <button
                                className={`btn btn-sm ${filter === 'pendientes' ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setFilter('pendientes')}
                            >
                                Pendientes
                            </button>
                        </div>
                        <button className="btn btn-primary btn-sm" onClick={onAddPrueba}>
                            <FaPlus className="me-1" /> Nueva Prueba
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Paciente</th>
                                    <th>Tipo de Prueba</th>
                                    <th>Fecha</th>
                                    <th>Descripción</th>
                                    <th>Resultado</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPruebas.map(prueba => (
                                    <tr key={prueba.id} className={prueba.estado === 'pendiente' ? 'table-warning' : 'table-success'}>
                                        <td>
                                            <strong>{prueba.nombre_paciente}</strong>
                                            {prueba.paciente_completo && (
                                                <div>
                                                    <small className="text-muted">{prueba.paciente_completo}</small>
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <span className="badge bg-info">{prueba.tipo_prueba}</span>
                                        </td>
                                        <td>{format(new Date(prueba.fecha_prueba), 'dd/MM/yyyy')}</td>
                                        <td>
                                            <div className="text-truncate" style={{ maxWidth: '200px' }}>
                                                {prueba.descripcion}
                                            </div>
                                        </td>
                                        <td>
                                            {prueba.resultado ? (
                                                <span className="text-success">{prueba.resultado}</span>
                                            ) : (
                                                <span className="text-muted">Sin resultado</span>
                                            )}
                                        </td>
                                        <td>
                                            <span className={`badge ${prueba.estado === 'completada' ? 'bg-success' : 'bg-warning'}`}>
                                                {prueba.estado === 'completada' ? 'Completada' : 'Pendiente'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="btn-group btn-group-sm">
                                                <button
                                                    className="btn btn-outline-info"
                                                    onClick={() => handleViewDetalle(prueba)}
                                                    title="Ver detalles"
                                                >
                                                    <FaEye />
                                                </button>
                                                {prueba.estado === 'pendiente' && (
                                                    <button
                                                        className="btn btn-outline-success"
                                                        onClick={() => handleUpdateEstado(prueba.id, 'completada')}
                                                        title="Marcar como completada"
                                                    >
                                                        <FaCheckCircle />
                                                    </button>
                                                )}
                                                <button className="btn btn-outline-danger"
                                                    onClick={() => handleDeletePrueba(prueba.id)}
                                                    title="Eliminar">
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredPruebas.length === 0 && (
                            <div className="text-center py-4">
                                <FaClipboardCheck size={48} className="text-muted mb-3" />
                                <h5>No hay pruebas registradas</h5>
                                <p className="text-muted">Agrega una nueva prueba para comenzar</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de Detalle de Prueba */}
            {showDetalle && pruebaDetalle && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                <FaClipboardCheck className="me-2" />
                                Detalle de Prueba
                            </h5>
                            <button className="btn-close" onClick={() => setShowDetalle(false)}></button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label text-muted">Paciente</label>
                                    <div className="fw-bold">{pruebaDetalle.nombre_paciente}</div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label text-muted">Tipo de Prueba</label>
                                    <div>
                                        <span className="badge bg-info">{pruebaDetalle.tipo_prueba}</span>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label text-muted">Fecha de Prueba</label>
                                    <div>{format(new Date(pruebaDetalle.fecha_prueba), 'dd/MM/yyyy')}</div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label text-muted">Estado</label>
                                    <div>
                                        <span className={`badge ${pruebaDetalle.estado === 'completada' ? 'bg-success' : 'bg-warning'}`}>
                                            {pruebaDetalle.estado === 'completada' ? 'Completada' : 'Pendiente'}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-12 mb-3">
                                    <label className="form-label text-muted">Descripción</label>
                                    <div className="p-3 bg-light rounded">{pruebaDetalle.descripcion}</div>
                                </div>
                                {pruebaDetalle.resultado && (
                                    <div className="col-12 mb-3">
                                        <label className="form-label text-muted">Resultado</label>
                                        <div className="p-3 bg-success text-white rounded">
                                            {pruebaDetalle.resultado}
                                        </div>
                                    </div>
                                )}
                                {pruebaDetalle.observaciones && (
                                    <div className="col-12 mb-3">
                                        <label className="form-label text-muted">Observaciones</label>
                                        <div className="p-3 bg-light rounded">{pruebaDetalle.observaciones}</div>
                                    </div>
                                )}
                                {pruebaDetalle.fecha_resultado && (
                                    <div className="col-12 mb-3">
                                        <label className="form-label text-muted">Fecha de Resultado</label>
                                        <div>{format(new Date(pruebaDetalle.fecha_resultado), 'dd/MM/yyyy')}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowDetalle(false)}>
                                <FaTimes className="me-1" /> Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// Componente de Calendario de Turnos
const CalendarioTurnos = ({ currentDate, turnos, onPrevMonth, onNextMonth, onToday, onRegistrarAsistencia }) => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const firstDayOfMonth = monthStart.getDay();

    const getTurnosDia = (fecha) => {
        const fechaStr = format(fecha, 'yyyy-MM-dd');
        return turnos.filter(turno => turno.fecha === fechaStr);
    };

    const getBadgeColor = (turno) => {
        if (turno.asistio) return 'bg-success';
        if (isSameDay(new Date(turno.fecha), new Date())) return 'bg-info';
        if (new Date(turno.fecha) < new Date() && !turno.asistio) return 'bg-danger';
        return 'bg-secondary';
    };

    const getBadgeText = (turno) => {
        if (turno.asistio) return 'Asistido';
        if (isSameDay(new Date(turno.fecha), new Date())) return 'Hoy';
        if (new Date(turno.fecha) < new Date() && !turno.asistio) return 'No asistido';
        return 'Pendiente';
    };

    return (
        <div className="card shadow">
            <div className="card-header bg-white">
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                        <FaCalendarAlt className="me-2 text-primary" />
                        Calendario de Turnos
                    </h5>
                    <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-primary" onClick={onPrevMonth}>
                            <FaArrowLeft />
                        </button>
                        <button className="btn btn-sm btn-outline-primary" onClick={onToday}>
                            Hoy
                        </button>
                        <button className="btn btn-sm btn-outline-primary" onClick={onNextMonth}>
                            <FaArrowRight />
                        </button>
                    </div>
                </div>
                <div className="text-center mt-2">
                    <h4 className="mb-0 text-primary">
                        {format(currentDate, 'MMMM yyyy', { locale: es })}
                    </h4>
                </div>
            </div>
            <div className="card-body">
                <div className="calendar">
                    {/* Días de la semana */}
                    <div className="calendar-header">
                        {weekDays.map(day => (
                            <div key={day} className="calendar-weekday">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Días del mes */}
                    <div className="calendar-grid">
                        {/* Espacios vacíos */}
                        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                            <div key={`empty-${index}`} className="calendar-day empty"></div>
                        ))}

                        {/* Días del mes */}
                        {monthDays.map(day => {
                            const turnosDia = getTurnosDia(day);
                            const esHoy = isSameDay(day, new Date());

                            return (
                                <div
                                    key={day.toISOString()}
                                    className={`calendar-day ${esHoy ? 'today' : ''} ${turnosDia.length > 0 ? 'has-turnos' : ''}`}
                                >
                                    <div className="calendar-date">
                                        <span className={`date-number ${esHoy ? 'today' : ''}`}>
                                            {format(day, 'd')}
                                        </span>
                                    </div>

                                    {/* Turnos del día */}
                                    <div className="calendar-turnos">
                                        {turnosDia.map(turno => (
                                            <div key={turno.id} className="turno-item">
                                                <div className="d-flex justify-content-between align-items-center mb-1">
                                                    <span className={`badge ${getBadgeColor(turno)}`}>
                                                        {getBadgeText(turno)}
                                                    </span>
                                                    {turno.evidencia_foto && (
                                                        <span className="badge bg-success">
                                                            <FaCamera className="me-1" />
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="turno-info">
                                                    <small className="d-block">
                                                        <FaClock className="me-1" />
                                                        {turno.hora_inicio} - {turno.hora_fin}
                                                    </small>
                                                    <small className="d-block text-truncate" title={turno.ubicacion}>
                                                        <FaMapMarkerAlt className="me-1" />
                                                        {turno.ubicacion}
                                                    </small>
                                                </div>
                                                {!turno.asistio && isSameDay(new Date(turno.fecha), new Date()) && (
                                                    <button
                                                        className="btn btn-sm btn-primary w-100 mt-2"
                                                        onClick={() => onRegistrarAsistencia(turno)}
                                                    >
                                                        <FaCamera className="me-1" />
                                                        Registrar Asistencia
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Leyenda */}
                <div className="calendar-legend mt-4">
                    <div className="row g-2">
                        <div className="col-auto">
                            <div className="d-flex align-items-center">
                                <div className="legend-color bg-success me-2"></div>
                                <small>Asistido</small>
                            </div>
                        </div>
                        <div className="col-auto">
                            <div className="d-flex align-items-center">
                                <div className="legend-color bg-danger me-2"></div>
                                <small>No asistido</small>
                            </div>
                        </div>
                        <div className="col-auto">
                            <div className="d-flex align-items-center">
                                <div className="legend-color bg-info me-2"></div>
                                <small>Hoy</small>
                            </div>
                        </div>
                        <div className="col-auto">
                            <div className="d-flex align-items-center">
                                <div className="legend-color bg-secondary me-2"></div>
                                <small>Pendiente</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Componente de Lista de Pacientes
const PacientesList = ({ pacientes }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPacientes = pacientes.filter(paciente =>
        paciente.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="card shadow">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                    <FaUserInjured className="me-2 text-primary" />
                    Mis Pacientes
                </h5>
                <div className="d-flex align-items-center gap-2">
                    <div className="input-group input-group-sm" style={{ width: '250px' }}>
                        <span className="input-group-text">
                            <FaSearch />
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar paciente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-sm btn-outline-primary">
                        <FaFilter className="me-1" />
                        Filtros
                    </button>
                </div>
            </div>
            <div className="card-body">
                <div className="row">
                    {filteredPacientes.map(paciente => (
                        <div key={paciente.id} className="col-md-6 col-lg-4 mb-3">
                            <div className="card h-100 border">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <h6 className="card-title mb-1">{paciente.nombre_completo}</h6>
                                            <small className="text-muted">ID: #{paciente.id}</small>
                                        </div>
                                        <span className="badge bg-info">Paciente</span>
                                    </div>
                                    <div className="paciente-info">
                                        <div className="mb-2">
                                            <small className="text-muted d-block">Información de contacto</small>
                                            <div className="d-flex align-items-center gap-2">
                                                <FaUserInjured size={12} className="text-muted" />
                                                <small>Información disponible en historial</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer bg-transparent border-top">
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-sm btn-outline-primary flex-grow-1">
                                            <FaEye className="me-1" />
                                            Ver Historial
                                        </button>
                                        <button className="btn btn-sm btn-outline-success">
                                            <FaPlus />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {filteredPacientes.length === 0 && (
                    <div className="text-center py-5">
                        <FaUserInjured size={48} className="text-muted mb-3" />
                        <h5>No se encontraron pacientes</h5>
                        <p className="text-muted">No hay pacientes asignados o la búsqueda no obtuvo resultados</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Modal para agregar nueva prueba
const AddPruebaModal = ({ pacientes, enfermeraId, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        paciente_id: '',
        nombre_paciente: '',
        tipo_prueba: '',
        descripcion: '',
        fecha_prueba: new Date().toISOString().split('T')[0],
        observaciones: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Si selecciona un paciente de la lista, actualizar el nombre
        if (name === 'paciente_id') {
            const paciente = pacientes.find(p => p.id === parseInt(value));
            if (paciente) {
                setFormData(prev => ({
                    ...prev,
                    nombre_paciente: paciente.nombre_completo
                }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:3001/api/enfermera/pruebas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    enfermera_id: enfermeraId
                }),
            });

            if (response.ok) {
                alert('Prueba creada exitosamente');
                onSuccess();
            } else {
                const data = await response.json();
                setError(data.error || 'Error al crear la prueba');
            }
        } catch (error) {
            setError('Error de conexión con el servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h5 className="modal-title">
                        <FaPlus className="me-2" />
                        Nueva Prueba Médica
                    </h5>
                    <button className="btn-close" onClick={onClose}></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {error && (
                            <div className="alert alert-danger">
                                <FaTimes className="me-2" />
                                {error}
                            </div>
                        )}

                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Paciente *</label>
                                <select
                                    className="form-select"
                                    name="paciente_id"
                                    value={formData.paciente_id}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccionar paciente...</option>
                                    {pacientes.map(paciente => (
                                        <option key={paciente.id} value={paciente.id}>
                                            {paciente.nombre_completo}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Nombre del Paciente *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="nombre_paciente"
                                    value={formData.nombre_paciente}
                                    onChange={handleChange}
                                    required
                                    placeholder="Nombre completo del paciente"
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Tipo de Prueba *</label>
                                <select
                                    className="form-select"
                                    name="tipo_prueba"
                                    value={formData.tipo_prueba}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccionar tipo...</option>
                                    <option value="glucemia">Glucemia</option>
                                    <option value="presión arterial">Presión arterial</option>
                                    <option value="COVID-19">COVID-19</option>
                                    <option value="alergias">Alergias</option>
                                    <option value="hemograma">Hemograma</option>
                                    <option value="orina">Análisis de orina</option>
                                    <option value="radiografía">Radiografía</option>
                                    <option value="ecografía">Ecografía</option>
                                    <option value="electrocardiograma">Electrocardiograma</option>
                                </select>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Fecha de Prueba *</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="fecha_prueba"
                                    value={formData.fecha_prueba}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-12">
                                <label className="form-label">Descripción *</label>
                                <textarea
                                    className="form-control"
                                    name="descripcion"
                                    rows="3"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    required
                                    placeholder="Describe la prueba a realizar"
                                />
                            </div>

                            <div className="col-12">
                                <label className="form-label">Observaciones</label>
                                <textarea
                                    className="form-control"
                                    name="observaciones"
                                    rows="2"
                                    value={formData.observaciones}
                                    onChange={handleChange}
                                    placeholder="Observaciones adicionales (opcional)"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            <FaTimes className="me-1" /> Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <FaSave className="me-1" /> Guardar Prueba
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Modal para registrar asistencia
const AsistenciaModal = ({ turno, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        hora_entrada: '',
        hora_salida: '',
        observaciones: ''
    });
    const [evidenciaFoto, setEvidenciaFoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Establecer hora actual por defecto
        const now = new Date();
        const horaActual = now.toTimeString().split(' ')[0].substring(0, 5);

        setFormData({
            hora_entrada: horaActual,
            hora_salida: '',
            observaciones: `Asistencia registrada el ${format(new Date(), 'dd/MM/yyyy')}`
        });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEvidenciaFoto(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formDataToSend = new FormData();
        formDataToSend.append('hora_entrada', formData.hora_entrada);
        formDataToSend.append('hora_salida', formData.hora_salida);
        formDataToSend.append('observaciones', formData.observaciones);

        if (evidenciaFoto) {
            formDataToSend.append('evidencia_foto', evidenciaFoto);
        }

        try {
            const response = await fetch(`http://localhost:3001/api/enfermera/turnos/${turno.id}/asistencia`, {
                method: 'POST',
                body: formDataToSend,
            });

            if (response.ok) {
                alert('Asistencia registrada exitosamente');
                onSuccess();
            } else {
                const data = await response.json();
                setError(data.error || 'Error al registrar asistencia');
            }
        } catch (error) {
            setError('Error de conexión con el servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h5 className="modal-title">
                        <FaCamera className="me-2" />
                        Registrar Asistencia
                    </h5>
                    <button className="btn-close" onClick={onClose}></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {error && (
                            <div className="alert alert-danger">
                                <FaTimes className="me-2" />
                                {error}
                            </div>
                        )}

                        {/* Información del turno */}
                        <div className="card mb-4">
                            <div className="card-body">
                                <h6 className="card-title">Información del Turno</h6>
                                <div className="row">
                                    <div className="col-md-6">
                                        <small className="text-muted">Fecha</small>
                                        <div className="fw-bold">{format(new Date(turno.fecha), 'dd/MM/yyyy')}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <small className="text-muted">Turno</small>
                                        <div className="fw-bold">{turno.turno}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <small className="text-muted">Horario</small>
                                        <div className="fw-bold">{turno.hora_inicio} - {turno.hora_fin}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <small className="text-muted">Ubicación</small>
                                        <div className="fw-bold text-truncate">{turno.ubicacion}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Hora de Entrada *</label>
                                <input
                                    type="time"
                                    className="form-control"
                                    name="hora_entrada"
                                    value={formData.hora_entrada}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Hora de Salida</label>
                                <input
                                    type="time"
                                    className="form-control"
                                    name="hora_salida"
                                    value={formData.hora_salida}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-12">
                                <label className="form-label">Evidencia Fotográfica</label>
                                <div className="input-group">
                                    <input
                                        type="file"
                                        className="form-control"
                                        accept="image/*"
                                        capture="environment"
                                        onChange={handleFileChange}
                                    />
                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={() => document.querySelector('input[type="file"]').click()}
                                    >
                                        <FaUpload />
                                    </button>
                                </div>
                                <small className="text-muted">
                                    Sube una foto como evidencia de asistencia (opcional, máximo 5MB)
                                </small>
                                {evidenciaFoto && (
                                    <div className="alert alert-info mt-2">
                                        <FaEye className="me-2" />
                                        Archivo seleccionado: {evidenciaFoto.name}
                                    </div>
                                )}
                            </div>

                            <div className="col-12">
                                <label className="form-label">Observaciones</label>
                                <textarea
                                    className="form-control"
                                    name="observaciones"
                                    rows="3"
                                    value={formData.observaciones}
                                    onChange={handleChange}
                                    placeholder="Observaciones adicionales sobre la asistencia"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            <FaTimes className="me-1" /> Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Registrando...
                                </>
                            ) : (
                                <>
                                    <FaSave className="me-1" /> Registrar Asistencia
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Hook useAuth para contexto de autenticación
const useAuth = () => {
    // Esto debería venir del contexto de autenticación
    // Por ahora, retornamos un usuario de prueba
    return {
        currentUser: {
            id: 2,
            nombre: 'Laura Gómez',
            usuario: 'enfermera1',
            rol_id: 2,
            rol_nombre: 'ENFERMERA'
        }
    };
};

export default EnfermeraDashboard;