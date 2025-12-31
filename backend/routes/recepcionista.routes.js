// routes/recepcionista.routes.js
const express = require('express');
const router = express.Router();
const authJwt = require('../middlewares/authJwt');

// Middleware para verificar que sea recepcionista
router.use(authJwt.verifyToken, authJwt.isRecepcionista);

// Rutas exclusivas para recepcionistas
router.get('/dashboard', (req, res) => {
  res.json({
    success: true,
    message: 'Panel de Recepción',
    data: {
      user: req.userData,
      fecha: new Date().toISOString()
    }
  });
});

module.exports = router;