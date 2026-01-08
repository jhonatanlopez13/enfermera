import React, { useState, useEffect } from 'react';
import {
    FaCalendarAlt, FaCamera, FaArrowLeft, FaArrowRight, FaClock, FaMapMarkerAlt, FaTimes, FaSave, FaUpload, FaEye, FaClipboardCheck
} from 'react-icons/fa';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

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

    // Inicializar con hora actual
    const now = new Date();
    const horaActual = now.toTimeString().split(' ')[0].substring(0, 5);
    const [localFormData, setLocalFormData] = useState({
        hora_entrada: horaActual,
        hora_salida: '',
        observaciones: `Asistencia registrada el ${format(new Date(), 'dd/MM/yyyy')}`
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalFormData(prev => ({
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

        try {
            const response = await fetch(`http://localhost:3001/api/turnos/${turno.id}/asistencia`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    hora_entrada: localFormData.hora_entrada,
                    hora_salida: localFormData.hora_salida,
                    observaciones: localFormData.observaciones,
                    evidencia_foto: evidenciaFoto ? evidenciaFoto.name : null
                })
            });

            if (response.ok) {
                alert('Asistencia registrada exitosamente');
                setLoading(false);
                onSuccess();
            } else {
                throw new Error('Error al registrar asistencia');
            }
        } catch (error) {
            console.error(error);
            setError('Fallo al registrar asistencia');
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1050
        }}>
            <div className="modal-dialog modal-lg" style={{ width: '100%', maxWidth: '600px', margin: '1rem' }}>
                <div className="modal-content">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title d-flex align-items-center">
                            <FaCamera className="me-2" />
                            Registrar Asistencia
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
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
                            <div className="card mb-4 bg-light border-0">
                                <div className="card-body">
                                    <h6 className="card-title text-primary fw-bold">Información del Turno</h6>
                                    <div className="row g-2">
                                        <div className="col-6">
                                            <small className="text-muted d-block">Fecha</small>
                                            <span className="fw-bold">{turno.fecha ? format(new Date(turno.fecha), 'dd/MM/yyyy') : 'Sin fecha'}</span>
                                        </div>
                                        <div className="col-6">
                                            <small className="text-muted d-block">Turno</small>
                                            <span className="fw-bold">{turno.turno || 'No especificado'}</span>
                                        </div>
                                        <div className="col-12">
                                            <small className="text-muted d-block">Ubicación</small>
                                            <span className="fw-bold d-flex align-items-center">
                                                <FaMapMarkerAlt className="me-1 text-danger" />
                                                {turno.ubicacion || 'Sin ubicación'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Hora de Entrada *</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><FaClock /></span>
                                        <input
                                            type="time"
                                            className="form-control"
                                            name="hora_entrada"
                                            value={localFormData.hora_entrada}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Hora de Salida</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><FaClock /></span>
                                        <input
                                            type="time"
                                            className="form-control"
                                            name="hora_salida"
                                            value={localFormData.hora_salida}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-bold">Evidencia Fotográfica</label>
                                    <div className="input-group">
                                        <input
                                            type="file"
                                            className="form-control"
                                            accept="image/*"
                                            capture="environment"
                                            onChange={handleFileChange}
                                        />
                                        <span className="input-group-text"><FaUpload /></span>
                                    </div>
                                    <small className="text-muted">
                                        Sube una foto del lugar o paciente como evidencia (opcional)
                                    </small>
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-bold">Observaciones</label>
                                    <textarea
                                        className="form-control"
                                        name="observaciones"
                                        rows="3"
                                        value={localFormData.observaciones}
                                        onChange={handleChange}
                                        placeholder="Observaciones adicionales sobre la asistencia"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer bg-light">
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
        </div>
    );
};

