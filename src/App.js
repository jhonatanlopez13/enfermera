// // IMPORTACIONES CORREGIDAS
// import React, { useState, useEffect, Suspense } from 'react';
// import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.css';

// // Importar componentes de autenticación
// import Login from './components/auth/Login';
// import Register from './components/auth/Register';
// import UserProfile from './components/auth/UserProfile';

// // Importar el servicio de autenticación - RUTA CORRECTA
// import authService from './services/auth.service';

// // Importar dashboards usando lazy loading
// const AdminDashboard = React.lazy(() => import('./components/admin/AdminDashboard'));

// // Verificar si existe el componente EnfermeraDashboard antes de importar
// const EnfermeraDashboard = React.lazy(() => {
//   try {
//     return import('./components/enfermera/EnfermeraDashboard');
//   } catch {
//     return Promise.resolve({
//       default: () => (
//         <div className="container py-5">
//           <div className="alert alert-info">
//             <h3>Panel de Enfermera</h3>
//             <p>Panel en desarrollo.</p>
//             <Link to="/" className="btn btn-primary">Volver al inicio</Link>
//           </div>
//         </div>
//       )
//     });
//   }
// });

// // Componente placeholder para RecepcionistaDashboard
// const RecepcionistaDashboard = () => (
//   <div className="container py-5">
//     <div className="alert alert-info">
//       <h3>Panel de Recepción</h3>
//       <p>Este panel está en desarrollo.</p>
//       <Link to="/" className="btn btn-primary">Volver al inicio</Link>
//     </div>
//   </div>
// );

