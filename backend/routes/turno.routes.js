const express = require('express');
const router = express.Router();
const turnoController = require('../controllers/turno.controller');

// Obtener todos los turnos (con filtro por enfermera opcional)
router.get('/', turnoController.getAll);

// Crear un nuevo turno
router.post('/', turnoController.create);

// Registrar asistencia a un turno
router.post('/:id/asistencia', turnoController.registerAsistencia);

// Actualizar turno
router.put('/:id', turnoController.update);

// Eliminar turno
router.delete('/:id', turnoController.delete);

module.exports = router;