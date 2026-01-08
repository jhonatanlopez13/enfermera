const express = require('express');
const router = express.Router();
const novedadPacienteController = require('../controllers/novedadPaciente.controller');
const upload = require('../middlewares/upload');

router.get('/', novedadPacienteController.getAll);
router.post('/', upload.single('evidencia_foto'), novedadPacienteController.create);

module.exports = router;
