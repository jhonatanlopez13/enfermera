// controllers/users.controller.js
const db = require('../db');
const bcrypt = require('bcrypt');

const usersController = {
  createUser: (req, res) => {
    const { usuario, nombre, password, rol_id } = req.body;

    // Validar campos requeridos
    if (!usuario || !nombre || !password || !rol_id) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos: usuario, nombre, password, rol_id'
      });
    }

    // Verificar si el usuario ya existe
    const checkQuery = 'SELECT id FROM usuarios WHERE usuario = ?';

    db.query(checkQuery, [usuario], async (checkErr, checkResults) => {
      if (checkErr) {
        console.error('Error al verificar usuario:', checkErr);
        return res.status(500).json({
          success: false,
          message: 'Error al verificar usuario',
          error: checkErr.message
        });
      }

      if (checkResults.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'El nombre de usuario ya existe'
        });
      }

      try {
        // Encriptar password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insertar nuevo usuario
        const insertQuery = `
          INSERT INTO usuarios (usuario, nombre, password, rol_id, activo, creado_en) 
          VALUES (?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
        `;

        db.query(insertQuery, [usuario, nombre, hashedPassword, rol_id], (insertErr, insertResult) => {
          if (insertErr) {
            console.error('Error al crear usuario:', insertErr);
            return res.status(500).json({
              success: false,
              message: 'Error al crear usuario',
              error: insertErr.message
            });
          }

          // Obtener el usuario creado con información del rol
          const getUserQuery = `
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
            WHERE u.id = ?
          `;

          db.query(getUserQuery, [insertResult.insertId], (getErr, getResults) => {
            if (getErr) {
              console.error('Error al obtener usuario creado:', getErr);
              return res.status(500).json({
                success: false,
                message: 'Usuario creado pero error al obtener datos',
                error: getErr.message
              });
            }

            res.status(201).json({
              success: true,
              data: getResults[0],
              message: 'Usuario creado exitosamente'
            });
          });
        });
      } catch (hashError) {
        console.error('Error al encriptar password:', hashError);
        return res.status(500).json({
          success: false,
          message: 'Error al procesar la contraseña'
        });
      }
    });
  },

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
  },

  // Opcional: Método para actualizar usuario completo (sin password)
  updateUser: (req, res) => {
    const { id } = req.params;
    const { usuario, nombre, rol_id } = req.body;

    if (!usuario || !nombre || !rol_id) {
      return res.status(400).json({
        success: false,
        message: 'Los campos usuario, nombre y rol_id son requeridos'
      });
    }

    // Verificar que el usuario existe
    const checkQuery = 'SELECT id FROM usuarios WHERE id = ?';

    db.query(checkQuery, [id], (checkErr, checkResults) => {
      if (checkErr) {
        console.error('Error al verificar usuario:', checkErr);
        return res.status(500).json({
          success: false,
          message: 'Error al verificar usuario'
        });
      }

      if (checkResults.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      // Verificar si el nuevo nombre de usuario ya existe en otro usuario
      const checkUsuarioQuery = 'SELECT id FROM usuarios WHERE usuario = ? AND id != ?';

      db.query(checkUsuarioQuery, [usuario, id], (usuarioErr, usuarioResults) => {
        if (usuarioErr) {
          console.error('Error al verificar nombre de usuario:', usuarioErr);
          return res.status(500).json({
            success: false,
            message: 'Error al verificar nombre de usuario'
          });
        }

        if (usuarioResults.length > 0) {
          return res.status(409).json({
            success: false,
            message: 'El nombre de usuario ya está en uso por otro usuario'
          });
        }

        // Actualizar usuario
        const updateQuery = `
          UPDATE usuarios 
          SET usuario = ?, nombre = ?, rol_id = ?, actualizado_en = CURRENT_TIMESTAMP 
          WHERE id = ?
        `;

        db.query(updateQuery, [usuario, nombre, rol_id, id], (updateErr, updateResult) => {
          if (updateErr) {
            console.error('Error al actualizar usuario:', updateErr);
            return res.status(500).json({
              success: false,
              message: 'Error al actualizar usuario',
              error: updateErr.message
            });
          }

          if (updateResult.affectedRows === 0) {
            return res.status(404).json({
              success: false,
              message: 'Usuario no encontrado'
            });
          }

          // Obtener usuario actualizado
          const getUserQuery = `
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
            WHERE u.id = ?
          `;

          db.query(getUserQuery, [id], (getErr, getResults) => {
            if (getErr) {
              console.error('Error al obtener usuario actualizado:', getErr);
              return res.status(500).json({
                success: false,
                message: 'Usuario actualizado pero error al obtener datos'
              });
            }

            res.status(200).json({
              success: true,
              data: getResults[0],
              message: 'Usuario actualizado exitosamente'
            });
          });
        });
      });
    });
  }
};

module.exports = usersController;