const express = require('express');
const router = express.Router();
const novedadController = require('../controllers/novedad.controller');
const upload = require('../middlewares/upload');

// Obtener todas las novedades
router.get('/', novedadController.getAll);

// Crear nueva novedad (con foto)
router.post('/', upload.single('evidencia_foto'), novedadController.create);

// Actualizar novedad (con foto)
router.put('/:id', upload.single('evidencia_foto'), novedadController.update);

// Eliminar novedad
router.delete('/:id', novedadController.delete);

module.exports = router;