// Modal para agregar nota/novedad al calendario
const NoteModal = ({ date, onClose, onSave }) => {
    const [note, setNote] = useState('');
    const [file, setFile] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ note, file });
    };

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1050
        }}>
            <div className="modal-dialog" style={{ width: '100%', maxWidth: '500px', margin: '1rem' }}>
                <div className="modal-content">
                    <div className="modal-header bg-info text-white">
                        <h5 className="modal-title">
                            <FaClipboardCheck className="me-2" />
                            Agregar Novedad - {date ? format(date, 'dd/MM/yyyy') : ''}
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Nota / Descripción</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Escribe una novedad o recordatorio..."
                                    required
                                ></textarea>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Foto / Evidencia</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    accept="image/*"
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                            <button type="submit" className="btn btn-info text-white">
                                <FaSave className="me-2" /> Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const CalendarioPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    const [selectedTurno, setSelectedTurno] = useState(null);
    const [turnos, setTurnos] = useState([]);

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const firstDayOfMonth = monthStart.getDay();

    const getTurnosDia = (fecha) => {
        const fechaStr = format(fecha, 'yyyy-MM-dd');
        return turnos.filter(turno => {
            // Fix timezone issue by comparing date strings carefully or just substr
            // Backend sends '2023-10-10T00:00:00.000Z' or just '2023-10-10' depending on driver
            // Assuming string match:
            if (!turno.fecha) return false;
            return turno.fecha.substring(0, 10) === fechaStr;
        });
    };

    const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const handleToday = () => setCurrentDate(new Date());

    const handleRegistrarAsistencia = (turno) => {
        setSelectedTurno(turno);
        setShowModal(true);
    };

    // --- Fetch Data ---
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const queryParams = user && user.rol_id === 2 ? `?enfermeraId=${user.id}` : '';
                const [turnosRes, novedadesRes] = await Promise.all([
                    fetch(`http://localhost:3001/api/turnos${queryParams}`),
                    fetch('http://localhost:3001/api/novedades')
                ]);

                if (turnosRes.ok) {
                    const turnosData = await turnosRes.json();
                    setTurnos(turnosData);
                }
                if (novedadesRes.ok) {
                    const novedadesData = await novedadesRes.json();
                    setNotes(novedadesData);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user?.id, user?.rol_id]);

    const handleSuccessAsistencia = async () => {
        setShowModal(false);
        // Refetch or update local
        // For simplicity, just update local state if we knew what changed, or refetch
        const queryParams = user && user.rol_id === 2 ? `?enfermeraId=${user.id}` : '';
        const res = await fetch(`http://localhost:3001/api/turnos${queryParams}`);
        if (res.ok) setTurnos(await res.json());
    };

    // --- Logic for Notes ---
    const [notes, setNotes] = useState([]);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDayClick = (day) => {
        setSelectedDate(day);
        setShowNoteModal(true);
    };

    const handleSaveNote = async (noteData) => {
        try {
            const response = await fetch('http://localhost:3001/api/novedades', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fecha: format(selectedDate, 'yyyy-MM-dd'),
                    nota: noteData.note,
                    usuario_id: user ? user.id : null,
                    // Sending filename as placeholder for evidence
                    evidencia_foto: noteData.file ? noteData.file.name : null
                })
            });

            if (response.ok) {
                const res = await fetch('http://localhost:3001/api/novedades');
                if (res.ok) setNotes(await res.json());
                setShowNoteModal(false);
            }
        } catch (error) {
            console.error("Error saving note:", error);
        }
    };

    const getNotesForDay = (day) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        return notes.filter(n => {
            if (!n.fecha) return false;
            // Handle if fecha is Date object or string
            const nDate = new Date(n.fecha);
            return format(nDate, 'yyyy-MM-dd') === dateStr;
        });
    };

    return (
        <div className="container py-5">
            <div className="card shadow border-0">
                <div className="card-header bg-white p-4 border-bottom">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <h3 className="mb-0 text-primary fw-bold">
                            <FaCalendarAlt className="me-2" />
                            Calendario Completo
                        </h3>
                        <div className="d-flex gap-2">
                            <button className="btn btn-outline-primary" onClick={handlePrevMonth}><FaArrowLeft /></button>
                            <button className="btn btn-outline-primary fw-bold" onClick={handleToday}>Hoy</button>
                            <button className="btn btn-outline-primary" onClick={handleNextMonth}><FaArrowRight /></button>
                        </div>
                    </div>
                    <div className="text-center mt-3">
                        <h4 className="mb-0 text-dark fw-bold text-uppercase">
                            {format(currentDate, 'MMMM yyyy', { locale: es })}
                        </h4>
                    </div>
                </div>

                <div className="card-body p-0">
                    {/* Calendar Header */}
                    <div className="d-flex bg-light text-center py-2 fw-bold text-secondary border-bottom">
                        {weekDays.map(day => (
                            <div key={day} className="flex-fill" style={{ width: '14.28%' }}>{day}</div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="d-flex flex-wrap">
                        {/* Empty cells for previous month */}
                        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                            <div key={`empty-${i}`} className="border-end border-bottom bg-light" style={{ width: '14.28%', minHeight: '120px' }}></div>
                        ))}

                        {/* Days */}
                        {monthDays.map(day => {
                            const dateStr = format(day, 'yyyy-MM-dd');
                            const dayTurnos = getTurnosDia(day);
                            const isToday = isSameDay(day, new Date());

                            return (
                                <div key={dateStr} className={`border-end border-bottom p-2 ${isToday ? 'bg-indigo-light' : ''}`}
                                    style={{ width: '14.28%', minHeight: '120px', backgroundColor: isToday ? '#f0f7ff' : 'white' }}>
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <span className={`fw-bold small rounded-circle d-flex align-items-center justify-content-center ${isToday ? 'bg-primary text-white' : 'text-secondary'}`}
                                            style={{ width: '28px', height: '28px' }}>
                                            {format(day, 'd')}
                                        </span>
                                    </div>

                                    <div className="d-flex flex-column gap-1" style={{ minHeight: '60px' }}
                                        onClick={(e) => {
                                            // Prevent triggering when clicking on children (if bubbles propagated)
                                            if (e.target === e.currentTarget) handleDayClick(day);
                                        }}>
                                        {/* Notes Section */}
                                        {getNotesForDay && getNotesForDay(day).map(note => (
                                            <div key={note.id} className="badge bg-warning text-dark text-start text-wrap mb-1" style={{ cursor: 'pointer' }} title={note.nota}>
                                                {note.evidencia_foto && <FaCamera className="me-1" />}
                                                {note.nota && note.nota.substring(0, 20)}...
                                            </div>
                                        ))}

                                        {/* Turnos Section */}
                                        {dayTurnos.map(turno => (
                                            <div key={turno.id} className={`p-2 rounded border small ${turno.asistio ? 'bg-success text-white' : 'bg-white border-primary text-primary'}`}
                                                style={{ fontSize: '0.8rem', cursor: 'pointer' }}
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent opening day modal
                                                    handleRegistrarAsistencia(turno);
                                                }}>
                                                <div className="fw-bold">{turno.turno}</div>
                                                <div className="text-truncate">{turno.hora_inicio} - {turno.hora_fin}</div>
                                                {turno.asistio && <div className="mt-1 badge bg-white text-success"><FaCamera className="me-1" /> Asistido</div>}
                                            </div>
                                        ))}

                                        {/* Add button hint if empty */}
                                        {dayTurnos.length === 0 && getNotesForDay(day).length === 0 && (
                                            <div className="text-center mt-2 opacity-0 hover-opacity-100">
                                                <button className="btn btn-sm btn-light text-muted w-100" onClick={() => handleDayClick(day)}>+</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showNoteModal && (
                <NoteModal
                    date={selectedDate}
                    onClose={() => setShowNoteModal(false)}
                    onSave={handleSaveNote}
                />
            )}

            {showModal && selectedTurno && (
                <AsistenciaModal
                    turno={selectedTurno}
                    onClose={() => setShowModal(false)}
                    onSuccess={handleSuccessAsistencia}
                />
            )}
        </div>
    );
};

export default CalendarioPage;
