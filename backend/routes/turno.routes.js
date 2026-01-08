const express = require('express');
const router = express.Router();
const turnoController = require('../controllers/turno.controller');
const upload = require('../middlewares/upload');

// Obtener todos los turnos (con filtro por enfermera opcional)
router.get('/', turnoController.getAll);

// Crear un nuevo turno
router.post('/', turnoController.create);

// Registrar asistencia a un turno (con foto)
router.post('/:id/asistencia', upload.single('evidencia_foto'), turnoController.registerAsistencia);

// Actualizar turno
router.put('/:id', turnoController.update);

// Eliminar turno
router.delete('/:id', turnoController.delete);

module.exports = router;