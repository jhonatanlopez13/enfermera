// routes/admin.routes.js
const express = require('express');
const router = express.Router();
const authJwt = require('../middlewares/authJwt');

// Middleware para verificar que sea admin
router.use(authJwt.verifyToken, authJwt.isAdmin);

// Rutas exclusivas para administradores
router.get('/dashboard', (req, res) => {
  res.json({
    success: true,
    message: 'Panel de Administración',
    data: {
      user: req.userData,
      fecha: new Date().toISOString()
    }
  });
});

module.exports = router;