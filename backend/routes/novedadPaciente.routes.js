// routes/novedadPaciente.routes.js
const express = require('express');
const router = express.Router();
const novedadPacienteController = require('../controllers/novedadPaciente.controller');

router.get('/', novedadPacienteController.getAll);
router.post('/', novedadPacienteController.create);

module.exports = router;
