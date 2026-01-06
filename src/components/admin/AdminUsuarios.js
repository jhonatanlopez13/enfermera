import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import authService from '../../services/auth.service';

const AdminUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Estado para edición
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        rol_id: 3,
        activo: 1
    });

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/usuarios');
            const data = await response.json();
            if (data.success) {
                setUsuarios(data.users);
            } else {
                setError(data.message || 'Error al cargar usuarios');
            }
        } catch (err) {
            setError('Error de conexión con el servidor');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (usuario) => {
        if (usuario.id === 1) {
            alert('No puedes eliminar al administrador principal.');
            return;
        }

        if (!window.confirm(`¿Estás seguro de que deseas desactivar al usuario ${usuario.nombre} ${usuario.apellido}?`)) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/api/usuarios/${usuario.id}`, {
                method: 'DELETE'
            });
            const data = await response.json();

            if (data.success) {
                // Actualizar lista localmente
                setUsuarios(usuarios.map(u =>
                    u.id === usuario.id ? { ...u, activo: 0 } : u
                ));
                alert('Usuario desactivado correctamente');
            } else {
                alert(data.error || 'Error al desactivar usuario');
            }
        } catch (err) {
            alert('Error de conexión');
        }
    };

    const handleEditClick = (usuario) => {
        setEditingUser(usuario);
        setFormData({
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            telefono: usuario.telefono || '',
            rol_id: usuario.rol_id,
            activo: usuario.activo
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3001/api/usuarios/${editingUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();

            if (data.success) {
                alert('Usuario actualizado correctamente');
                setEditingUser(null);
                fetchUsuarios(); // Recargar lista completa
            } else {
                alert(data.error || 'Error al actualizar');
            }
        } catch (err) {
            alert('Error de conexión');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const getRolBadge = (rolId, rolNombre) => {
        switch (rolId) {
            case 1: return <span className="badge bg-danger">Admin</span>;
            case 2: return <span className="badge bg-info text-dark">Enfermera</span>;
            case 3: return <span className="badge bg-success">Recepcionista</span>;
            case 4: return <span className="badge bg-primary">Paciente</span>;
            default: return <span className="badge bg-secondary">Usuario</span>;
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
        <div className="container py-5 position-relative">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>
                    <i className="bi bi-people-fill me-2 text-primary"></i>
                    Gestión de Usuarios
                </h2>
                <Link to="/admin" className="btn btn-outline-secondary">
                    <i className="bi bi-arrow-left me-1"></i>
                    Volver al Panel
                </Link>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="card shadow-sm border-0">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="ps-4">Usuario</th>
                                    <th>Rol</th>
                                    <th>Email</th>
                                    <th>Estado</th>
                                    <th className="text-end pe-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map(usuario => (
                                    <tr key={usuario.id} className={usuario.activo ? '' : 'table-secondary opacity-75'}>
                                        <td className="ps-4">
                                            <div className="d-flex align-items-center">
                                                <div className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${usuario.activo ? 'bg-light' : 'bg-secondary text-white'}`} style={{ width: '40px', height: '40px' }}>
                                                    <i className="bi bi-person-fill fs-5"></i>
                                                </div>
                                                <div>
                                                    <div className="fw-bold">{usuario.nombre} {usuario.apellido}</div>
                                                    <div className="text-muted small">@{usuario.usuario}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{getRolBadge(usuario.rol_id, usuario.rol_nombre)}</td>
                                        <td>{usuario.email}</td>
                                        <td>
                                            {usuario.activo ?
                                                <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">Activo</span> :
                                                <span className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill">Inactivo</span>
                                            }
                                        </td>
                                        <td className="text-end pe-4">
                                            <button
                                                className="btn btn-sm btn-outline-primary me-2"
                                                title="Editar"
                                                onClick={() => handleEditClick(usuario)}
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            {usuario.activo === 1 && (
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    title="Desactivar"
                                                    onClick={() => handleDelete(usuario)}
                                                    disabled={usuario.id === 1}
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal de Edición (Overlay manual) */}
            {editingUser && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">Editar Usuario</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setEditingUser(null)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleUpdate}>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Nombre</label>
                                            <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Apellido</label>
                                            <input type="text" className="form-control" name="apellido" value={formData.apellido} onChange={handleChange} required />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Email</label>
                                            <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Teléfono</label>
                                            <input type="text" className="form-control" name="telefono" value={formData.telefono} onChange={handleChange} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Rol</label>
                                            <select className="form-select" name="rol_id" value={formData.rol_id} onChange={handleChange}>
                                                <option value="1">Administrador</option>
                                                <option value="2">Enfermera</option>
                                                <option value="3">Recepcionista</option>
                                                <option value="4">Paciente</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Estado</label>
                                            <select className="form-select" name="activo" value={formData.activo} onChange={handleChange}>
                                                <option value="1">Activo</option>
                                                <option value="0">Inactivo</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-end gap-2 mt-4">
                                        <button type="button" className="btn btn-secondary" onClick={() => setEditingUser(null)}>Cancelar</button>
                                        <button type="submit" className="btn btn-primary">Guardar Cambios</button>
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

export default AdminUsuarios;
