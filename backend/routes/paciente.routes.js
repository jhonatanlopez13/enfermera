// routes/paciente.routes.js
const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/paciente.controller');

router.get('/', pacienteController.getAll);

module.exports = router;
