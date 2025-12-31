// middlewares/verifySignUp.js
const db = require('../db');

const checkDuplicateUsernameOrEmail = (req, res, next) => {
  const { usuario } = req.body;

  // Verificar si el usuario ya existe
  const query = 'SELECT id FROM usuarios WHERE usuario = ?';

  db.query(query, [usuario], (err, results) => {
    if (err) {
      console.error('Error al verificar usuario:', err);
      return res.status(500).json({
        success: false,
        message: 'Error en la base de datos'
      });
    }

    if (results.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'El nombre de usuario ya está en uso'
      });
    }

    next();
  });
};

const checkRolesExisted = (req, res, next) => {
  const { rol_id } = req.body;

  if (rol_id) {
    const query = 'SELECT id FROM roles WHERE id = ?';

    db.query(query, [rol_id], (err, results) => {
      if (err) {
        console.error('Error al verificar rol:', err);
        return res.status(500).json({
          success: false,
          message: 'Error en la base de datos'
        });
      }

      if (results.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'El rol especificado no existe'
        });
      }

      next();
    });
  } else {
    next();
  }
};

module.exports = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};