// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const verifySignUp = require('../middlewares/verifySignUp');
const authJwt = require('../middlewares/authJwt');

// Rutas públicas
router.post('/signup',
  verifySignUp.checkDuplicateUsernameOrEmail,
  verifySignUp.checkRolesExisted,
  authController.signup
);

router.post('/signin', authController.signin);
router.get('/roles', authController.getRoles);

// Rutas protegidas
router.get('/verify',
  authJwt.verifyToken,
  authController.verifyToken
);

module.exports = router;