// // Componente para el indicador de carga
// const LoadingIndicator = () => {
//   return (
//     <div id="ipl-progress-indicator">
//       <div className="ipl-progress-indicator-head">
//         <div className="first-indicator"></div>
//         <div className="second-indicator"></div>
//       </div>
//       <div className="ipl-progress-indicator-content">
//         <div className="logo-container">
//           <div className="heartbeat-loader">
//             <i className="bi bi-heart-pulse-fill"></i>
//           </div>
//           <div className="mt-3 text-white">Cargando Enfermera Corazón...</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Componente para rutas protegidas
// const ProtectedRoute = ({ children, requiredRoles = [] }) => {
//   const user = authService.getCurrentUser();

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   if (requiredRoles.length > 0 && !requiredRoles.includes(user.rol_nombre)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return children;
// };

// // Componente para página no autorizada
// const UnauthorizedPage = () => {
//   return (
//     <div className="container py-5">
//       <div className="text-center">
//         <div className="alert alert-danger" role="alert">
//           <h1 className="display-1">
//             <i className="bi bi-shield-exclamation"></i>
//           </h1>
//           <h2 className="mt-4">Acceso No Autorizado</h2>
//           <p className="lead">No tienes permisos para acceder a esta página.</p>
//           <div className="mt-4">
//             <Link to="/" className="btn btn-primary me-2">
//               <i className="bi bi-house me-1"></i>
//               Ir al Inicio
//             </Link>
//             <Link to="/login" className="btn btn-outline-primary">
//               <i className="bi bi-box-arrow-right me-1"></i>
//               Iniciar Sesión
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Componente Navbar actualizado con autenticación
// const Navbar = () => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   useEffect(() => {
//     // Verificar usuario al cargar
//     const user = authService.getCurrentUser();
//     setCurrentUser(user);
//   }, []);

//   const handleLogout = () => {
//     authService.logout();
//     setCurrentUser(null);
//     window.location.href = '/';
//   };

//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow">
//       <div className="container">
//         <Link className="navbar-brand d-flex align-items-center" to="/">
//           <i className="bi bi-heart-pulse-fill me-2 fs-4"></i>
//           <span className="fw-bold">Enfermera Corazón</span>
//         </Link>
//         <button
//           className="navbar-toggler"
//           type="button"
//           onClick={() => setIsMenuOpen(!isMenuOpen)}
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>
//         <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
//           <ul className="navbar-nav me-auto">
//             <li className="nav-item">
//               <Link className="nav-link" to="/" onClick={() => setIsMenuOpen(false)}>
//                 <i className="bi bi-house-door me-1"></i>
//                 Inicio
//               </Link>
//             </li>
//             <li className="nav-item">
//               <Link className="nav-link" to="/conoce-mas" onClick={() => setIsMenuOpen(false)}>
//                 <i className="bi bi-info-circle me-1"></i>
//                 Conoce Más
//               </Link>
//             </li>

//             {/* Acceso PÚBLICO a solicitar atención */}
//             <li className="nav-item">
//               <Link className="nav-link" to="/solicita-atencion" onClick={() => setIsMenuOpen(false)}>
//                 <i className="bi bi-clipboard-plus me-1"></i>
//                 Solicitar Atención
//               </Link>
//             </li>

//             {/* Solo usuarios autenticados pueden ver solicitudes */}
//             {currentUser && (
//               <li className="nav-item">
//                 <Link className="nav-link" to="/admin-solicitudes" onClick={() => setIsMenuOpen(false)}>
//                   <i className="bi bi-list-check me-1"></i>
//                   Solicitudes
//                 </Link>
//               </li>
//             )}
//           </ul>

//           <ul className="navbar-nav ms-auto">
//             {currentUser ? (
//               <li className="nav-item dropdown">
//                 <a
//                   className="nav-link dropdown-toggle d-flex align-items-center"
//                   href="#"
//                   role="button"
//                   data-bs-toggle="dropdown"
//                   onClick={(e) => e.preventDefault()}
//                 >
//                   <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-2"
//                     style={{ width: '30px', height: '30px' }}>
//                     <i className={`bi ${currentUser.rol_nombre === 'ADMIN' ? 'bi-shield-fill text-danger' :
//                       currentUser.rol_nombre === 'ENFERMERA' ? 'bi-heart-pulse-fill text-info' :
//                         'bi-person-fill text-primary'
//                       }`}></i>
//                   </div>
//                   <span className="d-none d-md-inline">{currentUser.nombre || currentUser.usuario}</span>
//                 </a>
//                 <ul className="dropdown-menu dropdown-menu-end">
//                   <li>
//                     <Link className="dropdown-item" to="/perfil" onClick={() => setIsMenuOpen(false)}>
//                       <i className="bi bi-person me-2"></i>
//                       Mi Perfil
//                     </Link>
//                   </li>
//                   <li><hr className="dropdown-divider" /></li>

//                   {/* Menú según rol */}
//                   {currentUser.rol_nombre === 'ADMIN' && (
//                     <li>
//                       <Link className="dropdown-item" to="/admin/dashboard" onClick={() => setIsMenuOpen(false)}>
//                         <i className="bi bi-speedometer2 me-2"></i>
//                         Panel de Admin
//                       </Link>
//                     </li>
//                   )}

//                   {currentUser.rol_nombre === 'ENFERMERA' && (
//                     <li>
//                       <Link className="dropdown-item" to="/enfermera/dashboard" onClick={() => setIsMenuOpen(false)}>
//                         <i className="bi bi-heart-pulse me-2"></i>
//                         Panel Enfermera
//                       </Link>
//                     </li>
//                   )}

//                   {currentUser.rol_nombre === 'RECEPCIONISTA' && (
//                     <li>
//                       <Link className="dropdown-item" to="/recepcionista/dashboard" onClick={() => setIsMenuOpen(false)}>
//                         <i className="bi bi-reception-4 me-2"></i>
//                         Panel Recepción
//                       </Link>
//                     </li>
//                   )}

//                   <li><hr className="dropdown-divider" /></li>
//                   <li>
//                     <button className="dropdown-item text-danger" onClick={() => {
//                       handleLogout();
//                       setIsMenuOpen(false);
//                     }}>
//                       <i className="bi bi-box-arrow-right me-2"></i>
//                       Cerrar Sesión
//                     </button>
//                   </li>
//                 </ul>
//               </li>
//             ) : (
//               <>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/login" onClick={() => setIsMenuOpen(false)}>
//                     <i className="bi bi-box-arrow-in-right me-1"></i>
//                     Iniciar Sesión
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/register" onClick={() => setIsMenuOpen(false)}>
//                     <i className="bi bi-person-plus me-1"></i>
//                     Registrarse
//                   </Link>
//                 </li>
//               </>
//             )}
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

// // Componente Footer
// const Footer = () => {
//   return (
//     <footer className="bg-dark text-white py-4 mt-5">
//       <div className="container">
//         <div className="row align-items-center">
//           <div className="col-md-6">
//             <h5 className="mb-3">
//               <i className="bi bi-heart-pulse-fill text-primary me-2"></i>
//               Enfermera Corazón
//             </h5>
//             <p className="mb-0 text-muted">Cuidado profesional con corazón humano</p>
//             <small className="text-muted">© {new Date().getFullYear()} Todos los derechos reservados</small>
//           </div>
//           <div className="col-md-6 text-md-end">
//             <div className="d-flex justify-content-md-end gap-3 mb-3">
//               <a href="#" className="text-white fs-5" title="Facebook">
//                 <i className="bi bi-facebook"></i>
//               </a>
//               <a href="#" className="text-white fs-5" title="Instagram">
//                 <i className="bi bi-instagram"></i>
//               </a>
//               <a href="#" className="text-white fs-5" title="Twitter">
//                 <i className="bi bi-twitter"></i>
//               </a>
//               <a href="#" className="text-white fs-5" title="WhatsApp">
//                 <i className="bi bi-whatsapp"></i>
//               </a>
//             </div>
//             <p className="mb-0 text-muted">
//               <i className="bi bi-geo-alt me-1"></i>
//               Av. Salud 123, Ciudad Médica
//             </p>
//             <p className="mb-0 text-muted">
//               <i className="bi bi-telephone me-1"></i>
//               +1 (555) 123-4567
//             </p>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// // Componente HomePage
// const HomePage = () => {
//   return (
//     <>
//       {/* Hero Section */}
//       <header className="hero-section text-white py-5">
//         <div className="container py-5">
//           <div className="row align-items-center">
//             <div className="col-lg-6">
//               <h1 className="display-4 fw-bold mb-4">Cuidado Profesional a Domicilio</h1>
//               <p className="lead mb-4">Enfermería especializada con el calor de un cuidado humano. Atención 24/7 para tus seres queridos.</p>
//               <div className="d-flex flex-column flex-md-row gap-3">
//                 <Link to="/solicita-atencion" className="btn btn-light btn-lg px-4">
//                   <i className="bi bi-clipboard-plus me-2"></i>
//                   Solicitar Atención
//                 </Link>
//                 <Link to="/conoce-mas" className="btn btn-outline-light btn-lg px-4">
//                   <i className="bi bi-info-circle me-2"></i>
//                   Conocer Más
//                 </Link>
//               </div>
//             </div>
//             <div className="col-lg-6 text-center mt-4 mt-lg-0">
//               <img
//                 src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80"
//                 className="img-fluid rounded shadow-lg"
//                 alt="Enfermera profesional cuidando paciente"
//               />
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Services Section */}
//       <section id="services" className="py-5 bg-light">
//         <div className="container">
//           <div className="text-center mb-5">
//             <h2 className="display-5 fw-bold">Nuestros Servicios</h2>
//             <p className="lead text-muted">Atención integral para todas tus necesidades de salud</p>
//           </div>
//           <div className="row g-4">
//             {[
//               { icon: 'bi-house-heart-fill', title: 'Cuidado a Domicilio', desc: 'Atención personalizada en la comodidad de tu hogar' },
//               { icon: 'bi-calendar-heart', title: 'Programas Especializados', desc: 'Planes de cuidado adaptados a tus necesidades' },
//               { icon: 'bi-clock-history', title: 'Disponibilidad 24/7', desc: 'Siempre listos para atenderte en cualquier momento' },
//               { icon: 'bi-people-fill', title: 'Equipo Certificado', desc: 'Profesionales altamente capacitados y certificados' }
//             ].map((service, i) => (
//               <div className="col-md-6 col-lg-3" key={i}>
//                 <div className="card h-100 border-0 shadow-sm hover-card">
//                   <div className="card-body text-center p-4">
//                     <i className={`bi ${service.icon} text-primary fs-1 mb-3`}></i>
//                     <h5 className="card-title fw-bold">{service.title}</h5>
//                     <p className="card-text text-muted">{service.desc}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Testimonials Section */}
//       <section id="testimonials" className="py-5">
//         <div className="container">
//           <div className="text-center mb-5">
//             <h2 className="display-5 fw-bold">Testimonios</h2>
//             <p className="lead text-muted">Lo que dicen nuestros pacientes</p>
//           </div>
//           <div className="row g-4">
//             {[
//               { name: 'María G.', text: 'El cuidado que recibió mi madre fue excepcional. Gracias por su profesionalismo y calidez humana.' },
//               { name: 'Carlos R.', text: 'La enfermera asignada a mi padre fue increíble. Su atención y dedicación marcaron una gran diferencia.' },
//               { name: 'Ana L.', text: 'Servicio de primera calidad. Siempre puntuales y con una atención personalizada inigualable.' }
//             ].map((testimonial, i) => (
//               <div className="col-md-4" key={i}>
//                 <div className="card h-100 border-0 shadow-sm">
//                   <div className="card-body p-4">
//                     <div className="mb-3 text-warning">
//                       <i className="bi bi-star-fill"></i>
//                       <i className="bi bi-star-fill"></i>
//                       <i className="bi bi-star-fill"></i>
//                       <i className="bi bi-star-fill"></i>
//                       <i className="bi bi-star-fill"></i>
//                     </div>
//                     <p className="card-text fst-italic">"{testimonial.text}"</p>
//                     <div className="d-flex align-items-center mt-3">
//                       <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold" style={{ width: '40px', height: '40px' }}>
//                         {testimonial.name.charAt(0)}
//                       </div>
//                       <div className="ms-3">
//                         <h6 className="mb-0 fw-bold">{testimonial.name}</h6>
//                         <small className="text-muted">Paciente</small>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Contact Section */}
//       <section id="contact" className="py-5 bg-light">
//         <div className="container">
//           <div className="row g-5">
//             <div className="col-lg-5">
//               <h2 className="display-5 fw-bold mb-4">Contacto</h2>
//               <p className="lead mb-4">Estamos aquí para ayudarte. Contáctanos para cualquier consulta sobre nuestros servicios.</p>
//               <div className="d-flex mb-3">
//                 <i className="bi bi-telephone-fill text-primary fs-4 me-3"></i>
//                 <div>
//                   <h6 className="mb-0">Teléfono</h6>
//                   <p>+1 (555) 123-4567</p>
//                 </div>
//               </div>
//               <div className="d-flex mb-3">
//                 <i className="bi bi-envelope-fill text-primary fs-4 me-3"></i>
//                 <div>
//                   <h6 className="mb-0">Email</h6>
//                   <p>contacto@enfermeracorazon.com</p>
//                 </div>
//               </div>
//               <div className="d-flex">
//                 <i className="bi bi-geo-alt-fill text-primary fs-4 me-3"></i>
//                 <div>
//                   <h6 className="mb-0">Dirección</h6>
//                   <p>Av. Salud 123, Ciudad Médica</p>
//                 </div>
//               </div>
//             </div>
//             <div className="col-lg-7">
//               <div className="card border-0 shadow-sm">
//                 <div className="card-body p-4">
//                   <h4 className="mb-4">
//                     <i className="bi bi-chat-dots text-primary me-2"></i>
//                     ¿Tienes alguna pregunta?
//                   </h4>
//                   <p className="text-muted mb-4">Completa el formulario de solicitud de atención para que podamos ayudarte.</p>
//                   <div className="text-center">
//                     <Link to="/solicita-atencion" className="btn btn-primary btn-lg px-5">
//                       <i className="bi bi-clipboard-plus me-2"></i>
//                       Ir al Formulario
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// // Componente ConoceMasPage
// const ConoceMasPage = () => {
//   return (
//     <div className="page-content">
//       <div className="container py-5">
//         <div className="row">
//           <div className="col-lg-8 mx-auto">
//             <div className="text-center mb-5">
//               <h1 className="display-4 fw-bold mb-4">Conoce Más Sobre Nosotros</h1>
//               <p className="lead text-muted">Descubre nuestra misión, valores y equipo profesional</p>
//             </div>

