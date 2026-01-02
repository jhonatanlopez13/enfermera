const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../config/database');

// Configurar multer para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/evidencias/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'evidencia_' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten imágenes (JPEG, JPG, PNG)'));
  }
});

// Obtener pruebas médicas de la enfermera
router.get('/pruebas', async (req, res) => {
  try {
    const { enfermeraId } = req.query;
    const query = `
      SELECT p.*, 
             CONCAT(pac.nombre, ' ', pac.apellido) as paciente_completo
      FROM pruebas_medicas p
      LEFT JOIN pacientes pac ON p.paciente_id = pac.id
      WHERE p.enfermera_id = ?
      ORDER BY p.fecha_prueba DESC
    `;
    const [pruebas] = await db.execute(query, [enfermeraId]);
    res.json(pruebas);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener pruebas' });
  }
});

// Crear nueva prueba
router.post('/pruebas', async (req, res) => {
  try {
    const {
      paciente_id,
      nombre_paciente,
      tipo_prueba,
      descripcion,
      fecha_prueba,
      observaciones,
      enfermera_id
    } = req.body;

    const query = `
      INSERT INTO pruebas_medicas 
      (paciente_id, nombre_paciente, tipo_prueba, descripcion, fecha_prueba, observaciones, enfermera_id, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pendiente')
    `;

    const [result] = await db.execute(query, [
      paciente_id,
      nombre_paciente,
      tipo_prueba,
      descripcion,
      fecha_prueba,
      observaciones,
      enfermera_id
    ]);

    res.json({
      id: result.insertId,
      message: 'Prueba creada exitosamente'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al crear prueba' });
  }
});

// Actualizar prueba
router.put('/pruebas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { resultado, estado, observaciones } = req.body;

    const query = `
      UPDATE pruebas_medicas 
      SET resultado = ?, estado = ?, observaciones = ?, fecha_resultado = ?
      WHERE id = ?
    `;

    await db.execute(query, [
      resultado,
      estado,
      observaciones,
      estado === 'completada' ? new Date().toISOString().split('T')[0] : null,
      id
    ]);

    res.json({ message: 'Prueba actualizada exitosamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al actualizar prueba' });
  }
});

// Obtener turnos del mes
router.get('/turnos', async (req, res) => {
  try {
    const { enfermeraId, year, month } = req.query;

    const query = `
      SELECT * FROM turnos_enfermera 
      WHERE enfermera_id = ? 
        AND YEAR(fecha) = ? 
        AND MONTH(fecha) = ?
      ORDER BY fecha, hora_inicio
    `;

    const [turnos] = await db.execute(query, [enfermeraId, year, month]);
    res.json(turnos);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener turnos' });
  }
});

// Registrar asistencia
router.post('/turnos/:id/asistencia', upload.single('evidencia_foto'), async (req, res) => {
  try {
    const { id } = req.params;
    const { hora_entrada, hora_salida, observaciones } = req.body;
    const evidencia_foto = req.file ? req.file.filename : null;

    const query = `
      UPDATE turnos_enfermera 
      SET asistio = 1, 
          hora_entrada = ?,
          hora_salida = ?,
          evidencia_foto = ?,
          observaciones = ?
      WHERE id = ?
    `;

    await db.execute(query, [
      hora_entrada,
      hora_salida,
      evidencia_foto,
      observaciones,
      id
    ]);

    res.json({
      message: 'Asistencia registrada exitosamente',
      evidencia_foto
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al registrar asistencia' });
  }
});

// Obtener pacientes
router.get('/pacientes', async (req, res) => {
  try {
    const [pacientes] = await db.execute(`
      SELECT id, CONCAT(nombre, ' ', apellido) as nombre_completo 
      FROM pacientes 
      ORDER BY nombre, apellido
    `);
    res.json(pacientes);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener pacientes' });
  }
});

// Obtener estadísticas
router.get('/estadisticas', async (req, res) => {
  try {
    const { enfermeraId } = req.query;

    const [stats] = await db.execute(`
      SELECT 
        COUNT(*) as total_pruebas,
        SUM(CASE WHEN estado = 'completada' THEN 1 ELSE 0 END) as pruebas_completadas,
        SUM(CASE WHEN estado = 'pendiente' THEN 1 ELSE 0 END) as pruebas_pendientes,
        (SELECT COUNT(*) FROM turnos_enfermera 
         WHERE enfermera_id = ? AND asistio = 1 AND MONTH(fecha) = MONTH(CURRENT_DATE())) as turnos_este_mes
      FROM pruebas_medicas 
      WHERE enfermera_id = ?
    `, [enfermeraId, enfermeraId]);

    res.json(stats[0] || {});
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

module.exports = router;