const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).json({
      success: false,
      message: 'No se proporcionó token de autenticación'
    });
  }

  // Verificar que el header tenga el formato correcto
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(403).json({
      success: false,
      message: 'Formato de token inválido'
    });
  }

  const token = parts[1];

  jwt.verify(token, process.env.JWT_SECRET || 'secret-key', (err, decoded) => {
    if (err) {
      console.error('Error verificando token:', err.message);
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }
    req.userId = decoded.id || decoded.userId;
    req.userRole = decoded.rol || decoded.rol_nombre;
    req.userData = decoded;
    next();
  });
};

// Eliminar funciones isAdmin, isEnfermera, isRecepcionista que no se usan
module.exports = {
  verifyToken
};