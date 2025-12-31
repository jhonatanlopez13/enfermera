// middlewares/authJwt.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(403).json({ 
      success: false,
      message: 'No se proporcionó token de autenticación' 
    });
  }

  // Eliminar "Bearer " del token si está presente
  const tokenWithoutBearer = token.startsWith('Bearer ') ? token.slice(7) : token;
  
  jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET || 'secret-key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ 
        success: false,
        message: 'Token inválido o expirado' 
      });
    }
    req.userId = decoded.id;
    req.userRole = decoded.rol_nombre;
    req.userData = decoded;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.userRole !== 'ADMIN') {
    return res.status(403).json({ 
      success: false,
      message: 'Se requiere rol de ADMINISTRADOR' 
    });
  }
  next();
};

const isEnfermera = (req, res, next) => {
  if (req.userRole !== 'ENFERMERA') {
    return res.status(403).json({ 
      success: false,
      message: 'Se requiere rol de ENFERMERA' 
    });
  }
  next();
};

const isRecepcionista = (req, res, next) => {
  if (req.userRole !== 'RECEPCIONISTA') {
    return res.status(403).json({ 
      success: false,
      message: 'Se requiere rol de RECEPCIONISTA' 
    });
  }
  next();
};

module.exports = {
  verifyToken,
  isAdmin,
  isEnfermera,
  isRecepcionista
};