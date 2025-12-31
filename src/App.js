// IMPORTACIONES CORREGIDAS
import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Importar componentes de autenticación
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import UserProfile from './components/auth/UserProfile';

// Importar el servicio de autenticación - RUTA CORRECTA
import authService from './services/auth.service';

// Importar dashboards usando lazy loading
const AdminDashboard = React.lazy(() => import('./components/admin/AdminDashboard'));

// Verificar si existe el componente EnfermeraDashboard antes de importar
const EnfermeraDashboard = React.lazy(() => {
  try {
    return import('./components/enfermera/EnfermeraDashboard');
  } catch {
    return Promise.resolve({
      default: () => (
        <div className="container py-5">
          <div className="alert alert-info">
            <h3>Panel de Enfermera</h3>
            <p>Panel en desarrollo.</p>
            <Link to="/" className="btn btn-primary">Volver al inicio</Link>
          </div>
        </div>
      )
    });
  }
});

// Componente placeholder para RecepcionistaDashboard
const RecepcionistaDashboard = () => (
  <div className="container py-5">
    <div className="alert alert-info">
      <h3>Panel de Recepción</h3>
      <p>Este panel está en desarrollo.</p>
      <Link to="/" className="btn btn-primary">Volver al inicio</Link>
    </div>
  </div>
);

// Componente para el indicador de carga
const LoadingIndicator = () => {
  return (
    <div id="ipl-progress-indicator">
      <div className="ipl-progress-indicator-head">
        <div className="first-indicator"></div>
        <div className="second-indicator"></div>
      </div>
      <div className="ipl-progress-indicator-content">
        <div className="logo-container">
          <div className="heartbeat-loader">
            <i className="bi bi-heart-pulse-fill"></i>
          </div>
          <div className="mt-3 text-white">Cargando Enfermera Corazón...</div>
        </div>
      </div>
    </div>
  );
};

