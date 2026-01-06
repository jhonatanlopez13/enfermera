// // routes/enfermera.routes.js
// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const path = require('path');
// const db = require('../db');

// // Importar controlador y middlewares
// const enfermeraController = require('../controllers/enfermera.controller');
// const {
//   validateEnfermeraRegistration,
//   validateEnfermeraUpdate,
//   validateEnfermeraId,
//   sanitizeEnfermeraData
// } = require('../middlewares/validateEnfermera');

// // ========== RUTAS DE GESTIÓN DE ENFERMERAS ========== //

// /**
//  * POST /api/enfermeras/register
//  * Registrar una nueva enfermera
//  * Público - No requiere autenticación
//  */
// router.post(
//   '/register',
//   sanitizeEnfermeraData,
//   validateEnfermeraRegistration,
//   enfermeraController.register
// );

// /**
//  * GET /api/enfermeras
//  * Obtener todas las enfermeras
//  * Requiere autenticación (agregar middleware cuando esté disponible)
//  */
// router.get(
//   '/',
//   enfermeraController.getAll
// );

// /**
//  * GET /api/enfermeras/:id
//  * Obtener una enfermera por ID
//  * Requiere autenticación
//  */
// router.get(
//   '/:id',
//   validateEnfermeraId,
//   enfermeraController.getById
// );

// /**
//  * PUT /api/enfermeras/:id
//  * Actualizar datos de una enfermera
//  * Requiere autenticación
//  */
// router.put(
//   '/:id',
//   validateEnfermeraId,
//   sanitizeEnfermeraData,
//   validateEnfermeraUpdate,
//   enfermeraController.update
// );

// /**
//  * DELETE /api/enfermeras/:id
//  * Desactivar una enfermera
//  * Requiere autenticación y rol de administrador
//  */
// router.delete(
//   '/:id',
//   validateEnfermeraId,
//   enfermeraController.deactivate
// );

// /**
//  * GET /api/enfermeras/:id/stats
//  * Obtener estadísticas de una enfermera
//  * Requiere autenticación
//  */
// router.get(
//   '/:id/stats',
//   validateEnfermeraId,
//   enfermeraController.getStats
// );

// // ========== RUTAS DE PRUEBAS MÉDICAS ========== //
// // (Mantener las rutas existentes para pruebas médicas)

// /**
//  * GET /api/enfermeras/pruebas
//  * Obtener pruebas médicas de la enfermera
//  */
// router.get('/pruebas', async (req, res) => {
//   try {
//     const { enfermeraId } = req.query;
//     const query = `
//       SELECT p.*, 
//              CONCAT(pac.nombre, ' ', pac.apellido) as paciente_completo
//       FROM pruebas_medicas p
//       LEFT JOIN pacientes pac ON p.paciente_id = pac.id
//       WHERE p.enfermera_id = ?
//       ORDER BY p.fecha_prueba DESC
//     `;

//     db.query(query, [enfermeraId], (err, pruebas) => {
//       if (err) {
//         console.error('Error:', err);
//         return res.status(500).json({ error: 'Error al obtener pruebas' });
//       }
//       res.json(pruebas);
//     });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Error al obtener pruebas' });
//   }
// });

// /**
//  * POST /api/enfermeras/pruebas
//  * Crear nueva prueba médica
//  */
// router.post('/pruebas', async (req, res) => {
//   try {
//     const {
//       paciente_id,
//       nombre_paciente,
//       tipo_prueba,
//       descripcion,
//       fecha_prueba,
//       observaciones,
//       enfermera_id
//     } = req.body;

//     const query = `
//       INSERT INTO pruebas_medicas 
//       (paciente_id, nombre_paciente, tipo_prueba, descripcion, fecha_prueba, observaciones, enfermera_id, estado)
//       VALUES (?, ?, ?, ?, ?, ?, ?, 'pendiente')
//     `;

//     db.query(query, [
//       paciente_id,
//       nombre_paciente,
//       tipo_prueba,
//       descripcion,
//       fecha_prueba,
//       observaciones,
//       enfermera_id
//     ], (err, result) => {
//       if (err) {
//         console.error('Error:', err);
//         return res.status(500).json({ error: 'Error al crear prueba' });
//       }
//       res.json({
//         id: result.insertId,
//         message: 'Prueba creada exitosamente'
//       });
//     });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Error al crear prueba' });
//   }
// });

// /**
//  * PUT /api/enfermeras/pruebas/:id
//  * Actualizar prueba médica
//  */
// router.put('/pruebas/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { resultado, estado, observaciones } = req.body;

//     const query = `
//       UPDATE pruebas_medicas 
//       SET resultado = ?, estado = ?, observaciones = ?, fecha_resultado = ?
//       WHERE id = ?
//     `;