//             <div className="card border-0 shadow-sm mb-5">
//               <div className="card-body p-4">
//                 <h2 className="h3 fw-bold mb-3">
//                   <i className="bi bi-bullseye text-primary me-2"></i>
//                   Nuestra Misión
//                 </h2>
//                 <p className="lead">En Enfermera Corazón, nuestra misión es proporcionar cuidado de enfermería de alta calidad con un toque humano.</p>
//                 <p>Creemos que cada paciente merece atención personalizada y compasiva en la comodidad de su hogar. Nuestro equipo de profesionales altamente capacitados está comprometido con el bienestar de nuestros pacientes, ofreciendo no solo atención médica experta, sino también apoyo emocional y compañía.</p>
//               </div>
//             </div>

//             <div className="card border-0 shadow-sm mb-5">
//               <div className="card-body p-4">
//                 <h2 className="h3 fw-bold mb-3">
//                   <i className="bi bi-clock-history text-primary me-2"></i>
//                   Nuestra Historia
//                 </h2>
//                 <p>Fundada en 2010 por la enfermera especializada María Corazón, nuestra agencia nació de la necesidad de brindar atención médica a domicilio con un enfoque más personalizado y humano.</p>
//                 <p>Lo que comenzó como un pequeño servicio local ha crecido hasta convertirse en una referencia en cuidado domiciliario, atendiendo a cientos de familias en toda la región con el mismo compromiso y calidez que nos caracteriza desde el primer día.</p>
//               </div>
//             </div>

//             <div className="card border-0 shadow-sm mb-5">
//               <div className="card-body p-4">
//                 <h2 className="h3 fw-bold mb-3">
//                   <i className="bi bi-award text-primary me-2"></i>
//                   Nuestros Valores
//                 </h2>
//                 <div className="row">
//                   {[
//                     { title: 'Compasión', desc: 'Tratamos a cada paciente con la misma empatía y cuidado que querríamos para nuestros propios seres queridos.' },
//                     { title: 'Profesionalismo', desc: 'Nuestro equipo está altamente capacitado y comprometido con los más altos estándares de atención médica.' },
//                     { title: 'Integridad', desc: 'Actuamos con honestidad y transparencia en todas nuestras interacciones y decisiones.' },
//                     { title: 'Respeto', desc: 'Valoramos la dignidad y privacidad de cada paciente, adaptando nuestro enfoque a sus necesidades individuales.' }
//                   ].map((value, i) => (
//                     <div className="col-md-6 mb-4" key={i}>
//                       <div className="d-flex">
//                         <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white me-3" style={{ width: '50px', height: '50px' }}>
//                           <i className="bi bi-check-lg fs-4"></i>
//                         </div>
//                         <div>
//                           <h5 className="fw-bold">{value.title}</h5>
//                           <p className="mb-0 text-muted">{value.desc}</p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className="card border-0 shadow-sm mb-5">
//               <div className="card-body p-4">
//                 <h2 className="h3 fw-bold mb-3">
//                   <i className="bi bi-people-fill text-primary me-2"></i>
//                   Nuestro Equipo
//                 </h2>
//                 <p className="lead">Contamos con un equipo multidisciplinario de profesionales de la salud dedicados a proporcionar el mejor cuidado posible:</p>
//                 <ul className="list-group list-group-flush">
//                   <li className="list-group-item d-flex align-items-center">
//                     <i className="bi bi-person-badge-fill text-primary fs-4 me-3"></i>
//                     <div>
//                       <h6 className="mb-0 fw-bold">Enfermeras Certificadas</h6>
//                       <small className="text-muted">Especialistas en cuidado domiciliario con años de experiencia</small>
//                     </div>
//                   </li>
//                   <li className="list-group-item d-flex align-items-center">
//                     <i className="bi bi-person-badge-fill text-primary fs-4 me-3"></i>
//                     <div>
//                       <h6 className="mb-0 fw-bold">Auxiliares de Enfermería</h6>
//                       <small className="text-muted">Personal capacitado para apoyo en actividades diarias</small>
//                     </div>
//                   </li>
//                   <li className="list-group-item d-flex align-items-center">
//                     <i className="bi bi-person-badge-fill text-primary fs-4 me-3"></i>
//                     <div>
//                       <h6 className="mb-0 fw-bold">Terapeutas Físicos</h6>
//                       <small className="text-muted">Especialistas en rehabilitación y movilidad</small>
//                     </div>
//                   </li>
//                   <li className="list-group-item d-flex align-items-center">
//                     <i className="bi bi-person-badge-fill text-primary fs-4 me-3"></i>
//                     <div>
//                       <h6 className="mb-0 fw-bold">Trabajadores Sociales</h6>
//                       <small className="text-muted">Apoyo emocional y coordinación de recursos comunitarios</small>
//                     </div>
//                   </li>
//                 </ul>
//               </div>
//             </div>

//             <div className="text-center mt-5">
//               <Link to="/solicita-atencion" className="btn btn-primary btn-lg px-4">
//                 <i className="bi bi-clipboard-plus me-2"></i>
//                 Solicitar Atención
//               </Link>
//               <Link to="/" className="btn btn-outline-primary btn-lg px-4 ms-3">
//                 <i className="bi bi-house me-2"></i>
//                 Volver al Inicio
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Componente para notificación flotante
// const NotificationBanner = ({ notification, onClose }) => {
//   if (!notification.show) return null;

//   const bgColors = {
//     success: 'bg-success',
//     error: 'bg-danger',
//     warning: 'bg-warning',
//     info: 'bg-info'
//   };

//   const textColors = {
//     success: 'text-white',
//     error: 'text-white',
//     warning: 'text-dark',
//     info: 'text-white'
//   };

//   const bgClass = bgColors[notification.type] || 'bg-info';
//   const textClass = textColors[notification.type] || 'text-white';

//   return (
//     <div
//       className={`${bgClass} ${textClass} p-3 rounded shadow-lg position-fixed top-0 start-50 translate-middle-x mt-3 z-3 animate__animated animate__fadeInDown`}
//       style={{
//         minWidth: '300px',
//         maxWidth: '500px',
//         zIndex: 9999,
//         animationDuration: '0.5s'
//       }}
//     >
//       <div className="d-flex align-items-center">
//         <div className="flex-grow-1">
//           <div className="d-flex align-items-center mb-1">
//             <i className={`bi ${notification.icon} fs-4 me-2`}></i>
//             <h6 className="mb-0 fw-bold">{notification.title}</h6>
//           </div>
//           <p className="mb-0 small">{notification.message}</p>
//         </div>
//         <button
//           type="button"
//           className="btn-close btn-close-white ms-3"
//           onClick={onClose}
//           aria-label="Cerrar"
//         ></button>
//       </div>
//     </div>
//   );
// };

// // Componente SolicitaAtencionPage con sistema completo de notificaciones
// const SolicitaAtencionPage = () => {
//   // Estado inicial vacío
//   const initialFormData = {
//     nombre_contacto: '',
//     telefono: '',
//     email: '',
//     nombre_paciente: '',
//     edad_paciente: '',
//     tipo_servicio: '',
//     urgencia: 'Normal',
//     description: '',
//     termsAccepted: false
//   };

