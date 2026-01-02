import React, { useState, useEffect, Suspense, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

// Importar componentes de autenticación
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Importar dashboards usando lazy loading
const AdminDashboard = React.lazy(() => import('./components/admin/AdminDashboard'));

// Crear contexto de autenticación
const AuthContext = createContext();

// Proveedor de autenticación
const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    // Cargar usuario del localStorage al inicializar
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

// Componente Login actualizado para usar el contexto
const LoginWithContext = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSuccess = (userData) => {
    login(userData);

    // Redirigir según el rol
    if (userData.rol_id === 1) {
      navigate('/admin'); // Administrador
    } else if (userData.rol_id === 2) {
      navigate('/enfermera'); // Enfermera
    } else if (userData.rol_id === 3) {
      navigate('/recepcionista'); // Recepcionista
    } else {
      navigate('/'); // Usuario normal
    }
  };

  return <Login onLoginSuccess={handleLoginSuccess} />;
};

// Componente placeholder para otros dashboards
const EnfermeraDashboard = () => (
  <div className="container py-5">
    <div className="card shadow">
      <div className="card-header bg-info text-white">
        <h3 className="mb-0">
          <i className="bi bi-heart-pulse me-2"></i>
          Panel de Enfermera
        </h3>
      </div>
      <div className="card-body text-center py-5">
        <i className="bi bi-heart-pulse-fill text-info fs-1 mb-3"></i>
        <h4>Panel en Desarrollo</h4>
        <p className="text-muted">Esta sección está actualmente en desarrollo.</p>
        <Link to="/" className="btn btn-primary mt-3">
          <i className="bi bi-house me-1"></i>
          Volver al Inicio
        </Link>
      </div>
    </div>
  </div>
);

const RecepcionistaDashboard = () => (
  <div className="container py-5">
    <div className="card shadow">
      <div className="card-header bg-success text-white">
        <h3 className="mb-0">
          <i className="bi bi-reception-4 me-2"></i>
          Panel de Recepción
        </h3>
      </div>
      <div className="card-body text-center py-5">
        <i className="bi bi-reception-4 text-success fs-1 mb-3"></i>
        <h4>Panel en Desarrollo</h4>
        <p className="text-muted">Esta sección está actualmente en desarrollo.</p>
        <Link to="/" className="btn btn-primary mt-3">
          <i className="bi bi-house me-1"></i>
          Volver al Inicio
        </Link>
      </div>
    </div>
  </div>
);

// Componente para rutas protegidas
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && currentUser.rol_id !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Componente para página no autorizada
const UnauthorizedPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card text-center shadow">
            <div className="card-header bg-danger text-white">
              <h3 className="mb-0">
                <i className="bi bi-shield-exclamation me-2"></i>
                Acceso No Autorizado
              </h3>
            </div>
            <div className="card-body py-5">
              <i className="bi bi-lock-fill text-danger fs-1 mb-3"></i>
              <h4>Permisos Insuficientes</h4>
              <p className="text-muted">No tienes los permisos necesarios para acceder a esta página.</p>
              <div className="mt-4">
                <button onClick={handleGoBack} className="btn btn-outline-primary me-2">
                  <i className="bi bi-arrow-left me-1"></i>
                  Volver Atrás
                </button>
                <Link to="/" className="btn btn-primary">
                  <i className="bi bi-house me-1"></i>
                  Ir al Inicio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente Navbar actualizado con autenticación (sin nombre de usuario)
