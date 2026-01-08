const express = require('express');
const router = express.Router();
const pruebaMedicaController = require('../controllers/pruebaMedica.controller');

router.get('/', pruebaMedicaController.getAllByEnfermera);
router.post('/', pruebaMedicaController.create);
router.put('/:id', pruebaMedicaController.update);
router.delete('/:id', pruebaMedicaController.delete);

module.exports = router;