//   const [formData, setFormData] = useState(initialFormData);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [debugInfo, setDebugInfo] = useState('');

//   // Estados para validación de backend y notificaciones
//   const [backendStatus, setBackendStatus] = useState({
//     connected: false,
//     checking: true,
//     lastChecked: null,
//     responseTime: null,
//     endpoint: '',
//     status: 'unknown'
//   });

//   const [notification, setNotification] = useState({
//     show: false,
//     type: 'info',
//     title: '',
//     message: '',
//     icon: ''
//   });

//   // URL del backend
//   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/solicitudes';

//   // Función para mostrar notificaciones
//   const showNotification = (type, title, message, duration = 5000) => {
//     const icons = {
//       success: 'bi-check-circle-fill',
//       error: 'bi-exclamation-triangle-fill',
//       warning: 'bi-exclamation-circle-fill',
//       info: 'bi-info-circle-fill'
//     };

//     setNotification({
//       show: true,
//       type,
//       title,
//       message,
//       icon: icons[type]
//     });

//     if (duration > 0) {
//       setTimeout(() => {
//         setNotification(prev => ({ ...prev, show: false }));
//       }, duration);
//     }
//   };

//   // Función para ocultar notificación
//   const hideNotification = () => {
//     setNotification(prev => ({ ...prev, show: false }));
//   };

//   // Función para verificar el estado del backend
//   const checkBackendConnection = async (showNotification = true) => {
//     const startTime = Date.now();

//     try {
//       setBackendStatus(prev => ({
//         ...prev,
//         checking: true,
//         connected: false
//       }));

//       if (showNotification) {
//         showNotification('info', 'Verificando conexión', 'Conectando con el servidor backend...', 3000);
//       }

//       // Primero intentar endpoint de salud
//       const healthUrl = API_URL.replace('/solicitudes', '') + '/health';
//       const response = await fetch(healthUrl, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         }
//       });

//       const responseTime = Date.now() - startTime;

//       if (response.ok) {
//         const wasPreviouslyDisconnected = !backendStatus.connected;

//         setBackendStatus({
//           connected: true,
//           checking: false,
//           lastChecked: new Date(),
//           responseTime: responseTime,
//           endpoint: API_URL,
//           status: 'connected'
//         });

//         console.log(`✅ Backend conectado en ${responseTime}ms`);

//         if (showNotification) {
//           if (wasPreviouslyDisconnected) {
//             showNotification(
//               'success',
//               '¡Conexión establecida!',
//               `Backend conectado exitosamente (${responseTime}ms)`,
//               4000
//             );
//           } else {
//             showNotification(
//               'success',
//               'Conexión verificada',
//               `El servidor está respondiendo correctamente (${responseTime}ms)`,
//               3000
//             );
//           }
//         }

//         setDebugInfo(`Backend disponible (${responseTime}ms)`);
//         return true;
//       } else {
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//       }
//     } catch (error) {
//       console.log('Intentando endpoint alternativo...');
//       return await checkAlternativeEndpoint(startTime, showNotification);
//     }
//   };

//   // Función alternativa para verificar conexión
//   const checkAlternativeEndpoint = async (startTime, showNotification = true) => {
//     try {
//       const response = await fetch(API_URL, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         }
//       });

//       const responseTime = Date.now() - startTime;

//       if (response.status === 200 || response.status === 201 || response.status === 405) {
//         const wasPreviouslyDisconnected = !backendStatus.connected;

//         setBackendStatus({
//           connected: true,
//           checking: false,
//           lastChecked: new Date(),
//           responseTime: responseTime,
//           endpoint: API_URL,
//           status: 'available'
//         });

//         console.log(`✅ Backend disponible en endpoint principal (${responseTime}ms)`);

//         if (showNotification && wasPreviouslyDisconnected) {
//           showNotification(
//             'success',
//             '¡Conexión recuperada!',
//             `Backend disponible en endpoint alternativo (${responseTime}ms)`,
//             4000
//           );
//         }

//         setDebugInfo(`Backend disponible (${responseTime}ms)`);
//         return true;
//       } else {
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//       }
//     } catch (altError) {
//       const responseTime = Date.now() - startTime;
//       const wasPreviouslyConnected = backendStatus.connected;

//       setBackendStatus({
//         connected: false,
//         checking: false,
//         lastChecked: new Date(),
//         responseTime: responseTime,
//         endpoint: API_URL,
//         error: altError.message,
//         status: 'disconnected'
//       });

//       console.error('❌ Error conectando al backend:', altError);

//       if (showNotification) {
//         if (wasPreviouslyConnected) {
//           showNotification(
//             'error',
//             '¡Conexión perdida!',
//             'El servidor backend no está disponible. Verifica que esté corriendo.',
//             6000
//           );
//         } else {
//           showNotification(
//             'warning',
//             'Servidor no disponible',
//             `No se puede conectar al backend en ${API_URL}`,
//             5000
//           );
//         }
//       }

//       return false;
//     }
//   };

//   // Verificar si el backend está disponible al cargar el componente
//   useEffect(() => {
//     const initialCheck = async () => {
//       await checkBackendConnection(false);
//     };
//     initialCheck();

//     // Verificar periódicamente
//     const interval = setInterval(() => {
//       if (!backendStatus.checking) {
//         checkBackendConnection(false);
//       }
//     }, 45000);

//     return () => clearInterval(interval);
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));

//     if (error) setError('');
//   };

//   const resetForm = () => {
//     setFormData(initialFormData);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     console.log('🟡 Iniciando envío del formulario...');
//     console.log('🌐 URL del backend:', API_URL);

//     // Validación básica
//     if (!formData.termsAccepted) {
//       setError('Debes aceptar los términos y condiciones');
//       return;
//     }

//     // Validar campos obligatorios
//     const camposRequeridos = [
//       'nombre_contacto',
//       'telefono',
//       'email',
//       'nombre_paciente',
//       'edad_paciente',
//       'tipo_servicio',
//       'description'
//     ];

//     for (const campo of camposRequeridos) {
//       if (!formData[campo]) {
//         const campoNombre = campo.replace('_', ' ');
//         setError(`El campo "${campoNombre}" es obligatorio`);
//         return;
//       }
//     }