const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/login');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.dropdown-container')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <i className="bi bi-heart-pulse-fill me-2 fs-4"></i>
          <span className="fw-bold">Enfermera Corazón</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                <i className="bi bi-house-door me-1"></i>
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/conoce-mas">
                <i className="bi bi-info-circle me-1"></i>
                Conoce Más
              </Link>
            </li>

            {/* Mostrar "Solicitar Atención" solo si NO está logueado o es paciente */}
            {(!currentUser || currentUser.rol_id === 4) && (
              <li className="nav-item">
                <Link className="nav-link" to="/solicita-atencion">
                  <i className="bi bi-clipboard-plus me-1"></i>
                  Solicitar Atención
                </Link>
              </li>
            )}

            {/* Mostrar "Solicitudes" solo para usuarios con rol específico */}
            {currentUser && currentUser.rol_id !== 4 && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin-solicitudes">
                  <i className="bi bi-list-check me-1"></i>
                  {currentUser.rol_id === 1 ? 'Solicitudes' :
                    currentUser.rol_id === 2 ? 'Mis Pacientes' :
                      'Gestión de Solicitudes'}
                </Link>
              </li>
            )}
          </ul>

          <ul className="navbar-nav ms-auto">
            {currentUser ? (
              <li className="nav-item dropdown-container" style={{ position: 'relative' }}>
                <button
                  className="nav-link dropdown-toggle d-flex align-items-center btn btn-link p-0 border-0"
                  onClick={toggleDropdown}
                  aria-expanded={showDropdown}
                  style={{
                    background: 'none',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <div className="bg-light rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: '40px', height: '40px' }}>
                    <i className={`bi ${currentUser.rol_id === 1 ? 'bi-shield-fill text-danger fs-5' :
                        currentUser.rol_id === 2 ? 'bi-heart-pulse-fill text-info fs-5' :
                          currentUser.rol_id === 3 ? 'bi-reception-4-fill text-success fs-5' :
                            'bi-person-fill text-primary fs-5'
                      }`}></i>
                  </div>
                </button>
                {showDropdown && (
                  <div
                    className="dropdown-menu show"
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '100%',
                      zIndex: 1000
                    }}
                  >
                    <li>
                      <h6 className="dropdown-header">
                        <i className={`bi ${currentUser.rol_id === 1 ? 'bi-shield me-2' :
                            currentUser.rol_id === 2 ? 'bi-heart-pulse me-2' :
                              currentUser.rol_id === 3 ? 'bi-reception-4 me-2' :
                                'bi-person me-2'
                          }`}></i>
                        {currentUser.rol_nombre}
                      </h6>
                    </li>

                    {/* Mostrar nombre de usuario solo en el dropdown */}
                    <li>
                      <div className="dropdown-item-text px-3 py-2">
                        <small className="text-muted d-block">Usuario:</small>
                        <strong>{currentUser.usuario}</strong>
                        {currentUser.nombre && (
                          <>
                            <small className="text-muted d-block mt-1">Nombre:</small>
                            <strong>{currentUser.nombre}</strong>
                          </>
                        )}
                      </div>
                    </li>

                    <li><hr className="dropdown-divider" /></li>

                    {/* Menú según rol */}
                    {currentUser.rol_id === 1 && (
                      <li>
                        <Link className="dropdown-item" to="/admin" onClick={closeDropdown}>
                          <i className="bi bi-speedometer2 me-2"></i>
                          Panel de Administración
                        </Link>
                      </li>
                    )}

                    {currentUser.rol_id === 2 && (
                      <li>
                        <Link className="dropdown-item" to="/enfermera" onClick={closeDropdown}>
                          <i className="bi bi-heart-pulse me-2"></i>
                          Panel Enfermera
                        </Link>
                      </li>
                    )}

                    {currentUser.rol_id === 3 && (
                      <li>
                        <Link className="dropdown-item" to="/recepcionista" onClick={closeDropdown}>
                          <i className="bi bi-reception-4 me-2"></i>
                          Panel Recepción
                        </Link>
                      </li>
                    )}

                    {currentUser.rol_id === 4 && (
                      <li>
                        <Link className="dropdown-item" to="/mi-perfil" onClick={closeDropdown}>
                          <i className="bi bi-person-circle me-2"></i>
                          Mi Perfil
                        </Link>
                      </li>
                    )}

                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Cerrar Sesión
                      </button>
                    </li>
                  </div>
                )}
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    Iniciar Sesión
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    <i className="bi bi-person-plus me-1"></i>
                    Registrarse
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

// Componente Footer
const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h5 className="mb-3">
              <i className="bi bi-heart-pulse-fill text-primary me-2"></i>
              Enfermera Corazón
            </h5>
            <p className="mb-0 text-muted">Cuidado profesional con corazón humano</p>
            <small className="text-muted">© {new Date().getFullYear()} Todos los derechos reservados</small>
          </div>
          <div className="col-md-6 text-md-end">
            <div className="d-flex justify-content-md-end gap-3 mb-3">
              <a href="#" className="text-white fs-5" title="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="text-white fs-5" title="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="text-white fs-5" title="WhatsApp">
                <i className="bi bi-whatsapp"></i>
              </a>
            </div>
            <p className="mb-0 text-muted">
              <i className="bi bi-geo-alt me-1"></i>
              Av. Salud 123, Ciudad Médica
            </p>
            <p className="mb-0 text-muted">
              <i className="bi bi-telephone me-1"></i>
              +1 (555) 123-4567
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Componente HomePage
const HomePage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleSolicitarAtencion = () => {
    if (currentUser && currentUser.rol_id !== 4) {
      navigate('/admin-solicitudes');
    } else {
      navigate('/solicita-atencion');
    }
  };

  return (
    <>
      {/* Hero Section */}
      <header className="hero-section text-white py-5">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">Cuidado Profesional a Domicilio</h1>
              <p className="lead mb-4">Enfermería especializada con el calor de un cuidado humano. Atención 24/7 para tus seres queridos.</p>
              <div className="d-flex flex-column flex-md-row gap-3">
                <button onClick={handleSolicitarAtencion} className="btn btn-light btn-lg px-4">
                  <i className="bi bi-clipboard-plus me-2"></i>
                  {currentUser && currentUser.rol_id !== 4 ? 'Ver Solicitudes' : 'Solicitar Atención'}
                </button>
                <Link to="/conoce-mas" className="btn btn-outline-light btn-lg px-4">
                  <i className="bi bi-info-circle me-2"></i>
                  Conocer Más
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center mt-4 mt-lg-0">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80"
                className="img-fluid rounded shadow-lg"
                alt="Enfermera profesional cuidando paciente"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Services Section */}
      <section id="services" className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">Nuestros Servicios</h2>
            <p className="lead text-muted">Atención integral para todas tus necesidades de salud</p>
          </div>
          <div className="row g-4">
            {[
              { icon: 'bi-house-heart-fill', title: 'Cuidado a Domicilio', desc: 'Atención personalizada en la comodidad de tu hogar' },
              { icon: 'bi-calendar-heart', title: 'Programas Especializados', desc: 'Planes de cuidado adaptados a tus necesidades' },
              { icon: 'bi-clock-history', title: 'Disponibilidad 24/7', desc: 'Siempre listos para atenderte en cualquier momento' },
              { icon: 'bi-people-fill', title: 'Equipo Certificado', desc: 'Profesionales altamente capacitados y certificados' }
            ].map((service, i) => (
              <div className="col-md-6 col-lg-3" key={i}>
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center p-4">
                    <i className={`bi ${service.icon} text-primary fs-1 mb-3`}></i>
                    <h5 className="card-title fw-bold">{service.title}</h5>
                    <p className="card-text text-muted">{service.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">Testimonios</h2>
            <p className="lead text-muted">Lo que dicen nuestros pacientes</p>
          </div>
          <div className="row g-4">
            {[
              { name: 'María G.', text: 'El cuidado que recibió mi madre fue excepcional. Gracias por su profesionalismo y calidez humana.' },
              { name: 'Carlos R.', text: 'La enfermera asignada a mi padre fue increíble. Su atención y dedicación marcaron una gran diferencia.' },
              { name: 'Ana L.', text: 'Servicio de primera calidad. Siempre puntuales y con una atención personalizada inigualable.' }
            ].map((testimonial, i) => (
              <div className="col-md-4" key={i}>
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="mb-3 text-warning">
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                    </div>
                    <p className="card-text fst-italic">"{testimonial.text}"</p>
                    <div className="d-flex align-items-center mt-3">
                      <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold" style={{ width: '40px', height: '40px' }}>
                        {testimonial.name.charAt(0)}
                      </div>
                      <div className="ms-3">
                        <h6 className="mb-0 fw-bold">{testimonial.name}</h6>
                        <small className="text-muted">Paciente</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-5 bg-light">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-5">
              <h2 className="display-5 fw-bold mb-4">Contacto</h2>
              <p className="lead mb-4">Estamos aquí para ayudarte. Contáctanos para cualquier consulta sobre nuestros servicios.</p>
              <div className="d-flex mb-3">
                <i className="bi bi-telephone-fill text-primary fs-4 me-3"></i>
                <div>
                  <h6 className="mb-0">Teléfono</h6>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="d-flex mb-3">
                <i className="bi bi-envelope-fill text-primary fs-4 me-3"></i>
                <div>
                  <h6 className="mb-0">Email</h6>
                  <p>contacto@enfermeracorazon.com</p>
                </div>
              </div>
              <div className="d-flex">
                <i className="bi bi-geo-alt-fill text-primary fs-4 me-3"></i>
                <div>
                  <h6 className="mb-0">Dirección</h6>
                  <p>Av. Salud 123, Ciudad Médica</p>
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <h4 className="mb-4">
                    <i className="bi bi-chat-dots text-primary me-2"></i>
                    ¿Tienes alguna pregunta?
                  </h4>
                  <p className="text-muted mb-4">Completa el formulario de solicitud de atención para que podamos ayudarte.</p>
                  <div className="text-center">
                    <button onClick={handleSolicitarAtencion} className="btn btn-primary btn-lg px-5">
                      <i className="bi bi-clipboard-plus me-2"></i>
                      {currentUser && currentUser.rol_id !== 4 ? 'Ver Solicitudes' : 'Ir al Formulario'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

// Componente ConoceMasPage
const ConoceMasPage = () => {
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold mb-4">Conoce Más Sobre Nosotros</h1>
            <p className="lead text-muted">Descubre nuestra misión, valores y equipo profesional</p>
          </div>

          <div className="card border-0 shadow-sm mb-5">
            <div className="card-body p-4">
              <h2 className="h3 fw-bold mb-3">
                <i className="bi bi-bullseye text-primary me-2"></i>
                Nuestra Misión
              </h2>
              <p className="lead">En Enfermera Corazón, nuestra misión es proporcionar cuidado de enfermería de alta calidad con un toque humano.</p>
              <p>Creemos que cada paciente merece atención personalizada y compasiva en la comodidad de su hogar. Nuestro equipo de profesionales altamente capacitados está comprometido con el bienestar de nuestros pacientes, ofreciendo no solo atención médica experta, sino también apoyo emocional y compañía.</p>
            </div>
          </div>

          <div className="text-center mt-5">
            <Link to="/solicita-atencion" className="btn btn-primary btn-lg px-4">
              <i className="bi bi-clipboard-plus me-2"></i>
              Solicitar Atención
            </Link>
            <Link to="/" className="btn btn-outline-primary btn-lg px-4 ms-3">
              <i className="bi bi-house me-2"></i>
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente SolicitaAtencionPage (versión simplificada)
const SolicitaAtencionPage = () => {
  const [formData, setFormData] = useState({
    nombre_contacto: '',
    telefono: '',
    email: '',
    nombre_paciente: '',
    edad_paciente: '',
    tipo_servicio: '',
    urgencia: 'Normal',
    description: '',
    termsAccepted: false
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.termsAccepted) {
      setError('Debes aceptar los términos y condiciones');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/solicitudes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre_contacto: formData.nombre_contacto,
          telefono: formData.telefono,
          email: formData.email,
          nombre_paciente: formData.nombre_paciente,
          edad_paciente: parseInt(formData.edad_paciente) || 0,
          tipo_servicio: formData.tipo_servicio,
          urgencia: formData.urgencia,
          description: formData.description
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({
          nombre_contacto: '',
          telefono: '',
          email: '',
          nombre_paciente: '',
          edad_paciente: '',
          tipo_servicio: '',
          urgencia: 'Normal',
          description: '',
          termsAccepted: false
        });
      } else {
        const data = await response.json();
        setError(data.error || 'Error al enviar la solicitud');
      }
    } catch (error) {
      setError('Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <h1 className="display-4 fw-bold mb-4 text-center">
            <i className="bi bi-clipboard-plus text-primary me-2"></i>
            Solicitar Atención
          </h1>

          {isSubmitted && (
            <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
              <i className="bi bi-check-circle-fill me-2"></i>
              ¡Solicitud enviada exitosamente!
              <button type="button" className="btn-close" onClick={() => setIsSubmitted(false)}></button>
            </div>
          )}

          {error && (
            <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
              <button type="button" className="btn-close" onClick={() => setError('')}></button>
            </div>
          )}

          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Nombre del Contacto *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nombre_contacto"
                      value={formData.nombre_contacto}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Teléfono *</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
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
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Edad del Paciente *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="edad_paciente"
                      value={formData.edad_paciente}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Tipo de Servicio *</label>
                    <select
                      className="form-select"
                      name="tipo_servicio"
                      value={formData.tipo_servicio}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccione...</option>
                      <option value="Cuidado Básico">Cuidado Básico</option>
                      <option value="Enfermería Especializada">Enfermería Especializada</option>
                      <option value="Terapia Física">Terapia Física</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Urgencia *</label>
                    <select
                      className="form-select"
                      name="urgencia"
                      value={formData.urgencia}
                      onChange={handleChange}
                      required
                    >
                      <option value="Normal">Normal</option>
                      <option value="Urgente">Urgente</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label">Descripción *</label>
                    <textarea
                      className="form-control"
                      name="description"
                      rows="4"
                      value={formData.description}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  <div className="col-12">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={handleChange}
                        required
                      />
                      <label className="form-check-label">
                        Acepto los términos y condiciones *
                      </label>
                    </div>
                  </div>

                  <div className="col-12 text-center mt-4">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg px-5"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Enviando...
                        </>
                      ) : (
                        'Enviar Solicitud'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="text-center mt-4">
            <Link to="/" className="btn btn-outline-primary">
              <i className="bi bi-house me-2"></i>
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente AdminSolicitudesPage
const AdminSolicitudesPage = () => {
  const { currentUser } = useAuth();
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchSolicitudes();
    }
  }, [currentUser]);

  const fetchSolicitudes = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/solicitudes');
      const data = await response.json();
      setSolicitudes(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning text-center">
          <h4>Acceso Restringido</h4>
          <p>Debes iniciar sesión para ver las solicitudes.</p>
          <Link to="/login" className="btn btn-primary mt-2">
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary"></div>
        <p className="mt-3">Cargando solicitudes...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="display-4 fw-bold mb-4">
        <i className="bi bi-list-check text-primary me-2"></i>
        {currentUser.rol_id === 1 ? 'Solicitudes de Atención' :
          currentUser.rol_id === 2 ? 'Mis Pacientes' :
            'Gestión de Solicitudes'}
      </h1>

      <div className="card shadow">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Contacto</th>
                  <th>Paciente</th>
                  <th>Servicio</th>
                  <th>Urgencia</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map(solicitud => (
                  <tr key={solicitud.id}>
                    <td>#{solicitud.id}</td>
                    <td>
                      <strong>{solicitud.nombre_contacto}</strong><br />
                      <small>{solicitud.telefono}</small>
                    </td>
                    <td>{solicitud.nombre_paciente}</td>
                    <td>{solicitud.tipo_servicio}</td>
                    <td>
                      <span className={`badge ${solicitud.urgencia === 'Urgente' ? 'bg-danger' : 'bg-success'}`}>
                        {solicitud.urgencia}
                      </span>
                    </td>
                    <td>{new Date(solicitud.fecha_creacion).toLocaleDateString()}</td>
                    <td>
                      <span className="badge bg-warning">Pendiente</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente principal App
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main>
            <Suspense fallback={
              <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            }>
              <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={<HomePage />} />
                <Route path="/conoce-mas" element={<ConoceMasPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                <Route path="/solicita-atencion" element={<SolicitaAtencionPage />} />
                <Route path="/admin-solicitudes" element={<AdminSolicitudesPage />} />

                {/* Rutas de autenticación */}
                <Route path="/login" element={<LoginWithContext />} />
                <Route path="/register" element={<Register />} />

                {/* Rutas protegidas por rol */}
                <Route path="/admin" element={
                  <ProtectedRoute requiredRole={1}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />

                <Route path="/enfermera" element={
                  <ProtectedRoute requiredRole={2}>
                    <EnfermeraDashboard />
                  </ProtectedRoute>
                } />

                <Route path="/recepcionista" element={
                  <ProtectedRoute requiredRole={3}>
                    <RecepcionistaDashboard />
                  </ProtectedRoute>
                } />

                {/* Redirección para rutas no encontradas */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;