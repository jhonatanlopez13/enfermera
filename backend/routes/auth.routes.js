const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Ruta pública para registro
router.post('/register', authController.register);

// Ruta pública para login
router.post('/login', authController.login);

module.exports = router;