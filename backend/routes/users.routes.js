const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const authJwt = require('../middlewares/authJwt');

// Ruta PÚBLICA para registro (ya tenemos en auth.routes)
// router.post('/register', usersController.createUser);

// Rutas protegidas (requieren autenticación)
router.get('/all', authJwt.verifyToken, usersController.getAllUsers);
router.get('/profile/:id', authJwt.verifyToken, usersController.getUserProfile);
router.put('/:id/status', [authJwt.verifyToken, authJwt.isAdmin], usersController.updateUserStatus);
router.put('/:id', authJwt.verifyToken, usersController.updateUser);

module.exports = router;