//     // Validar email
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) {
//       setError('Por favor, introduce un email válido');
//       return;
//     }

//     // Verificar conexión al backend antes de enviar
//     if (!backendStatus.connected) {
//       showNotification(
//         'warning',
//         'Verificando conexión',
//         'Intentando conectar con el servidor antes de enviar...',
//         3000
//       );

//       const isConnected = await checkBackendConnection(false);

//       if (!isConnected) {
//         setError(`No se pudo conectar con el servidor. Verifica que el backend esté corriendo en: ${API_URL}`);
//         showNotification(
//           'error',
//           'Error de conexión',
//           'No se puede conectar al servidor. Verifica que esté corriendo.',
//           5000
//         );
//         return;
//       }
//     }

//     setIsLoading(true);
//     setError('');
//     setDebugInfo('Enviando datos...');

//     const submissionData = {
//       nombre_contacto: formData.nombre_contacto.trim(),
//       telefono: formData.telefono.trim(),
//       email: formData.email.trim(),
//       nombre_paciente: formData.nombre_paciente.trim(),
//       edad_paciente: parseInt(formData.edad_paciente) || 0,
//       tipo_servicio: formData.tipo_servicio,
//       urgencia: formData.urgencia,
//       description: formData.description.trim(),
//       estado: 'pendiente',
//       fecha_creacion: new Date().toISOString()
//     };

//     console.log('📤 DATOS A ENVIAR AL BACKEND:', submissionData);

//     try {
//       showNotification(
//         'info',
//         'Enviando solicitud',
//         'Procesando tu solicitud, por favor espera...',
//         0
//       );

//       const response = await fetch(API_URL, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         },
//         body: JSON.stringify(submissionData)
//       });

//       console.log('📨 Respuesta del backend - Status:', response.status);

//       if (!response.ok) {
//         let errorMessage = `Error del servidor: ${response.status}`;

//         try {
//           const errorData = await response.json();
//           errorMessage = errorData.message || errorData.error || errorMessage;
//         } catch {
//           // Ignorar error de parseo
//         }

//         throw new Error(errorMessage);
//       }

//       const responseData = await response.json();
//       console.log('✅ Solicitud procesada exitosamente:', responseData);

//       // Resetear formulario
//       resetForm();
//       setIsSubmitted(true);
//       setDebugInfo('✅ Solicitud enviada exitosamente');

//       // Mostrar notificación de éxito
//       hideNotification();
//       showNotification(
//         'success',
//         '¡Solicitud enviada!',
//         'Tu solicitud ha sido registrada exitosamente en nuestra base de datos.',
//         5000
//       );

//       // Ocultar mensaje de éxito del formulario después de 5 segundos
//       setTimeout(() => {
//         setIsSubmitted(false);
//       }, 5000);

//     } catch (error) {
//       console.error('❌ Error completo en el envío:', error);

//       hideNotification();

//       let mensajeError = `Error al enviar la solicitud: ${error.message}`;
//       let notificationType = 'error';
//       let notificationTitle = 'Error al enviar';

//       if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
//         mensajeError = `No se pudo conectar con el servidor. Verifica que el backend esté corriendo en: ${API_URL}`;
//         notificationTitle = 'Error de conexión';

//         // Actualizar estado de conexión
//         setBackendStatus(prev => ({ ...prev, connected: false }));

//         // Mostrar notificación de reconexión
//         setTimeout(() => {
//           showNotification(
//             'warning',
//             'Intentando reconectar',
//             'Verificando conexión con el servidor...',
//             3000
//           );
//           checkBackendConnection(false);
//         }, 2000);
//       }

//       setError(mensajeError);
//       setDebugInfo(`❌ Error: ${error.message}`);

//       showNotification(
//         notificationType,
//         notificationTitle,
//         'Hubo un problema al procesar tu solicitud. Por favor, intenta nuevamente.',
//         6000
//       );

//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Función para forzar verificación de backend
//   const forceBackendCheck = async () => {
//     setError('');
//     setDebugInfo('Verificando conexión al backend...');
//     await checkBackendConnection(true);
//   };

//   // Función para cargar datos de prueba
//   const loadTestData = () => {
//     setFormData({
//       nombre_contacto: 'Juan Pérez',
//       telefono: '612-345-678',
//       email: 'juan@ejemplo.com',
//       nombre_paciente: 'María Pérez',
//       edad_paciente: '75',
//       tipo_servicio: 'Cuidado Básico',
//       urgencia: 'Normal',
//       description: 'Paciente necesita cuidados básicos diarios para actividades cotidianas',
//       termsAccepted: true
//     });
//     setError('');
//     showNotification('info', 'Datos de prueba cargados', 'Puedes editar los campos o enviar directamente.', 3000);
//   };

//   return (
//     <div className="page-content">
//       {/* Notificación flotante */}
//       <NotificationBanner notification={notification} onClose={hideNotification} />

//       <div className="container py-5">
//         <div className="row">
//           <div className="col-lg-10 mx-auto">
//             <h1 className="display-4 fw-bold mb-4 text-center">
//               <i className="bi bi-clipboard-plus text-primary me-2"></i>
//               Solicitar Atención
//             </h1>

//             {/* Banner de estado de conexión */}
//             <div className={`alert mb-4 ${backendStatus.connected ? 'alert-success' : 'alert-danger'} border-0 shadow-sm`}>
//               <div className="d-flex justify-content-between align-items-center">
//                 <div className="d-flex align-items-center">
//                   <div className="me-3">
//                     <div className={`p-2 rounded-circle ${backendStatus.connected ? 'bg-success' : 'bg-danger'}`}>
//                       <i className={`bi ${backendStatus.connected ? 'bi-plug' : 'bi-plug-fill'} text-white`}></i>
//                     </div>
//                   </div>
//                   <div>
//                     <h6 className="mb-1">
//                       {backendStatus.connected ? '✅ Servidor Conectado' : '❌ Servidor Desconectado'}
//                     </h6>
//                     <p className="mb-0 small">
//                       {backendStatus.connected
//                         ? `Backend disponible${backendStatus.responseTime ? ` (${backendStatus.responseTime}ms)` : ''}`
//                         : `No se puede conectar al servidor en ${API_URL}`}
//                     </p>
//                     {backendStatus.lastChecked && (
//                       <p className="mb-0 small text-muted">
//                         <i className="bi bi-clock-history me-1"></i>
//                         Última verificación: {backendStatus.lastChecked.toLocaleTimeString()}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//                 <div>
//                   <button
//                     className={`btn btn-sm ${backendStatus.connected ? 'btn-outline-success' : 'btn-outline-danger'}`}
//                     onClick={forceBackendCheck}
//                     disabled={backendStatus.checking}
//                   >
//                     {backendStatus.checking ? (
//                       <>
//                         <span className="spinner-border spinner-border-sm me-1"></span>
//                         Verificando...
//                       </>
//                     ) : (
//                       <>
//                         <i className="bi bi-arrow-clockwise me-1"></i>
//                         Verificar Conexión
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Indicadores de estado */}
//             <div className="row mb-4">
//               <div className="col-md-6">
//                 <div className="card border-0 shadow-sm mb-3">
//                   <div className="card-body">
//                     <h6 className="card-title">
//                       <i className="bi bi-hdd-network text-primary me-2"></i>
//                       Estado del Servidor
//                     </h6>
//                     <div className="d-flex align-items-center mt-3">
//                       <div className={`me-3 ${backendStatus.connected ? 'text-success' : 'text-danger'}`}>
//                         <i className={`bi ${backendStatus.connected ? 'bi-wifi' : 'bi-wifi-off'} fs-1`}></i>
//                       </div>
//                       <div>
//                         <h4 className={`mb-0 ${backendStatus.connected ? 'text-success' : 'text-danger'}`}>
//                           {backendStatus.connected ? 'ONLINE' : 'OFFLINE'}
//                         </h4>
//                         <small className="text-muted">
//                           {backendStatus.connected
//                             ? 'El servidor está funcionando correctamente'
//                             : 'El servidor no está disponible'}
//                         </small>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-md-6">
//                 <div className="card border-0 shadow-sm mb-3">
//                   <div className="card-body">
//                     <h6 className="card-title">
//                       <i className="bi bi-speedometer2 text-primary me-2"></i>
//                       Rendimiento
//                     </h6>
//                     <div className="mt-3">
//                       {backendStatus.responseTime ? (
//                         <>
//                           <div className="d-flex justify-content-between mb-1">
//                             <span>Tiempo de respuesta:</span>
//                             <span className="fw-bold">{backendStatus.responseTime}ms</span>
//                           </div>
//                           <div className="progress" style={{ height: '8px' }}>
//                             <div
//                               className={`progress-bar ${backendStatus.responseTime < 100 ? 'bg-success' : backendStatus.responseTime < 500 ? 'bg-warning' : 'bg-danger'}`}
//                               role="progressbar"
//                               style={{ width: `${Math.min(backendStatus.responseTime / 10, 100)}%` }}
//                             ></div>
//                           </div>
//                           <small className="text-muted mt-2 d-block">
//                             {backendStatus.responseTime < 100 ? 'Excelente' :
//                               backendStatus.responseTime < 500 ? 'Aceptable' : 'Lento'}
//                           </small>
//                         </>
//                       ) : (
//                         <p className="text-muted mb-0">No hay datos de rendimiento disponibles</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Información para usuarios */}
//             <div className="alert alert-info mb-4">
//               <h5>
//                 <i className="bi bi-info-circle me-2"></i>
//                 Acceso Público
//               </h5>
//               <p className="mb-0">
//                 Cualquier persona puede solicitar atención médica. Si ya tienes una cuenta, puedes
//                 <Link to="/login" className="text-decoration-none fw-bold ms-1">iniciar sesión</Link>
//                 {' '}para acceder a más funcionalidades.
//               </p>
//             </div>