//     db.query(query, [
//       resultado,
//       estado,
//       observaciones,
//       estado === 'completada' ? new Date().toISOString().split('T')[0] : null,
//       id
//     ], (err) => {
//       if (err) {
//         console.error('Error:', err);
//         return res.status(500).json({ error: 'Error al actualizar prueba' });
//       }
//       res.json({ message: 'Prueba actualizada exitosamente' });
//     });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Error al actualizar prueba' });
//   }
// });

// // ========== RUTAS DE TURNOS ========== //

// // Configurar multer para subir imágenes de evidencia
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/evidencias/');
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, 'evidencia_' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
//   fileFilter: (req, file, cb) => {
//     const filetypes = /jpeg|jpg|png/;
//     const mimetype = filetypes.test(file.mimetype);
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

//     if (mimetype && extname) {
//       return cb(null, true);
//     }
//     cb(new Error('Solo se permiten imágenes (JPEG, JPG, PNG)'));
//   }
// });

// /**
//  * GET /api/enfermeras/turnos
//  * Obtener turnos del mes
//  */
// router.get('/turnos', async (req, res) => {
//   try {
//     const { enfermeraId, year, month } = req.query;

//     const query = `
//       SELECT * FROM turnos_enfermera 
//       WHERE enfermera_id = ? 
//         AND YEAR(fecha) = ? 
//         AND MONTH(fecha) = ?
//       ORDER BY fecha, hora_inicio
//     `;

//     db.query(query, [enfermeraId, year, month], (err, turnos) => {
//       if (err) {
//         console.error('Error:', err);
//         return res.status(500).json({ error: 'Error al obtener turnos' });
//       }
//       res.json(turnos);
//     });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Error al obtener turnos' });
//   }
// });

// /**
//  * POST /api/enfermeras/turnos/:id/asistencia
//  * Registrar asistencia a un turno
//  */
// router.post('/turnos/:id/asistencia', upload.single('evidencia_foto'), async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { hora_entrada, hora_salida, observaciones } = req.body;
//     const evidencia_foto = req.file ? req.file.filename : null;

//     const query = `
//       UPDATE turnos_enfermera 
//       SET asistio = 1, 
//           hora_entrada = ?,
//           hora_salida = ?,
//           evidencia_foto = ?,
//           observaciones = ?
//       WHERE id = ?
//     `;

//     db.query(query, [
//       hora_entrada,
//       hora_salida,
//       evidencia_foto,
//       observaciones,
//       id
//     ], (err) => {
//       if (err) {
//         console.error('Error:', err);
//         return res.status(500).json({ error: 'Error al registrar asistencia' });
//       }
//       res.json({
//         message: 'Asistencia registrada exitosamente',
//         evidencia_foto
//       });
//     });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Error al registrar asistencia' });
//   }
// });

// // ========== RUTAS DE PACIENTES ========== //

// /**
//  * GET /api/enfermeras/pacientes
//  * Obtener lista de pacientes
//  */
// router.get('/pacientes', async (req, res) => {
//   try {
//     const query = `
//       SELECT id, CONCAT(nombre, ' ', apellido) as nombre_completo 
//       FROM pacientes 
//       ORDER BY nombre, apellido
//     `;

//     db.query(query, (err, pacientes) => {
//       if (err) {
//         console.error('Error:', err);
//         return res.status(500).json({ error: 'Error al obtener pacientes' });
//       }
//       res.json(pacientes);
//     });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Error al obtener pacientes' });
//   }
// });

// /**
//  * GET /api/enfermeras/estadisticas
//  * Obtener estadísticas de una enfermera (ruta alternativa)
//  */
// router.get('/estadisticas', async (req, res) => {
//   try {
//     const { enfermeraId } = req.query;

//     const query = `
//       SELECT 
//         COUNT(*) as total_pruebas,
//         SUM(CASE WHEN estado = 'completada' THEN 1 ELSE 0 END) as pruebas_completadas,
//         SUM(CASE WHEN estado = 'pendiente' THEN 1 ELSE 0 END) as pruebas_pendientes,
//         (SELECT COUNT(*) FROM turnos_enfermera 
//          WHERE enfermera_id = ? AND asistio = 1 AND MONTH(fecha) = MONTH(CURRENT_DATE())) as turnos_este_mes
//       FROM pruebas_medicas 
//       WHERE enfermera_id = ?
//     `;

//     db.query(query, [enfermeraId, enfermeraId], (err, stats) => {
//       if (err) {
//         console.error('Error:', err);
//         return res.status(500).json({ error: 'Error al obtener estadísticas' });
//       }
//       res.json(stats[0] || {});
//     });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Error al obtener estadísticas' });
//   }
// });

// module.exports = router;