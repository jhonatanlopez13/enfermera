import React, { useState, useEffect } from 'react';
import { FaSave, FaClipboardList, FaUserInjured, FaCalendarAlt, FaFileMedical, FaCamera } from 'react-icons/fa';

const NovedadesPage = () => {
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchPacientes = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/pacientes');
                if (response.ok) {
                    const data = await response.ok ? await response.json() : [];
                    setPacientes(data);
                }
            } catch (err) {
                console.error("Error fetching patients:", err);
                setError('Error al cargar pacientes');
            } finally {
                setLoading(false);
            }
        };
        fetchPacientes();
    }, []);

    const [formData, setFormData] = useState({
        pacienteId: '',
        tipoNovedad: 'Evolución',
        descripcion: '',
        fecha: new Date().toISOString().split('T')[0],
        foto: null
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, foto: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:3001/api/novedades-pacientes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paciente_id: formData.pacienteId,
                    tipo_novedad: formData.tipoNovedad,
                    descripcion: formData.descripcion,
                    fecha: formData.fecha,
                    evidencia_foto: formData.foto ? formData.foto.name : null,
                    usuario_id: user ? user.id : null
                })
            });

            if (response.ok) {
                setIsSubmitted(true);
                setTimeout(() => setIsSubmitted(false), 3000);
                setFormData({
                    pacienteId: '',
                    tipoNovedad: 'Evolución',
                    descripcion: '',
                    fecha: new Date().toISOString().split('T')[0],
                    foto: null
                });
            } else {
                throw new Error('Error al registrar novedad');
            }
        } catch (err) {
            console.error(err);
            setError('No se pudo guardar la novedad. Por favor reintente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow border-0">
                        <div className="card-header bg-primary text-white p-4">
                            <h3 className="mb-0 d-flex align-items-center">
                                <FaFileMedical className="me-3" />
                                Registro de Novedades de Pacientes
                            </h3>
                        </div>
                        <div className="card-body p-4">
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}
                            {isSubmitted && (
                                <div className="alert alert-success alert-dismissible fade show" role="alert">
                                    <strong>¡Éxito!</strong> La novedad ha sido registrada correctamente.
                                    <button type="button" className="btn-close" onClick={() => setIsSubmitted(false)}></button>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="form-label fw-bold">Seleccionar Paciente</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light"><FaUserInjured className="text-primary" /></span>
                                        <select
                                            className="form-select"
                                            name="pacienteId"
                                            value={formData.pacienteId}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">-- Seleccione un paciente --</option>
                                            {pacientes.map(p => (
                                                <option key={p.id} value={p.id}>{p.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="row g-3 mb-4">
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Tipo de Novedad</label>
                                        <select
                                            className="form-select"
                                            name="tipoNovedad"
                                            value={formData.tipoNovedad}
                                            onChange={handleChange}
                                        >
                                            <option>Evolución</option>
                                            <option>Incidencia Médica</option>
                                            <option>Cambio de Medicación</option>
                                            <option>Administrativa</option>
                                            <option>Otro</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Fecha del Evento</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light"><FaCalendarAlt className="text-primary" /></span>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name="fecha"
                                                value={formData.fecha}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-bold">Descripción Detallada</label>
                                    <textarea
                                        className="form-control"
                                        rows="4"
                                        name="descripcion"
                                        value={formData.descripcion}
                                        onChange={handleChange}
                                        placeholder="Describa la novedad, síntomas observados, o cambios relevantes..."
                                        required
                                    ></textarea>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-bold">Evidencia (Foto/Documento)</label>
                                    <div className="input-group">
                                        <input
                                            type="file"
                                            className="form-control"
                                            accept="image/*,.pdf"
                                            onChange={handleFileChange}
                                        />
                                        <span className="input-group-text"><FaCamera /></span>
                                    </div>
                                    <small className="text-muted">Opcional. Subir foto o documento relacionado.</small>
                                </div>

                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                        <FaSave className="me-2" />
                                        {loading ? 'Guardando...' : 'Guardar Novedad'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NovedadesPage;