//             {/* Mensaje de éxito */}
//             {isSubmitted && (
//               <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
//                 <i className="bi bi-check-circle-fill fs-4 me-2"></i>
//                 <strong>¡Solicitud Registrada Exitosamente!</strong>
//                 <p className="mb-0 mt-2">Tu solicitud ha sido enviada correctamente a nuestra base de datos. Nos pondremos en contacto contigo a la brevedad.</p>
//                 <p className="mb-0 mt-2 small">
//                   <i className="bi bi-info-circle me-1"></i>
//                   ID de referencia: SOL-{Date.now().toString().slice(-6)}
//                 </p>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={() => setIsSubmitted(false)}
//                   aria-label="Cerrar"
//                 ></button>
//               </div>
//             )}

//             {/* Botones de utilidad */}
//             <div className="mb-4 text-center">
//               <button
//                 className="btn btn-warning btn-sm me-2"
//                 onClick={loadTestData}
//                 disabled={isLoading}
//               >
//                 <i className="bi bi-lightning-charge me-2"></i>
//                 Cargar Datos de Prueba
//               </button>

//               <button
//                 className="btn btn-outline-secondary btn-sm"
//                 onClick={resetForm}
//                 disabled={isLoading}
//               >
//                 <i className="bi bi-eraser me-2"></i>
//                 Limpiar Formulario
//               </button>
//             </div>

//             {/* Mostrar error si existe */}
//             {error && (
//               <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
//                 <i className="bi bi-exclamation-triangle-fill me-2"></i>
//                 <strong>Error al enviar la solicitud:</strong>
//                 <p className="mb-0 mt-2">{error}</p>
//                 <div className="mt-3">
//                   <h6>Solución de problemas:</h6>
//                   <ol className="mb-0 small">
//                     <li>Asegúrate de que el backend esté corriendo en el puerto 3001</li>
//                     <li>Verifica que todos los campos estén completos</li>
//                     <li>Revisa la consola del navegador (F12) para más detalles</li>
//                   </ol>
//                 </div>
//                 <div className="mt-2">
//                   <button
//                     className="btn btn-sm btn-outline-danger"
//                     onClick={() => setError('')}
//                   >
//                     Cerrar
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Formulario */}
//             <div className="card border-0 shadow-sm">
//               <div className="card-body p-4">
//                 <p className="lead text-center mb-4">Completa el siguiente formulario para solicitar nuestros servicios de enfermería a domicilio.</p>

//                 <form onSubmit={handleSubmit}>
//                   <div className="row g-3">
//                     <div className="col-md-6">
//                       <label className="form-label">
//                         <i className="bi bi-person me-1"></i>
//                         Nombre del Contacto *
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         name="nombre_contacto"
//                         value={formData.nombre_contacto}
//                         onChange={handleChange}
//                         disabled={isLoading}
//                         placeholder="Ej: María González"
//                         required
//                       />
//                     </div>

//                     <div className="col-md-6">
//                       <label className="form-label">
//                         <i className="bi bi-telephone me-1"></i>
//                         Teléfono de Contacto *
//                       </label>
//                       <input
//                         type="tel"
//                         className="form-control"
//                         name="telefono"
//                         value={formData.telefono}
//                         onChange={handleChange}
//                         disabled={isLoading}
//                         placeholder="Ej: 612 345 678"
//                         required
//                       />
//                     </div>

//                     <div className="col-12">
//                       <label className="form-label">
//                         <i className="bi bi-envelope me-1"></i>
//                         Email *
//                       </label>
//                       <input
//                         type="email"
//                         className="form-control"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         disabled={isLoading}
//                         placeholder="ejemplo@email.com"
//                         required
//                       />
//                     </div>

//                     <div className="col-md-6">
//                       <label className="form-label">
//                         <i className="bi bi-person-heart me-1"></i>
//                         Nombre del Paciente *
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         name="nombre_paciente"
//                         value={formData.nombre_paciente}
//                         onChange={handleChange}
//                         disabled={isLoading}
//                         placeholder="Ej: Juan Pérez"
//                         required
//                       />
//                     </div>

//                     <div className="col-md-6">
//                       <label className="form-label">
//                         <i className="bi bi-calendar3 me-1"></i>
//                         Edad del Paciente *
//                       </label>
//                       <input
//                         type="number"
//                         className="form-control"
//                         name="edad_paciente"
//                         value={formData.edad_paciente}
//                         onChange={handleChange}
//                         min="0"
//                         max="120"
//                         disabled={isLoading}
//                         placeholder="Ej: 75"
//                         required
//                       />
//                     </div>

//                     <div className="col-md-6">
//                       <label className="form-label">
//                         <i className="bi bi-heart-pulse me-1"></i>
//                         Tipo de Servicio *
//                       </label>
//                       <select
//                         className="form-select"
//                         name="tipo_servicio"
//                         value={formData.tipo_servicio}
//                         onChange={handleChange}
//                         disabled={isLoading}
//                         required
//                       >
//                         <option value="">Selecciona una opción</option>
//                         <option value="Cuidado Básico">Cuidado Básico</option>
//                         <option value="Enfermería Especializada">Enfermería Especializada</option>
//                         <option value="Terapia Física">Terapia Física</option>
//                         <option value="Cuidado Paliativo">Cuidado Paliativo</option>
//                         <option value="Recuperación Postoperatoria">Recuperación Postoperatoria</option>
//                         <option value="Otro">Otro</option>
//                       </select>
//                     </div>

//                     <div className="col-md-6">
//                       <label className="form-label">
//                         <i className="bi bi-clock me-1"></i>
//                         Urgencia *
//                       </label>
//                       <select
//                         className="form-select"
//                         name="urgencia"
//                         value={formData.urgencia}
//                         onChange={handleChange}
//                         disabled={isLoading}
//                         required
//                       >
//                         <option value="Normal">Normal (24-48 horas)</option>
//                         <option value="Urgente">Urgente (menos de 24 horas)</option>
//                       </select>
//                     </div>

//                     <div className="col-12">
//                       <label className="form-label">
//                         <i className="bi bi-chat-left-text me-1"></i>
//                         Descripción *
//                       </label>
//                       <textarea
//                         className="form-control"
//                         name="description"
//                         rows="4"
//                         value={formData.description}
//                         onChange={handleChange}
//                         placeholder="Describe brevemente las necesidades de atención del paciente..."
//                         disabled={isLoading}
//                         required
//                       ></textarea>
//                       <div className="form-text">
//                         Incluye información relevante como: diagnóstico, medicamentos, limitaciones, etc.
//                       </div>
//                     </div>

//                     <div className="col-12">
//                       <div className="form-check">
//                         <input
//                           className="form-check-input"
//                           type="checkbox"
//                           id="termsAccepted"
//                           name="termsAccepted"
//                           checked={formData.termsAccepted}
//                           onChange={handleChange}
//                           disabled={isLoading}
//                           required
//                         />
//                         <label className="form-check-label" htmlFor="termsAccepted">
//                           <i className="bi bi-shield-check me-1"></i>
//                           Acepto los términos y condiciones y autorizo el tratamiento de mis datos personales según la política de privacidad. *
//                         </label>
//                       </div>
//                     </div>

