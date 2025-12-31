// routes/solicitudes.js
const express = require('express');
const router = express.Router();
const solicitudesController = require('../controllers/solicitudes.controller'); // CAMBIAR A .controller

// Rutas para solicitudes
router.get('/', solicitudesController.getAll);
router.get('/stats', solicitudesController.getStats);
router.get('/:id', solicitudesController.getById);
router.post('/', solicitudesController.create);
router.put('/:id', solicitudesController.update);
router.delete('/:id', solicitudesController.delete);
router.patch('/:id/status', solicitudesController.updateStatus);

module.exports = router;