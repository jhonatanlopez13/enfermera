// models/User.js
const db = require('../db');
const bcrypt = require('bcryptjs');

const User = {
  create: async (userData) => {
    const { usuario, nombre, password, rol_id = 3 } = userData; // rol_id 3 = RECEPCIONISTA por defecto

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO usuarios (usuario, nombre, password, rol_id, activo) VALUES (?, ?, ?, ?, 1)';
      db.query(query, [usuario, nombre, hashedPassword, rol_id], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  },

  findByUsuario: (usuario) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT u.*, r.nombre as rol_nombre, r.descripcion as rol_descripcion 
        FROM usuarios u 
        JOIN roles r ON u.rol_id = r.id 
        WHERE u.usuario = ? AND u.activo = 1
      `;
      db.query(query, [usuario], (err, results) => {
        if (err) reject(err);
        resolve(results[0]);
      });
    });
  },

  findByEmail: (email) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT u.*, r.nombre as rol_nombre, r.descripcion as rol_descripcion 
        FROM usuarios u 
        JOIN roles r ON u.rol_id = r.id 
        WHERE u.usuario = ? AND u.activo = 1
      `;
      db.query(query, [email], (err, results) => {
        if (err) reject(err);
        resolve(results[0]);
      });
    });
  },

  findById: (id) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT u.*, r.nombre as rol_nombre, r.descripcion as rol_descripcion 
        FROM usuarios u 
        JOIN roles r ON u.rol_id = r.id 
        WHERE u.id = ? AND u.activo = 1
      `;
      db.query(query, [id], (err, results) => {
        if (err) reject(err);
        resolve(results[0]);
      });
    });
  },

  checkPassword: async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
  },

  getAllUsers: () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          u.id, 
          u.usuario, 
          u.nombre, 
          u.activo, 
          u.creado_en,
          r.nombre as rol_nombre,
          r.descripcion as rol_descripcion
        FROM usuarios u 
        JOIN roles r ON u.rol_id = r.id
        ORDER BY u.creado_en DESC
      `;
      db.query(query, (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  }
};

module.exports = User;