//                     <div className="col-12 text-center mt-4">
//                       <button
//                         type="submit"
//                         className="btn btn-primary btn-lg px-5"
//                         disabled={isLoading || !backendStatus.connected}
//                       >
//                         {isLoading ? (
//                           <>
//                             <span className="spinner-border spinner-border-sm me-2" role="status"></span>
//                             Enviando a la base de datos...
//                           </>
//                         ) : (
//                           <>
//                             <i className="bi bi-send me-2"></i>
//                             Enviar Solicitud
//                           </>
//                         )}
//                       </button>
//                       {!backendStatus.connected && (
//                         <p className="mt-2 small text-danger">
//                           <i className="bi bi-exclamation-triangle me-1"></i>
//                           No se puede enviar mientras el servidor esté desconectado
//                         </p>
//                       )}
//                       <p className="mt-2 small text-muted">
//                         <i className="bi bi-info-circle me-1"></i>
//                         Los datos serán almacenados en nuestra base de datos segura
//                       </p>
//                     </div>
//                   </div>
//                 </form>
//               </div>
//             </div>

//             {/* Información de solución de problemas */}
//             <div className="mt-4 card border-info">
//               <div className="card-header bg-info text-dark d-flex justify-content-between align-items-center">
//                 <div>
//                   <i className="bi bi-wrench me-2"></i>
//                   Solución de problemas de conexión
//                 </div>
//                 <span className={`badge ${backendStatus.connected ? 'bg-success' : 'bg-danger'}`}>
//                   {backendStatus.connected ? 'CONECTADO' : 'DESCONECTADO'}
//                 </span>
//               </div>
//               <div className="card-body">
//                 <h6>Si ves "Servidor Desconectado":</h6>
//                 <ol className="mb-3">
//                   <li><strong>Inicia el backend:</strong>
//                     <pre className="bg-dark text-white p-2 mt-1 small rounded">
//                       cd backend<br />
//                       npm start
//                     </pre>
//                   </li>
//                   <li><strong>Verifica que esté en el puerto correcto:</strong>
//                     <code className="ms-1">{API_URL}</code>
//                   </li>
//                   <li><strong>Haz clic en "Verificar Conexión"</strong> arriba para reconectar</li>
//                   <li><strong>Revisa la consola del backend</strong> para ver errores</li>
//                 </ol>
//                 <div className="alert alert-warning mb-0">
//                   <i className="bi bi-lightbulb me-2"></i>
//                   <strong>Consejo:</strong> Si el backend se reconecta, verás una notificación verde en la parte superior.
//                 </div>
//               </div>
//             </div>

//             <div className="text-center mt-5">
//               <Link to="/" className="btn btn-outline-primary btn-lg px-4 me-2">
//                 <i className="bi bi-house me-2"></i>
//                 Volver al Inicio
//               </Link>
//               <Link to="/register" className="btn btn-outline-success btn-lg px-4 me-2">
//                 <i className="bi bi-person-plus me-2"></i>
//                 Crear Cuenta
//               </Link>
//               <Link to="/login" className="btn btn-outline-secondary btn-lg px-4">
//                 <i className="bi bi-box-arrow-in-right me-2"></i>
//                 Iniciar Sesión
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Componente AdminSolicitudesPage CORREGIDO (solo para usuarios autenticados)
// const AdminSolicitudesPage = () => {
//   const user = authService.getCurrentUser();

//   const [solicitudes, setSolicitudes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [debugInfo, setDebugInfo] = useState('');

//   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/solicitudes';

//   useEffect(() => {
//     fetchSolicitudes();
//   }, []);

//   // Verificación de autenticación para ver solicitudes
//   if (!user) {
//     return (
//       <div className="container py-5">
//         <div className="alert alert-warning text-center">
//           <h4>Acceso Restringido</h4>
//           <p>Debes iniciar sesión para ver las solicitudes.</p>
//           <div className="mt-3">
//             <Link to="/login" className="btn btn-primary me-2">
//               Iniciar Sesión
//             </Link>
//             <Link to="/register" className="btn btn-outline-primary">
//               Registrarse
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const fetchSolicitudes = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       setDebugInfo('Cargando solicitudes...');

//       const response = await fetch(API_URL);

//       console.log('📡 Fetching solicitudes desde:', API_URL);
//       console.log('📡 Response status:', response.status);

//       if (!response.ok) {
//         throw new Error(`Error ${response.status}: ${response.statusText}`);
//       }

//       const data = await response.json();
//       console.log('📡 Datos recibidos:', data);
//       setSolicitudes(data);
//       setDebugInfo(`Se cargaron ${data.length} solicitudes`);
//     } catch (error) {
//       console.error('Error cargando solicitudes:', error);
//       setError(`Error al cargar las solicitudes: ${error.message}`);
//       setDebugInfo(`Error: ${error.message}`);
//       setSolicitudes([]);

//       // Mostrar ayuda para solucionar problemas
//       if (error.message.includes('Failed to fetch')) {
//         setError(`No se pudo conectar con el backend en ${API_URL}. Asegúrate de que esté corriendo.`);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatFecha = (fecha) => {
//     try {
//       return new Date(fecha).toLocaleDateString('es-ES', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//       });
//     } catch {
//       return 'Fecha inválida';
//     }
//   };

//   const getUrgenciaBadge = (urgencia) => {
//     const clase = urgencia === 'Urgente' ? 'danger' : 'success';
//     return <span className={`badge bg-${clase}`}>{urgencia}</span>;
//   };

//   if (loading) {
//     return (
//       <div className="container py-5">
//         <div className="text-center py-5">
//           <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
//             <span className="visually-hidden">Cargando...</span>
//           </div>
//           <p className="mt-3">Cargando solicitudes desde la base de datos...</p>
//           {debugInfo && <p className="small text-muted">{debugInfo}</p>}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container py-5">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h1 className="display-5 fw-bold">
//           <i className="bi bi-list-check text-primary me-2"></i>
//           Solicitudes de Atención
//         </h1>
//         <div className="d-flex align-items-center">
//           {debugInfo && (
//             <span className="me-3 small text-muted">{debugInfo}</span>
//           )}
//           <button
//             className="btn btn-primary"
//             onClick={fetchSolicitudes}
//             disabled={loading}
//           >
//             <i className="bi bi-arrow-clockwise me-2"></i>
//             Actualizar
//           </button>
//         </div>
//       </div>

//       {error && (
//         <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
//           <i className="bi bi-exclamation-triangle-fill me-2"></i>
//           <strong>Error:</strong> {error}
//           <div className="mt-2">
//             <button
//               className="btn btn-sm btn-outline-primary me-2"
//               onClick={fetchSolicitudes}
//             >
//               Reintentar
//             </button>
//             <button
//               type="button"
//               className="btn-close"
//               onClick={() => setError('')}
//               aria-label="Cerrar"
//             ></button>
//           </div>
//         </div>
//       )}

