// routes/users.routes.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const authJwt = require('../middlewares/authJwt');

// Middleware para verificar token en todas las rutas
router.use(authJwt.verifyToken);

// Rutas para todos los usuarios autenticados
router.get('/profile/:id', usersController.getUserProfile);

// Rutas solo para administradores
router.get('/all',
  authJwt.isAdmin,
  usersController.getAllUsers
);

router.put('/:id/status',
  authJwt.isAdmin,
  usersController.updateUserStatus
);

module.exports = router;