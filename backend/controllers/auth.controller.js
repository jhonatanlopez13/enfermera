// controllers/auth.controller.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const signup = async (req, res) => {
  try {
    const { usuario, nombre, password, rol_id = 3 } = req.body;
    
    // Validaciones básicas
    if (!usuario || !nombre || !password) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son obligatorios'
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }
    
    // Crear usuario
    await User.create({ usuario, nombre, password, rol_id });
    
    res.status(201).json({ 
      success: true,
      message: 'Usuario registrado exitosamente' 
    });
  } catch (error) {
    console.error('Error en signup:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al registrar el usuario',
      error: error.message 
    });
  }
};

const signin = async (req, res) => {
  try {
    const { usuario, password } = req.body;
    
    // Validaciones básicas
    if (!usuario || !password) {
      return res.status(400).json({
        success: false,
        message: 'Usuario y contraseña son obligatorios'
      });
    }
    
    // Buscar usuario
    const user = await User.findByUsuario(usuario);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado o inactivo'
      });
    }
    
    // Verificar contraseña
    const passwordIsValid = await User.checkPassword(password, user.password);
    
    if (!passwordIsValid) {
      return res.status(401).json({
        success: false,
        message: 'Contraseña incorrecta'
      });
    }
    
    // Crear token
    const token = jwt.sign(
      { 
        id: user.id,
        usuario: user.usuario,
        nombre: user.nombre,
        rol_nombre: user.rol_nombre,
        rol_descripcion: user.rol_descripcion
      },
      process.env.JWT_SECRET || 'secret-key',
      { expiresIn: '8h' } // Token expira en 8 horas
    );
    
    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        usuario: user.usuario,
        nombre: user.nombre,
        rol_nombre: user.rol_nombre,
        rol_descripcion: user.rol_descripcion,
        activo: user.activo,
        token: token
      },
      message: 'Inicio de sesión exitoso'
    });
  } catch (error) {
    console.error('Error en signin:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

const verifyToken = (req, res) => {
  res.status(200).json({
    success: true,
    data: req.userData,
    message: 'Token válido'
  });
};

const getRoles = async (req, res) => {
  try {
    const Role = require('../models/Role');
    const roles = await Role.findAll();
    
    res.status(200).json({
      success: true,
      data: roles,
      message: 'Roles obtenidos exitosamente'
    });
  } catch (error) {
    console.error('Error al obtener roles:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener roles',
      error: error.message
    });
  }
};

module.exports = {
  signup,
  signin,
  verifyToken,
  getRoles
};