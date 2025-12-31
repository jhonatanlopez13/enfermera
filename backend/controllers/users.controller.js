// controllers/users.controller.js
const db = require('../db');

const usersController = {
  getUserProfile: (req, res) => {
    const { id } = req.params;
    const query = `
      SELECT u.*, r.nombre as rol_nombre, r.descripcion as rol_descripcion 
      FROM usuarios u 
      JOIN roles r ON u.rol_id = r.id 
      WHERE u.id = ? AND u.activo = 1
    `;

    db.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error al obtener perfil:', err);
        return res.status(500).json({
          success: false,
          message: 'Error al obtener perfil',
          error: err.message
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      const user = results[0];
      // Eliminar password del response
      delete user.password;

      res.status(200).json({
        success: true,
        data: user,
        message: 'Perfil obtenido exitosamente'
      });
    });
  },

  getAllUsers: (req, res) => {
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
      if (err) {
        console.error('Error al obtener usuarios:', err);
        return res.status(500).json({
          success: false,
          message: 'Error al obtener usuarios',
          error: err.message
        });
      }

      res.status(200).json({
        success: true,
        data: results,
        message: 'Usuarios obtenidos exitosamente'
      });
    });
  },

  updateUserStatus: (req, res) => {
    const { id } = req.params;
    const { activo } = req.body;

    if (activo === undefined) {
      return res.status(400).json({
        success: false,
        message: 'El campo "activo" es requerido'
      });
    }

    const query = 'UPDATE usuarios SET activo = ?, actualizado_en = CURRENT_TIMESTAMP WHERE id = ?';

    db.query(query, [activo ? 1 : 0, id], (err, result) => {
      if (err) {
        console.error('Error al actualizar estado:', err);
        return res.status(500).json({
          success: false,
          message: 'Error al actualizar estado del usuario'
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      res.status(200).json({
        success: true,
        message: `Usuario ${activo ? 'activado' : 'desactivado'} exitosamente`
      });
    });
  }
};

module.exports = usersController;