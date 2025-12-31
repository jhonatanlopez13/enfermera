// routes/enfermera.routes.js
const express = require('express');
const router = express.Router();
const authJwt = require('../middlewares/authJwt');

// Middleware para verificar que sea enfermera
router.use(authJwt.verifyToken, authJwt.isEnfermera);

// Rutas exclusivas para enfermeras
router.get('/dashboard', (req, res) => {
  res.json({
    success: true,
    message: 'Panel de Enfermería',
    data: {
      user: req.userData,
      fecha: new Date().toISOString()
    }
  });
});

module.exports = router;