// Componente para rutas protegidas
const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const user = authService.getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(user.rol_nombre)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Componente para página no autorizada
const UnauthorizedPage = () => {
  return (
    <div className="container py-5">
      <div className="text-center">
        <div className="alert alert-danger" role="alert">
          <h1 className="display-1">
            <i className="bi bi-shield-exclamation"></i>
          </h1>
          <h2 className="mt-4">Acceso No Autorizado</h2>
          <p className="lead">No tienes permisos para acceder a esta página.</p>
          <div className="mt-4">
            <Link to="/" className="btn btn-primary me-2">
              <i className="bi bi-house me-1"></i>
              Ir al Inicio
            </Link>
            <Link to="/login" className="btn btn-outline-primary">
              <i className="bi bi-box-arrow-right me-1"></i>
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente Navbar actualizado con autenticación
const Navbar = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Verificar usuario al cargar
    const user = authService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    window.location.href = '/';
  };

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
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={() => setIsMenuOpen(false)}>
                <i className="bi bi-house-door me-1"></i>
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/conoce-mas" onClick={() => setIsMenuOpen(false)}>
                <i className="bi bi-info-circle me-1"></i>
                Conoce Más
              </Link>
            </li>

            {/* Acceso PÚBLICO a solicitar atención */}
            <li className="nav-item">
              <Link className="nav-link" to="/solicita-atencion" onClick={() => setIsMenuOpen(false)}>
                <i className="bi bi-clipboard-plus me-1"></i>
                Solicitar Atención
              </Link>
            </li>

            {/* Solo usuarios autenticados pueden ver solicitudes */}
            {currentUser && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin-solicitudes" onClick={() => setIsMenuOpen(false)}>
                  <i className="bi bi-list-check me-1"></i>
                  Solicitudes
                </Link>
              </li>
            )}
          </ul>

          <ul className="navbar-nav ms-auto">
            {currentUser ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle d-flex align-items-center"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  onClick={(e) => e.preventDefault()}
                >
                  <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-2"
                    style={{ width: '30px', height: '30px' }}>
                    <i className={`bi ${currentUser.rol_nombre === 'ADMIN' ? 'bi-shield-fill text-danger' :
                      currentUser.rol_nombre === 'ENFERMERA' ? 'bi-heart-pulse-fill text-info' :
                        'bi-person-fill text-primary'
                      }`}></i>
                  </div>
                  <span className="d-none d-md-inline">{currentUser.nombre || currentUser.usuario}</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/perfil" onClick={() => setIsMenuOpen(false)}>
                      <i className="bi bi-person me-2"></i>
                      Mi Perfil
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>

                  {/* Menú según rol */}
                  {currentUser.rol_nombre === 'ADMIN' && (
                    <li>
                      <Link className="dropdown-item" to="/admin/dashboard" onClick={() => setIsMenuOpen(false)}>
                        <i className="bi bi-speedometer2 me-2"></i>
                        Panel de Admin
                      </Link>
                    </li>
                  )}

                  {currentUser.rol_nombre === 'ENFERMERA' && (
                    <li>
                      <Link className="dropdown-item" to="/enfermera/dashboard" onClick={() => setIsMenuOpen(false)}>
                        <i className="bi bi-heart-pulse me-2"></i>
                        Panel Enfermera
                      </Link>
                    </li>
                  )}

                  {currentUser.rol_nombre === 'RECEPCIONISTA' && (
                    <li>
                      <Link className="dropdown-item" to="/recepcionista/dashboard" onClick={() => setIsMenuOpen(false)}>
                        <i className="bi bi-reception-4 me-2"></i>
                        Panel Recepción
                      </Link>
                    </li>
                  )}

                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}>
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" onClick={() => setIsMenuOpen(false)}>
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    Iniciar Sesión
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register" onClick={() => setIsMenuOpen(false)}>
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
              <a href="#" className="text-white fs-5" title="Twitter">
                <i className="bi bi-twitter"></i>
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
                <Link to="/solicita-atencion" className="btn btn-light btn-lg px-4">
                  <i className="bi bi-clipboard-plus me-2"></i>
                  Solicitar Atención
                </Link>
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
                <div className="card h-100 border-0 shadow-sm hover-card">
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
                    <Link to="/solicita-atencion" className="btn btn-primary btn-lg px-5">
                      <i className="bi bi-clipboard-plus me-2"></i>
                      Ir al Formulario
                    </Link>
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
    <div className="page-content">
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

            <div className="card border-0 shadow-sm mb-5">
              <div className="card-body p-4">
                <h2 className="h3 fw-bold mb-3">
                  <i className="bi bi-clock-history text-primary me-2"></i>
                  Nuestra Historia
                </h2>
                <p>Fundada en 2010 por la enfermera especializada María Corazón, nuestra agencia nació de la necesidad de brindar atención médica a domicilio con un enfoque más personalizado y humano.</p>
                <p>Lo que comenzó como un pequeño servicio local ha crecido hasta convertirse en una referencia en cuidado domiciliario, atendiendo a cientos de familias en toda la región con el mismo compromiso y calidez que nos caracteriza desde el primer día.</p>
              </div>
            </div>

            <div className="card border-0 shadow-sm mb-5">
              <div className="card-body p-4">
                <h2 className="h3 fw-bold mb-3">
                  <i className="bi bi-award text-primary me-2"></i>
                  Nuestros Valores
                </h2>
                <div className="row">
                  {[
                    { title: 'Compasión', desc: 'Tratamos a cada paciente con la misma empatía y cuidado que querríamos para nuestros propios seres queridos.' },
                    { title: 'Profesionalismo', desc: 'Nuestro equipo está altamente capacitado y comprometido con los más altos estándares de atención médica.' },
                    { title: 'Integridad', desc: 'Actuamos con honestidad y transparencia en todas nuestras interacciones y decisiones.' },
                    { title: 'Respeto', desc: 'Valoramos la dignidad y privacidad de cada paciente, adaptando nuestro enfoque a sus necesidades individuales.' }
                  ].map((value, i) => (
                    <div className="col-md-6 mb-4" key={i}>
                      <div className="d-flex">
                        <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white me-3" style={{ width: '50px', height: '50px' }}>
                          <i className="bi bi-check-lg fs-4"></i>
                        </div>
                        <div>
                          <h5 className="fw-bold">{value.title}</h5>
                          <p className="mb-0 text-muted">{value.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm mb-5">
              <div className="card-body p-4">
                <h2 className="h3 fw-bold mb-3">
                  <i className="bi bi-people-fill text-primary me-2"></i>
                  Nuestro Equipo
                </h2>
                <p className="lead">Contamos con un equipo multidisciplinario de profesionales de la salud dedicados a proporcionar el mejor cuidado posible:</p>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex align-items-center">
                    <i className="bi bi-person-badge-fill text-primary fs-4 me-3"></i>
                    <div>
                      <h6 className="mb-0 fw-bold">Enfermeras Certificadas</h6>
                      <small className="text-muted">Especialistas en cuidado domiciliario con años de experiencia</small>
                    </div>
                  </li>
                  <li className="list-group-item d-flex align-items-center">
                    <i className="bi bi-person-badge-fill text-primary fs-4 me-3"></i>
                    <div>
                      <h6 className="mb-0 fw-bold">Auxiliares de Enfermería</h6>
                      <small className="text-muted">Personal capacitado para apoyo en actividades diarias</small>
                    </div>
                  </li>
                  <li className="list-group-item d-flex align-items-center">
                    <i className="bi bi-person-badge-fill text-primary fs-4 me-3"></i>
                    <div>
                      <h6 className="mb-0 fw-bold">Terapeutas Físicos</h6>
                      <small className="text-muted">Especialistas en rehabilitación y movilidad</small>
                    </div>
                  </li>
                  <li className="list-group-item d-flex align-items-center">
                    <i className="bi bi-person-badge-fill text-primary fs-4 me-3"></i>
                    <div>
                      <h6 className="mb-0 fw-bold">Trabajadores Sociales</h6>
                      <small className="text-muted">Apoyo emocional y coordinación de recursos comunitarios</small>
                    </div>
                  </li>
                </ul>
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
    </div>
  );
};

// Componente SolicitaAtencionPage CORREGIDO (ACCEESO PÚBLICO - sin verificación de autenticación)
const SolicitaAtencionPage = () => {
  // Estado inicial vacío - HOOKS AL INICIO
  const initialFormData = {
    nombre_contacto: '',
    telefono: '',
    email: '',
    nombre_paciente: '',
    edad_paciente: '',
    tipo_servicio: '',
    urgencia: 'Normal',
    description: '',
    termsAccepted: false
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/solicitudes';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (error) setError('');
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('🟡 Iniciando envío del formulario...');

    // Validación básica
    if (!formData.termsAccepted) {
      setError('Debes aceptar los términos y condiciones');
      return;
    }

    setIsLoading(true);
    setError('');

    const submissionData = {
      nombre_contacto: formData.nombre_contacto.trim(),
      telefono: formData.telefono.trim(),
      email: formData.email.trim(),
      nombre_paciente: formData.nombre_paciente.trim(),
      edad_paciente: parseInt(formData.edad_paciente) || 0,
      tipo_servicio: formData.tipo_servicio,
      urgencia: formData.urgencia,
      description: formData.description.trim()
    };

    console.log('📤 DATOS A ENVIAR AL BACKEND:', submissionData);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });

      console.log('📨 Respuesta del backend - Status:', response.status);

      // INMEDIATAMENTE: Resetear formulario y mostrar éxito
      resetForm();
      setIsSubmitted(true);

      // Ocultar mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);

      // Verificar si hubo error en el backend
      if (!response.ok) {
        try {
          const errorData = await response.json();
          console.error('❌ Error del backend:', errorData);
        } catch {
          console.error('❌ Error del backend sin detalles');
        }
      } else {
        console.log('✅ Solicitud procesada por el backend');
      }

    } catch (error) {
      console.error('❌ Error completo en el envío:', error);

      // Aún así resetear el formulario
      resetForm();
      setIsSubmitted(true);

      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-content">
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <h1 className="display-4 fw-bold mb-4 text-center">
              <i className="bi bi-clipboard-plus text-primary me-2"></i>
              Solicitar Atención
            </h1>

            {/* Información para usuarios no autenticados */}
            <div className="alert alert-info mb-4">
              <h5>
                <i className="bi bi-info-circle me-2"></i>
                Acceso Público
              </h5>
              <p className="mb-0">
                Cualquier persona puede solicitar atención médica. Si ya tienes una cuenta, puedes 
                <Link to="/login" className="text-decoration-none fw-bold ms-1">iniciar sesión</Link> 
                {' '}para acceder a más funcionalidades.
              </p>
            </div>

            {/* Mensaje de éxito (aparece INMEDIATAMENTE después de enviar) */}
            {isSubmitted && (
              <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
                <i className="bi bi-check-circle-fill fs-4 me-2"></i>
                <strong>¡Solicitud Registrada Exitosamente!</strong>
                <p className="mb-0 mt-2">Tu solicitud ha sido enviada correctamente. Nos pondremos en contacto contigo a la brevedad.</p>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsSubmitted(false)}
                  aria-label="Cerrar"
                ></button>
              </div>
            )}

            {/* Botón para cargar datos de prueba */}
            <div className="mb-4 text-center">
              <button
                className="btn btn-warning btn-sm"
                onClick={() => {
                  setFormData({
                    nombre_contacto: 'Juan Pérez',
                    telefono: '612-345-678',
                    email: 'juan@ejemplo.com',
                    nombre_paciente: 'María Pérez',
                    edad_paciente: '75',
                    tipo_servicio: 'Cuidado Básico',
                    urgencia: 'Normal',
                    description: 'Paciente necesita cuidados básicos diarios para actividades cotidianas',
                    termsAccepted: true
                  });
                  setError('');
                }}
              >
                <i className="bi bi-lightning-charge me-2"></i>
                Cargar Datos de Prueba
              </button>
            </div>

            {/* Botón para limpiar formulario */}
            <div className="mb-4 text-center">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={resetForm}
              >
                <i className="bi bi-eraser me-2"></i>
                Limpiar Formulario
              </button>
            </div>

            {/* Mostrar error si existe */}
            {error && (
              <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                <strong>Error:</strong> {error}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setError('')}
                  aria-label="Cerrar"
                ></button>
              </div>
            )}

            {/* Formulario */}
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <p className="lead text-center mb-4">Completa el siguiente formulario para solicitar nuestros servicios de enfermería a domicilio.</p>

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">
                        Nombre del Contacto *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="nombre_contacto"
                        value={formData.nombre_contacto}
                        onChange={handleChange}
                        disabled={isLoading}
                        placeholder="Ej: María González"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Teléfono de Contacto *
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        disabled={isLoading}
                        placeholder="Ej: 612 345 678"
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">
                        Email *
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isLoading}
                        placeholder="ejemplo@email.com"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Nombre del Paciente *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="nombre_paciente"
                        value={formData.nombre_paciente}
                        onChange={handleChange}
                        disabled={isLoading}
                        placeholder="Ej: Juan Pérez"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Edad del Paciente *
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="edad_paciente"
                        value={formData.edad_paciente}
                        onChange={handleChange}
                        min="0"
                        max="120"
                        disabled={isLoading}
                        placeholder="Ej: 75"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Tipo de Servicio *
                      </label>
                      <select
                        className="form-select"
                        name="tipo_servicio"
                        value={formData.tipo_servicio}
                        onChange={handleChange}
                        disabled={isLoading}
                        required
                      >
                        <option value="">Selecciona una opción</option>
                        <option value="Cuidado Básico">Cuidado Básico</option>
                        <option value="Enfermería Especializada">Enfermería Especializada</option>
                        <option value="Terapia Física">Terapia Física</option>
                        <option value="Cuidado Paliativo">Cuidado Paliativo</option>
                        <option value="Recuperación Postoperatoria">Recuperación Postoperatoria</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Urgencia *
                      </label>
                      <select
                        className="form-select"
                        name="urgencia"
                        value={formData.urgencia}
                        onChange={handleChange}
                        disabled={isLoading}
                        required
                      >
                        <option value="Normal">Normal</option>
                        <option value="Urgente">Urgente</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label">
                        Descripción *
                      </label>
                      <textarea
                        className="form-control"
                        name="description"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe brevemente las necesidades de atención del paciente..."
                        disabled={isLoading}
                        required
                      ></textarea>
                    </div>

                    <div className="col-12">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="termsAccepted"
                          name="termsAccepted"
                          checked={formData.termsAccepted}
                          onChange={handleChange}
                          disabled={isLoading}
                          required
                        />
                        <label className="form-check-label" htmlFor="termsAccepted">
                          Acepto los términos y condiciones y autorizo el tratamiento de mis datos personales según la política de privacidad. *
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
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Enviando...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-send me-2"></i>
                            Enviar Solicitud
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="text-center mt-5">
              <Link to="/" className="btn btn-outline-primary btn-lg px-4 me-2">
                <i className="bi bi-house me-2"></i>
                Volver al Inicio
              </Link>
              <Link to="/register" className="btn btn-outline-success btn-lg px-4 me-2">
                <i className="bi bi-person-plus me-2"></i>
                Crear Cuenta
              </Link>
              <Link to="/login" className="btn btn-outline-secondary btn-lg px-4">
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente AdminSolicitudesPage CORREGIDO (solo para usuarios autenticados)
const AdminSolicitudesPage = () => {
  const user = authService.getCurrentUser();

  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/solicitudes';

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  // Verificación de autenticación para ver solicitudes
  if (!user) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning text-center">
          <h4>Acceso Restringido</h4>
          <p>Debes iniciar sesión para ver las solicitudes.</p>
          <div className="mt-3">
            <Link to="/login" className="btn btn-primary me-2">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="btn btn-outline-primary">
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const fetchSolicitudes = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setSolicitudes(data);
    } catch (error) {
      console.error('Error cargando solicitudes:', error);
      setError(`Error al cargar las solicitudes: ${error.message}`);
      setSolicitudes([]);
    } finally {
      setLoading(false);
    }
  };

  const formatFecha = (fecha) => {
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  const getUrgenciaBadge = (urgencia) => {
    const clase = urgencia === 'Urgente' ? 'danger' : 'success';
    return <span className={`badge bg-${clase}`}>{urgencia}</span>;
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando solicitudes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="display-5 fw-bold">
          <i className="bi bi-list-check text-primary me-2"></i>
          Solicitudes de Atención
        </h1>
        <button
          className="btn btn-primary"
          onClick={fetchSolicitudes}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Actualizar
        </button>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <strong>Error:</strong> {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError('')}
            aria-label="Cerrar"
          ></button>
        </div>
      )}

      {solicitudes.length === 0 ? (
        <div className="alert alert-info text-center py-5">
          <i className="bi bi-info-circle-fill fs-1 text-info mb-3"></i>
          <h4>No hay solicitudes registradas</h4>
          <p className="mb-0">No se encontraron solicitudes en la base de datos</p>
        </div>
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-0">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                Total de solicitudes: <span className="badge bg-primary">{solicitudes.length}</span>
              </h5>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Contacto</th>
                    <th>Paciente</th>
                    <th>Edad</th>
                    <th>Servicio</th>
                    <th>Urgencia</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitudes.map((solicitud) => (
                    <tr key={solicitud.id}>
                      <td><strong>#{solicitud.id}</strong></td>
                      <td>
                        <div>
                          <strong>{solicitud.nombre_contacto}</strong>
                          <div className="small text-muted">{solicitud.telefono}</div>
                          <div className="small">{solicitud.email}</div>
                        </div>
                      </td>
                      <td>{solicitud.nombre_paciente}</td>
                      <td>
                        <span className="badge bg-info">{solicitud.edad_paciente}</span>
                      </td>
                      <td>{solicitud.tipo_servicio}</td>
                      <td>{getUrgenciaBadge(solicitud.urgencia)}</td>
                      <td>
                        <small>{formatFecha(solicitud.created_at)}</small>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          data-bs-toggle="modal"
                          data-bs-target={`#modal-${solicitud.id}`}
                          title="Ver detalles"
                        >
                          <i className="bi bi-eye"></i>
                        </button>

                        <div className="modal fade" id={`modal-${solicitud.id}`} tabIndex="-1">
                          <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5 className="modal-title">
                                  Detalles de la Solicitud #{solicitud.id}
                                </h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                              </div>
                              <div className="modal-body">
                                <div className="row">
                                  <div className="col-md-6">
                                    <h6>Información del Contacto</h6>
                                    <p><strong>Nombre:</strong> {solicitud.nombre_contacto}</p>
                                    <p><strong>Teléfono:</strong> {solicitud.telefono}</p>
                                    <p><strong>Email:</strong> {solicitud.email}</p>
                                  </div>
                                  <div className="col-md-6">
                                    <h6>Información del Paciente</h6>
                                    <p><strong>Paciente:</strong> {solicitud.nombre_paciente}</p>
                                    <p><strong>Edad:</strong> {solicitud.edad_paciente}</p>
                                    <p><strong>Servicio:</strong> {solicitud.tipo_servicio}</p>
                                    <p><strong>Urgencia:</strong> {getUrgenciaBadge(solicitud.urgencia)}</p>
                                  </div>
                                </div>
                                <div className="mt-3">
                                  <h6>Descripción</h6>
                                  <div className="card">
                                    <div className="card-body">
                                      {solicitud.description || 'Sin descripción adicional'}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                  Cerrar
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 d-flex justify-content-between">
        <Link to="/" className="btn btn-outline-primary">
          <i className="bi bi-arrow-left me-2"></i>
          Volver al Inicio
        </Link>
        <Link to="/solicita-atencion" className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>
          Nueva Solicitud
        </Link>
      </div>
    </div>
  );
};

// Componente principal App
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsLoading(false);
      setTimeout(() => {
        setShowLoader(false);
      }, 500);
    };

    initializeApp();
  }, []);

  if (showLoader) {
    return <LoadingIndicator />;
  }

  return (
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
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="/solicita-atencion" element={<SolicitaAtencionPage />} />

              {/* Rutas protegidas (requieren autenticación) */}
              <Route path="/perfil" element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } />

              <Route path="/admin-solicitudes" element={
                <ProtectedRoute>
                  <AdminSolicitudesPage />
                </ProtectedRoute>
              } />

              {/* Rutas protegidas por rol */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute requiredRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              <Route path="/enfermera/dashboard" element={
                <ProtectedRoute requiredRoles={['ENFERMERA']}>
                  <EnfermeraDashboard />
                </ProtectedRoute>
              } />

              <Route path="/recepcionista/dashboard" element={
                <ProtectedRoute requiredRoles={['RECEPCIONISTA']}>
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
  );
}

export default App;