//       {solicitudes.length === 0 ? (
//         <div className="alert alert-info text-center py-5">
//           <i className="bi bi-info-circle-fill fs-1 text-info mb-3"></i>
//           <h4>No hay solicitudes registradas</h4>
//           <p className="mb-3">No se encontraron solicitudes en la base de datos.</p>
//           <div className="mt-3">
//             <Link to="/solicita-atencion" className="btn btn-primary me-2">
//               <i className="bi bi-plus-circle me-2"></i>
//               Crear Nueva Solicitud
//             </Link>
//             <button className="btn btn-outline-secondary" onClick={fetchSolicitudes}>
//               <i className="bi bi-arrow-clockwise me-2"></i>
//               Reintentar
//             </button>
//           </div>
//         </div>
//       ) : (
//         <>
//           <div className="card border-0 shadow-sm mb-4">
//             <div className="card-header bg-white border-0">
//               <div className="d-flex justify-content-between align-items-center">
//                 <h5 className="mb-0">
//                   Total de solicitudes: <span className="badge bg-primary">{solicitudes.length}</span>
//                 </h5>
//                 <div className="text-end">
//                   <small className="text-muted">
//                     <i className="bi bi-database me-1"></i>
//                     Datos cargados desde la base de datos
//                   </small>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="card border-0 shadow-sm">
//             <div className="card-body p-0">
//               <div className="table-responsive">
//                 <table className="table table-hover mb-0">
//                   <thead className="table-light">
//                     <tr>
//                       <th>ID</th>
//                       <th>Contacto</th>
//                       <th>Paciente</th>
//                       <th>Edad</th>
//                       <th>Servicio</th>
//                       <th>Urgencia</th>
//                       <th>Fecha</th>
//                       <th>Estado</th>
//                       <th>Acciones</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {solicitudes.map((solicitud) => (
//                       <tr key={solicitud.id}>
//                         <td><strong>#{solicitud.id}</strong></td>
//                         <td>
//                           <div>
//                             <strong>{solicitud.nombre_contacto}</strong>
//                             <div className="small text-muted">{solicitud.telefono}</div>
//                             <div className="small">{solicitud.email}</div>
//                           </div>
//                         </td>
//                         <td>{solicitud.nombre_paciente}</td>
//                         <td>
//                           <span className="badge bg-info">{solicitud.edad_paciente}</span>
//                         </td>
//                         <td>{solicitud.tipo_servicio}</td>
//                         <td>{getUrgenciaBadge(solicitud.urgencia)}</td>
//                         <td>
//                           <small>{formatFecha(solicitud.created_at || solicitud.fecha_creacion)}</small>
//                         </td>
//                         <td>
//                           <span className="badge bg-warning">Pendiente</span>
//                         </td>
//                         <td>
//                           <button
//                             className="btn btn-sm btn-outline-primary"
//                             data-bs-toggle="modal"
//                             data-bs-target={`#modal-${solicitud.id}`}
//                             title="Ver detalles"
//                           >
//                             <i className="bi bi-eye"></i>
//                           </button>

//                           <div className="modal fade" id={`modal-${solicitud.id}`} tabIndex="-1">
//                             <div className="modal-dialog modal-lg">
//                               <div className="modal-content">
//                                 <div className="modal-header">
//                                   <h5 className="modal-title">
//                                     Detalles de la Solicitud #{solicitud.id}
//                                   </h5>
//                                   <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
//                                 </div>
//                                 <div className="modal-body">
//                                   <div className="row">
//                                     <div className="col-md-6">
//                                       <h6>Información del Contacto</h6>
//                                       <p><strong>Nombre:</strong> {solicitud.nombre_contacto}</p>
//                                       <p><strong>Teléfono:</strong> {solicitud.telefono}</p>
//                                       <p><strong>Email:</strong> {solicitud.email}</p>
//                                     </div>
//                                     <div className="col-md-6">
//                                       <h6>Información del Paciente</h6>
//                                       <p><strong>Paciente:</strong> {solicitud.nombre_paciente}</p>
//                                       <p><strong>Edad:</strong> {solicitud.edad_paciente}</p>
//                                       <p><strong>Servicio:</strong> {solicitud.tipo_servicio}</p>
//                                       <p><strong>Urgencia:</strong> {getUrgenciaBadge(solicitud.urgencia)}</p>
//                                     </div>
//                                   </div>
//                                   <div className="mt-3">
//                                     <h6>Descripción</h6>
//                                     <div className="card">
//                                       <div className="card-body">
//                                         {solicitud.description || 'Sin descripción adicional'}
//                                       </div>
//                                     </div>
//                                   </div>
//                                   <div className="mt-3">
//                                     <h6>Información del Sistema</h6>
//                                     <p><strong>ID:</strong> {solicitud.id}</p>
//                                     <p><strong>Fecha de creación:</strong> {formatFecha(solicitud.created_at || solicitud.fecha_creacion)}</p>
//                                     <p><strong>Estado:</strong> <span className="badge bg-warning">Pendiente</span></p>
//                                   </div>
//                                 </div>
//                                 <div className="modal-footer">
//                                   <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
//                                     Cerrar
//                                   </button>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </>
//       )}

//       <div className="mt-4 d-flex justify-content-between">
//         <Link to="/" className="btn btn-outline-primary">
//           <i className="bi bi-arrow-left me-2"></i>
//           Volver al Inicio
//         </Link>
//         <div>
//           <Link to="/solicita-atencion" className="btn btn-primary me-2">
//             <i className="bi bi-plus-circle me-2"></i>
//             Nueva Solicitud
//           </Link>
//           <button className="btn btn-outline-secondary" onClick={fetchSolicitudes}>
//             <i className="bi bi-arrow-clockwise me-2"></i>
//             Actualizar Lista
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Componente principal App
// function App() {
//   const [isLoading, setIsLoading] = useState(true);
//   const [showLoader, setShowLoader] = useState(true);

//   useEffect(() => {
//     const initializeApp = async () => {
//       await new Promise(resolve => setTimeout(resolve, 1000));

//       setIsLoading(false);
//       setTimeout(() => {
//         setShowLoader(false);
//       }, 500);
//     };

//     initializeApp();
//   }, []);

//   if (showLoader) {
//     return <LoadingIndicator />;
//   }

//   return (
//     <Router>
//       <div className="App">
//         <Navbar />
//         <main>
//           <Suspense fallback={
//             <div className="container py-5 text-center">
//               <div className="spinner-border text-primary" role="status">
//                 <span className="visually-hidden">Cargando...</span>
//               </div>
//             </div>
//           }>
//             <Routes>
//               {/* Rutas públicas */}
//               <Route path="/" element={<HomePage />} />
//               <Route path="/conoce-mas" element={<ConoceMasPage />} />
//               <Route path="/login" element={<Login />} />
//               <Route path="/register" element={<Register />} />
//               <Route path="/unauthorized" element={<UnauthorizedPage />} />
//               <Route path="/solicita-atencion" element={<SolicitaAtencionPage />} />

//               {/* Rutas protegidas (requieren autenticación) */}
//               <Route path="/perfil" element={
//                 <ProtectedRoute>
//                   <UserProfile />
//                 </ProtectedRoute>
//               } />

//               <Route path="/admin-solicitudes" element={
//                 <ProtectedRoute>
//                   <AdminSolicitudesPage />
//                 </ProtectedRoute>
//               } />

//               {/* Rutas protegidas por rol */}
//               <Route path="/admin/dashboard" element={
//                 <ProtectedRoute requiredRoles={['ADMIN']}>
//                   <AdminDashboard />
//                 </ProtectedRoute>
//               } />

//               <Route path="/enfermera/dashboard" element={
//                 <ProtectedRoute requiredRoles={['ENFERMERA']}>
//                   <EnfermeraDashboard />
//                 </ProtectedRoute>
//               } />

//               <Route path="/recepcionista/dashboard" element={
//                 <ProtectedRoute requiredRoles={['RECEPCIONISTA']}>
//                   <RecepcionistaDashboard />
//                 </ProtectedRoute>
//               } />

//               {/* Redirección para rutas no encontradas */}
//               <Route path="*" element={<Navigate to="/" replace />} />
//             </Routes>
//           </Suspense>
//         </main>
//         <Footer />
//       </div>
//     </Router>
//   );
// }

// export default App;




import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AdminDashboard from './components/admin/AdminDashboard';

function App() {
  // Función de prueba para debug
  useEffect(() => {
    console.log('=== SISTEMA ENFERMERA CORAZÓN ===');
    console.log('Frontend: http://localhost:3000');
    console.log('Backend: http://localhost:3001');
    console.log('Para probar login automático:');
    console.log('- Usuario: admin');
    console.log('- Contraseña: lopez');
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
        {/* Redirigir rutas no encontradas al login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;