const express = require('express');
const router = express.Router();
const novedadController = require('../controllers/novedad.controller');

// Obtener todas las novedades
router.get('/', novedadController.getAll);

// Crear nueva novedad
router.post('/', novedadController.create);

// Actualizar novedad
router.put('/:id', novedadController.update);

// Eliminar novedad
router.delete('/:id', novedadController.delete);

module.exports = router;