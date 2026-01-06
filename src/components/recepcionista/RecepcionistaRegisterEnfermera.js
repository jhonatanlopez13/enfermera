import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterEnfermeraForm from '../shared/RegisterEnfermeraForm';

const RecepcionistaRegisterEnfermera = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Verificar autenticación
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.rol_id !== 3) {
            navigate('/login');
            return;
        }
        setCurrentUser(user);
    }, [navigate]);

    const handleSuccess = (newEnfermera) => {
        console.log('✅ Enfermera registrada:', newEnfermera);
        // Redirigir al panel de recepcionista
        navigate('/recepcionista');
    };

    const handleCancel = () => {
        navigate('/recepcionista');
    };

    if (!currentUser) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-4">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <a href="/recepcionista" className="text-decoration-none">
                            <i className="bi bi-reception-4 me-1"></i>
                            Panel Recepción
                        </a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        Registrar Enfermera
                    </li>
                </ol>
            </nav>

            {/* Título */}
            <div className="row mb-4">
                <div className="col">
                    <h2 className="mb-1">
                        <i className="bi bi-person-plus-fill text-success me-2"></i>
                        Registrar Nueva Enfermera
                    </h2>
                    <p className="text-muted mb-0">
                        Completa el formulario para agregar una nueva enfermera al sistema
                    </p>
                </div>
            </div>

            {/* Formulario */}
            <div className="row">
                <div className="col-lg-10 col-xl-8">
                    <RegisterEnfermeraForm
                        onSuccess={handleSuccess}
                        onCancel={handleCancel}
                    />
                </div>
            </div>
        </div>
    );
};

export default RecepcionistaRegisterEnfermera;
