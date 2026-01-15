-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 15-01-2026 a las 19:49:25
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `enfermeras`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `calificaciones`
--

CREATE TABLE `calificaciones` (
  `id` int(11) NOT NULL,
  `cliente_id` int(11) DEFAULT NULL,
  `enfermera_id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `puntuacion` int(11) NOT NULL,
  `comentario` text DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `calificaciones`
--

INSERT INTO `calificaciones` (`id`, `cliente_id`, `enfermera_id`, `usuario_id`, `puntuacion`, `comentario`, `fecha`) VALUES
(1, NULL, 5, 7, 3, 'cumple con todo\n', '2026-01-06 20:01:52'),
(2, NULL, 24, 7, 1, 'no cumple', '2026-01-06 20:04:31');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `calificaciones_enfermera`
--

CREATE TABLE `calificaciones_enfermera` (
  `id` int(11) NOT NULL,
  `cliente_id` int(11) NOT NULL,
  `enfermera_id` int(11) NOT NULL,
  `solicitud_id` int(11) DEFAULT NULL,
  `puntuacion` tinyint(4) NOT NULL CHECK (`puntuacion` >= 1 and `puntuacion` <= 5),
  `comentario` text DEFAULT NULL,
  `fecha_servicio` date DEFAULT NULL,
  `servicio_prestado` varchar(200) DEFAULT NULL,
  `recomendaria` tinyint(1) DEFAULT 1,
  `fecha_calificacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `estado` enum('activo','eliminado') DEFAULT 'activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `calificaciones_enfermera`
--

INSERT INTO `calificaciones_enfermera` (`id`, `cliente_id`, `enfermera_id`, `solicitud_id`, `puntuacion`, `comentario`, `fecha_servicio`, `servicio_prestado`, `recomendaria`, `fecha_calificacion`, `estado`) VALUES
(1, 1, 2, 1, 5, 'Excelente servicio, muy profesional y atenta. Llegó puntual y realizó el procedimiento con cuidado.', '2025-12-23', 'Toma de muestras de sangre', 1, '2026-01-06 15:18:43', 'activo'),
(2, 2, 2, 2, 4, 'Muy buena atención, aunque llegó 10 minutos tarde. El procedimiento fue indoloro.', '2025-12-30', 'Control de presión arterial', 1, '2026-01-06 15:18:43', 'activo'),
(3, 3, 3, 3, 5, 'Increíble trato con mi hijo de 5 años. Lo calmó y realizó la vacuna sin problemas.', '2026-01-06', 'Vacunación pediátrica', 1, '2026-01-06 15:18:43', 'activo'),
(4, 4, 2, 4, 3, 'Atención correcta, pero no explicó bien los resultados de la prueba.', '2025-12-30', 'Prueba de glucosa', 0, '2026-01-06 15:18:43', 'activo'),
(5, 3, 5, 3, 5, 'Increíble trato con mi hijo de 5 años. Lo calmó y realizó la vacuna sin problemas.', '2026-01-06', 'Vacunación pediátrica', 1, '2026-01-06 15:31:54', 'activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` text DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `genero` enum('M','F','O') DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id`, `usuario_id`, `nombre`, `apellido`, `email`, `telefono`, `direccion`, `fecha_nacimiento`, `genero`, `creado_en`, `actualizado_en`) VALUES
(1, 4, 'Carlos', 'Mendoza', 'carlos.mendoza@email.com', '555-1001', NULL, NULL, NULL, '2026-01-06 15:18:43', '2026-01-15 18:46:58'),
(2, 7, 'Ana', 'Gutiérrez', 'ana.gutierrez@email.com', '555-1002', NULL, NULL, NULL, '2026-01-06 15:18:43', '2026-01-15 18:46:58'),
(3, NULL, 'Luis', 'Ramírez', 'luis.ramirez@email.com', '555-1003', NULL, NULL, NULL, '2026-01-06 15:18:43', '2026-01-06 15:18:43'),
(4, NULL, 'Sofía', 'Castillo', 'sofia.castillo@email.com', '555-1004', NULL, NULL, NULL, '2026-01-06 15:18:43', '2026-01-06 15:18:43');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `enfermeras`
--

CREATE TABLE `enfermeras` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `especialidad` varchar(100) DEFAULT NULL,
  `numero_licencia` varchar(50) DEFAULT NULL,
  `fecha_contratacion` date DEFAULT NULL,
  `experiencia_anos` int(11) DEFAULT 0,
  `disponible` tinyint(1) DEFAULT 1,
  `calificacion_promedio` decimal(3,2) DEFAULT 0.00,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `enfermeras`
--

INSERT INTO `enfermeras` (`id`, `usuario_id`, `especialidad`, `numero_licencia`, `fecha_contratacion`, `experiencia_anos`, `disponible`, `calificacion_promedio`, `creado_en`) VALUES
(1, 2, 'Enfermería General', 'ENF001', '2023-02-20', 5, 1, 4.50, '2026-01-15 18:46:58'),
(2, 5, 'Pediatría', 'ENF002', '2023-03-10', 3, 1, 5.00, '2026-01-15 18:46:58'),
(3, 6, 'Geriatría', 'ENF003', '2023-04-15', 4, 1, 0.00, '2026-01-15 18:46:58'),
(4, 23, NULL, NULL, NULL, 0, 1, 0.00, '2026-01-15 18:46:58'),
(5, 24, NULL, NULL, NULL, 0, 0, 0.00, '2026-01-15 18:46:58');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `novedades_calendario`
--

CREATE TABLE `novedades_calendario` (
  `id` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `nota` text NOT NULL,
  `evidencia_foto` varchar(255) DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `novedades_calendario`
--

INSERT INTO `novedades_calendario` (`id`, `fecha`, `nota`, `evidencia_foto`, `usuario_id`, `creado_en`) VALUES
(1, '2026-01-08', 'aaaaaa', 'WhatsApp Image 2025-12-29 at 11.05.13 AM.jpeg', 2, '2026-01-07 18:58:08'),
(2, '2026-01-08', 'aaaaaa', 'WhatsApp Image 2025-12-29 at 11.05.13 AM.jpeg', 2, '2026-01-07 18:58:10'),
(3, '2026-01-08', 'aaaaaa', 'WhatsApp Image 2025-12-29 at 11.05.13 AM.jpeg', 2, '2026-01-07 19:05:34'),
(4, '2026-01-08', 'aaaaaa', 'WhatsApp Image 2025-12-29 at 11.05.13 AM.jpeg', 2, '2026-01-07 19:05:34'),
(5, '2026-01-08', 'aaaaaa', 'WhatsApp Image 2025-12-29 at 11.05.13 AM.jpeg', 2, '2026-01-07 19:05:34'),
(6, '2026-01-07', 'falta carbon ', 'WhatsApp Image 2025-12-29 at 11.05.13 AM.jpeg', 3, '2026-01-07 19:38:33'),
(7, '2026-01-07', 'falta carbon ', 'WhatsApp Image 2025-12-29 at 11.05.13 AM.jpeg', 3, '2026-01-07 19:38:34'),
(8, '2026-01-07', 'falta carbon ', 'WhatsApp Image 2025-12-29 at 11.05.13 AM.jpeg', 3, '2026-01-07 19:38:34'),
(9, '2026-01-07', 'falta carbon ', 'WhatsApp Image 2025-12-29 at 11.05.13 AM.jpeg', 3, '2026-01-07 19:38:34'),
(10, '2026-01-09', 'no carga las geringas', 'WhatsApp Image 2025-12-29 at 11.05.13 AM.jpeg', 3, '2026-01-07 20:00:52'),
(11, '2026-01-09', 'sali hacer pruebas\n', '5501edf1c651bea1a08623a8d2999087.jpg', 2, '2026-01-07 20:09:13'),
(12, '2026-01-10', 'mañana tengo que madrugar', 'WhatsApp Image 2025-12-27 at 3.23.56 PM.jpeg', 3, '2026-01-08 20:29:03');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `novedades_pacientes`
--

CREATE TABLE `novedades_pacientes` (
  `id` int(11) NOT NULL,
  `paciente_id` int(11) NOT NULL,
  `tipo_novedad` varchar(100) NOT NULL,
  `descripcion` text NOT NULL,
  `fecha` date NOT NULL,
  `evidencia_foto` varchar(255) DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `novedades_pacientes`
--

INSERT INTO `novedades_pacientes` (`id`, `paciente_id`, `tipo_novedad`, `descripcion`, `fecha`, `evidencia_foto`, `usuario_id`, `creado_en`) VALUES
(1, 4, 'Incidencia Médica', 'no puede caminar ', '2026-01-07', 'informe ejecutivo.docx.pdf', 3, '2026-01-07 20:02:16'),
(2, 2, 'Administrativa', 'es de prueba', '2026-01-08', NULL, 3, '2026-01-08 20:15:23'),
(3, 2, 'Cambio de Medicación', 'cambie la base de datos', '2026-01-08', NULL, 3, '2026-01-08 20:28:37');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pacientes`
--

CREATE TABLE `pacientes` (
  `id` int(11) NOT NULL,
  `cliente_id` int(11) DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `genero` enum('M','F','O') DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `direccion` text DEFAULT NULL,
  `historial_medico` text DEFAULT NULL,
  `alergias` text DEFAULT NULL,
  `contacto_emergencia` varchar(100) DEFAULT NULL,
  `tel_emergencia` varchar(20) DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pacientes`
--

INSERT INTO `pacientes` (`id`, `cliente_id`, `usuario_id`, `nombre`, `apellido`, `fecha_nacimiento`, `genero`, `telefono`, `email`, `direccion`, `historial_medico`, `alergias`, `contacto_emergencia`, `tel_emergencia`, `creado_en`) VALUES
(1, NULL, 4, 'María', 'González', '1968-05-15', 'F', '555-1234', 'maria.gonzalez@email.com', 'Calle Principal 123', NULL, NULL, NULL, NULL, '2026-01-02 19:11:10'),
(2, NULL, 7, 'Juan', 'Pérez', '1955-08-22', 'M', '555-5678', 'juan.perez@email.com', 'Avenida Central 456', NULL, NULL, NULL, NULL, '2026-01-02 19:11:10'),
(3, NULL, NULL, 'Ana', 'Rodríguez', '1972-11-30', 'F', '555-9012', 'ana.rodriguez@email.com', 'Plaza Mayor 789', NULL, NULL, NULL, NULL, '2026-01-02 19:11:10'),
(4, NULL, NULL, 'Carlos', 'Sánchez', '1960-03-10', 'M', '555-3456', 'carlos.sanchez@email.com', 'Boulevard Norte 101', NULL, NULL, NULL, NULL, '2026-01-02 19:11:10');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pruebas_medicas`
--

CREATE TABLE `pruebas_medicas` (
  `id` int(11) NOT NULL,
  `paciente_id` int(11) DEFAULT NULL,
  `cliente_id` int(11) DEFAULT NULL,
  `nombre_paciente` varchar(100) NOT NULL,
  `tipo_prueba` varchar(100) NOT NULL,
  `descripcion` text NOT NULL,
  `resultado` text DEFAULT NULL,
  `fecha_prueba` date NOT NULL,
  `fecha_resultado` date DEFAULT NULL,
  `estado` enum('pendiente','completada','cancelada') DEFAULT 'pendiente',
  `enfermera_id` int(11) NOT NULL,
  `observaciones` text DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pruebas_medicas`
--

INSERT INTO `pruebas_medicas` (`id`, `paciente_id`, `cliente_id`, `nombre_paciente`, `tipo_prueba`, `descripcion`, `resultado`, `fecha_prueba`, `fecha_resultado`, `estado`, `enfermera_id`, `observaciones`, `creado_en`, `actualizado_en`) VALUES
(1, 1, NULL, 'María González', 'glucemia', 'Prueba de glucemia en ayunas', '95 mg/dL (Normal)', '2023-06-10', '2023-06-10', 'completada', 2, 'Paciente en ayunas por 8 horas', '2026-01-02 19:11:10', '2026-01-02 19:11:10'),
(2, 2, NULL, 'Juan Pérez', 'presión arterial', 'Control de presión arterial', '120/80 mmHg (Normal)', '2023-06-12', '2023-06-12', 'completada', 2, 'Medición tomada en reposo', '2026-01-02 19:11:10', '2026-01-02 19:11:10'),
(3, 3, NULL, 'Ana Rodríguez', 'COVID-19', 'Prueba PCR para COVID-19', NULL, '2023-06-14', NULL, 'pendiente', 2, 'Muestra enviada al laboratorio', '2026-01-02 19:11:10', '2026-01-02 19:11:10'),
(4, 4, NULL, 'Carlos Sánchez', 'alergias', 'Prueba de alergias cutáneas', NULL, '2023-06-16', NULL, 'pendiente', 2, 'Preparar antígenos específicos', '2026-01-02 19:11:10', '2026-01-02 19:11:10');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(150) DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `nombre`, `descripcion`, `creado_en`) VALUES
(1, 'ADMIN', 'Administrador del sistema', '2025-12-30 21:55:15'),
(2, 'ENFERMERA', 'Personal de enfermería', '2025-12-30 21:55:15'),
(3, 'RECEPCIONISTA', 'Recepción y gestión de solicitudes', '2025-12-30 21:55:15'),
(4, 'USUARIOS', 'Usuarios', '2026-01-06 15:10:46');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudes`
--

CREATE TABLE `solicitudes` (
  `id` int(11) NOT NULL,
  `cliente_id` int(11) DEFAULT NULL,
  `nombre_contacto` varchar(100) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `nombre_paciente` varchar(100) NOT NULL,
  `edad_paciente` int(11) NOT NULL,
  `tipo_servicio` varchar(100) NOT NULL,
  `urgencia` varchar(20) NOT NULL,
  `description` text NOT NULL,
  `estado` varchar(20) DEFAULT 'pendiente',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `solicitudes`
--

INSERT INTO `solicitudes` (`id`, `cliente_id`, `nombre_contacto`, `telefono`, `email`, `nombre_paciente`, `edad_paciente`, `tipo_servicio`, `urgencia`, `description`, `estado`, `fecha_creacion`) VALUES
(1, NULL, 'jhoantan', '555-1234', 'ccl.ticlopez@gmail.com', 'valentina', 55, 'Cuidado Básico', 'Normal', 'hhhhhhhhhhhhhhhhhhhhhhhhhhhh', 'pendiente', '2025-12-31 17:22:46'),
(2, NULL, 'julian', '3214738869', 'ccl.ticlopez@gmail.com', 'jhonatan', 55, 'Recuperación Postoperatoria', 'Normal', 'dasdadsasdasdasd', 'pendiente', '2026-01-02 15:02:07'),
(3, NULL, 'ra', '123456789+', 'ccl.ticlopez@gmail.com', 'jhonatan', 55, 'Enfermería Especializada', 'Normal', 'fsdfsdfsdfsdf', 'pendiente', '2026-01-02 15:29:18'),
(4, NULL, 'rarararra', '987654321', 'sistemas@tenjoculturayturismo.gov.co', 'aaddada', 99, 'Cuidado Básico', 'Urgente', 'adasdadasdadsasd', 'pendiente', '2026-01-02 15:34:39'),
(5, NULL, 'julian', '3214738869', 'ccl.ticlopez@gmail.com', 'jhonatan', 55, 'Enfermería Especializada', 'Urgente', 'asssssssssssssssssssssssssssssssssssssssss', 'pendiente', '2026-01-02 18:48:37'),
(6, NULL, 'Juan Pérez Test', '3214738869', 'ccl.ticlopez@gmail.com', 'valentina', 99, 'Enfermería Especializada', 'Urgente', 'DFSDFSDFSFSFD', 'pendiente', '2026-01-06 15:20:01'),
(7, NULL, 'Juan Pérez Testaaaaaaaaaaaaaaa', '1234567890', 'sistemas@tenjoculturayturismo.gov.co', 'Ana Pérez', -88, 'Enfermería Especializada', 'Urgente', 'asdasdasdasd', 'pendiente', '2026-01-06 16:04:41'),
(8, NULL, 'julian', '3214738869', 'ccl.ticlopez@gmail.com', 'jhonatan', 55, 'Cuidado Básico', 'Urgente', 'zzzzzzzzzzzzzzzzzzzz', 'pendiente', '2026-01-08 18:54:16'),
(9, NULL, 'julian', '3214738869', 'ccl.ticlopez@gmail.com', 'jhonatan', 55, 'Cuidado Básico', 'Urgente', 'fghfghfghfghfghfghfghmuyumyymymmymymymymymymasdadadsadasdadsadadasdasdasdasdasdasdasdasdasdasdadfghfghfghfhfhfhfhgfghfghfgh', 'pendiente', '2026-01-08 20:10:49'),
(10, NULL, 'julian', '3214738869', 'ccl.ticlopez@gmail.com', 'jhonatan', 55, 'Enfermería Especializada', 'Normal', 'es prueba funcional ', 'pendiente', '2026-01-08 20:27:13');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turnos_enfermera`
--

CREATE TABLE `turnos_enfermera` (
  `id` int(11) NOT NULL,
  `enfermera_id` int(11) NOT NULL,
  `cliente_id` int(11) DEFAULT NULL,
  `fecha` date NOT NULL,
  `turno` enum('matutino','vespertino','nocturno') NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `ubicacion` varchar(200) NOT NULL,
  `asistio` tinyint(1) DEFAULT 0,
  `hora_entrada` time DEFAULT NULL,
  `hora_salida` time DEFAULT NULL,
  `evidencia_foto` varchar(255) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `turnos_enfermera`
--

INSERT INTO `turnos_enfermera` (`id`, `enfermera_id`, `cliente_id`, `fecha`, `turno`, `hora_inicio`, `hora_fin`, `ubicacion`, `asistio`, `hora_entrada`, `hora_salida`, `evidencia_foto`, `observaciones`, `creado_en`) VALUES
(1, 2, NULL, '2023-06-02', 'matutino', '08:00:00', '16:00:00', 'Hospital Central - Piso 3', 1, '08:05:00', '15:55:00', 'evidencia_20230602.jpg', 'Turno matutino completo', '2026-01-02 19:11:10'),
(2, 2, NULL, '2023-06-05', 'vespertino', '16:00:00', '00:00:00', 'Clínica Norte', 1, '16:10:00', '23:50:00', NULL, 'Turno normal', '2026-01-02 19:11:10'),
(3, 2, NULL, '2023-06-06', 'matutino', '08:00:00', '16:00:00', 'Hospital Central - Piso 3', 1, '08:00:00', '16:00:00', 'evidencia_20230606.jpg', 'Revisión de pacientes', '2026-01-02 19:11:10'),
(4, 2, NULL, '2023-06-07', 'matutino', '08:00:00', '16:00:00', 'Hospital Central - Piso 3', 0, NULL, NULL, NULL, NULL, '2026-01-02 19:11:10'),
(5, 2, NULL, '2026-01-02', 'matutino', '08:00:00', '16:00:00', 'Hospital Central - Piso 3', 0, NULL, NULL, NULL, 'Turno de hoy', '2026-01-02 19:11:10');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL DEFAULT '',
  `email` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` text DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `genero` enum('M','F','O') DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `rol_id` int(11) NOT NULL,
  `especialidad` varchar(100) DEFAULT NULL,
  `numero_licencia` varchar(50) DEFAULT NULL,
  `fecha_contratacion` date DEFAULT NULL,
  `ultimo_acceso` timestamp NULL DEFAULT NULL,
  `token_reset_password` varchar(255) DEFAULT NULL,
  `token_expira` timestamp NULL DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `usuario`, `nombre`, `apellido`, `email`, `telefono`, `direccion`, `fecha_nacimiento`, `genero`, `password`, `rol_id`, `especialidad`, `numero_licencia`, `fecha_contratacion`, `ultimo_acceso`, `token_reset_password`, `token_expira`, `activo`, `creado_en`, `actualizado_en`) VALUES
(1, 'admin', 'lopez', 'Administrador', 'admin@enfermeracorazon.com', '555-0001', NULL, NULL, NULL, 'c5a1a98649a7874de0def093eb136262', 1, NULL, NULL, NULL, '2026-01-06 15:54:47', NULL, NULL, 1, '2025-12-30 21:57:14', '2026-01-06 15:54:47'),
(2, 'enfermera1', 'Laura Gómez', 'Gómez', 'laura.gomez@enfermeracorazon.com', '555-0002', NULL, NULL, NULL, 'c5a1a98649a7874de0def093eb136262', 2, 'Enfermería General', 'ENF001', '2023-02-20', NULL, NULL, NULL, 1, '2025-12-30 21:57:14', '2026-01-06 15:31:54'),
(3, 'recepcion', 'Carlos Pérez', 'Pérez', 'carlos.perez@enfermeracorazon.com', '555-0003', NULL, NULL, NULL, 'c5a1a98649a7874de0def093eb136262', 3, NULL, NULL, '2023-01-15', NULL, NULL, NULL, 1, '2025-12-30 21:57:14', '2026-01-07 19:37:54'),
(4, '1078371526', 'jhonatan lopez', 'López', 'jhonatan.lopez@email.com', '321-473-8869', NULL, NULL, NULL, '25f9e794323b453885f5181f1b624d0b', 4, 'Usuario Registrado', NULL, NULL, NULL, NULL, NULL, 1, '2026-01-02 15:35:10', '2026-01-06 15:31:54'),
(5, 'enfermera2', 'María', 'García', 'maria.garcia@enfermeracorazon.com', '555-0004', NULL, NULL, NULL, 'c5a1a98649a7874de0def093eb136262', 2, 'Pediatría', 'ENF002', '2023-03-10', NULL, NULL, NULL, 1, '2026-01-06 15:31:54', '2026-01-06 15:31:54'),
(6, 'enfermera3', 'Ana', 'López', 'ana.lopez@enfermeracorazon.com', '555-0005', NULL, NULL, NULL, 'c5a1a98649a7874de0def093eb136262', 2, 'Geriatría', 'ENF003', '2023-04-15', NULL, NULL, NULL, 1, '2026-01-06 15:31:54', '2026-01-06 15:31:54'),
(7, 'JHONATAN', 'LOPEZ', 'GONZALEZ', 'ccl.ticlopez@gmail.com', '3122734752', 'cra 3 #8-80', '2018-01-02', NULL, '25f9e794323b453885f5181f1b624d0b', 4, 'aaaaaaaa', '1078371526', '2025-01-21', NULL, 'aaaaaaaaaaaa', NULL, 1, '2026-01-06 15:34:48', '2026-01-06 20:01:27'),
(22, 'admin lopez', 'JHONATAN', 'LOPEZ', 'ccl.ticlopez11@gmail.com', '3122734752', 'km 1 via tenjo la punta', '2000-03-13', 'M', '25f9e794323b453885f5181f1b624d0b', 3, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-01-06 18:10:18', '2026-01-06 18:10:18'),
(23, 'adminaa lopez', 'ricardo', 'LOPEZ', 'ccl.ticlopez33@gmail.com', '3122734752', 'Cra 3 880', '1999-03-13', 'F', '25f9e794323b453885f5181f1b624d0b', 2, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2026-01-06 19:35:49', '2026-01-06 19:35:49'),
(24, 'admin lopez222', 'JHONATAN ricardo', 'LOPEZ', 'ccl.333ticlopez@gmail.com', '3122734752', 'Cra 3 880', '2000-12-31', 'F', '25f9e794323b453885f5181f1b624d0b', 2, NULL, NULL, NULL, NULL, NULL, NULL, 0, '2026-01-06 19:37:58', '2026-01-07 19:06:19');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `calificaciones`
--
ALTER TABLE `calificaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `enfermera_id` (`enfermera_id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `fk_calificaciones_clientes` (`cliente_id`);

--
-- Indices de la tabla `calificaciones_enfermera`
--
ALTER TABLE `calificaciones_enfermera`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_calificacion` (`cliente_id`,`enfermera_id`,`solicitud_id`),
  ADD KEY `enfermera_id` (`enfermera_id`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_clientes_usuario` (`usuario_id`);

--
-- Indices de la tabla `enfermeras`
--
ALTER TABLE `enfermeras`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_enfermera_usuario` (`usuario_id`),
  ADD KEY `fk_enfermeras_usuario` (`usuario_id`);

--
-- Indices de la tabla `novedades_calendario`
--
ALTER TABLE `novedades_calendario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `novedades_pacientes`
--
ALTER TABLE `novedades_pacientes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `paciente_id` (`paciente_id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_pacientes_clientes` (`cliente_id`),
  ADD KEY `fk_pacientes_usuario` (`usuario_id`);

--
-- Indices de la tabla `pruebas_medicas`
--
ALTER TABLE `pruebas_medicas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_pruebas_enfermera` (`enfermera_id`),
  ADD KEY `fk_pruebas_medicas_clientes` (`cliente_id`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_solicitudes_clientes` (`cliente_id`);

--
-- Indices de la tabla `turnos_enfermera`
--
ALTER TABLE `turnos_enfermera`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_turno_enfermera` (`enfermera_id`,`fecha`,`turno`),
  ADD KEY `idx_fecha` (`fecha`),
  ADD KEY `idx_enfermera_fecha` (`enfermera_id`,`fecha`),
  ADD KEY `fk_turnos_enfermera_clientes` (`cliente_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuario` (`usuario`),
  ADD KEY `fk_usuarios_roles` (`rol_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `calificaciones`
--
ALTER TABLE `calificaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `calificaciones_enfermera`
--
ALTER TABLE `calificaciones_enfermera`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `enfermeras`
--
ALTER TABLE `enfermeras`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `novedades_calendario`
--
ALTER TABLE `novedades_calendario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `novedades_pacientes`
--
ALTER TABLE `novedades_pacientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `pruebas_medicas`
--
ALTER TABLE `pruebas_medicas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `turnos_enfermera`
--
ALTER TABLE `turnos_enfermera`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `calificaciones`
--
ALTER TABLE `calificaciones`
  ADD CONSTRAINT `calificaciones_ibfk_1` FOREIGN KEY (`enfermera_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `calificaciones_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `fk_calificaciones_clientes` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `calificaciones_enfermera`
--
ALTER TABLE `calificaciones_enfermera`
  ADD CONSTRAINT `calificaciones_enfermera_ibfk_1` FOREIGN KEY (`enfermera_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_calificaciones_enfermera_clientes` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD CONSTRAINT `fk_clientes_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `enfermeras`
--
ALTER TABLE `enfermeras`
  ADD CONSTRAINT `fk_enfermeras_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `novedades_calendario`
--
ALTER TABLE `novedades_calendario`
  ADD CONSTRAINT `novedades_calendario_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `novedades_pacientes`
--
ALTER TABLE `novedades_pacientes`
  ADD CONSTRAINT `novedades_pacientes_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`),
  ADD CONSTRAINT `novedades_pacientes_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD CONSTRAINT `fk_pacientes_clientes` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_pacientes_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `pruebas_medicas`
--
ALTER TABLE `pruebas_medicas`
  ADD CONSTRAINT `fk_pruebas_enfermera` FOREIGN KEY (`enfermera_id`) REFERENCES `usuarios` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_pruebas_medicas_clientes` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  ADD CONSTRAINT `fk_solicitudes_clientes` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `turnos_enfermera`
--
ALTER TABLE `turnos_enfermera`
  ADD CONSTRAINT `fk_turnos_enfermera` FOREIGN KEY (`enfermera_id`) REFERENCES `usuarios` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_turnos_enfermera_clientes` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_usuarios_roles` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
