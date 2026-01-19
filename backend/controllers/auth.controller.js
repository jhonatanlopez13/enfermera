const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {
  // REGISTRO DE USUARIO
  register: async (req, res) => {
    const { usuario, nombre, password } = req.body;

    console.log('📝 Datos recibidos para registro:', { usuario, nombre });

    // Validaciones
    if (!usuario || !nombre || !password) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos: usuario, nombre, password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    try {
      // 1. Verificar si el usuario ya existe
      const checkQuery = 'SELECT id FROM usuarios WHERE usuario = ?';

      db.query(checkQuery, [usuario], async (checkErr, checkResults) => {
        if (checkErr) {
          console.error('❌ Error verificando usuario:', checkErr);
          return res.status(500).json({
            success: false,
            message: 'Error al verificar usuario existente'
          });
        }

        if (checkResults.length > 0) {
          return res.status(409).json({
            success: false,
            message: 'El nombre de usuario ya existe'
          });
        }

        // 2. Forzar rol_id = 4 (USUARIOS) directamente sin consultar la tabla roles
        const rol_id = 4; // ID fijo del rol USUARIOS según tu tabla

        console.log('🔄 Asignando rol_id:', rol_id, '(USUARIOS)');

        // 3. Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Insertar nuevo usuario CON rol_id = 4
        const insertQuery = `
          INSERT INTO usuarios (usuario, nombre, password, rol_id, activo, creado_en) 
          VALUES (?, ?, ?, ?, 1, NOW())
        `;

        db.query(insertQuery, [usuario, nombre, hashedPassword, rol_id], (insertErr, insertResult) => {
          if (insertErr) {
            console.error('❌ Error creando usuario:', insertErr);
            return res.status(500).json({
              success: false,
              message: 'Error al crear usuario en la base de datos',
              error: insertErr.message
            });
          }

          console.log('✅ Usuario creado con ID:', insertResult.insertId, 'y rol_id:', rol_id);

          // 5. Obtener el usuario creado con información del rol
          const getUserQuery = `
            SELECT 
              u.id, 
              u.usuario, 
              u.nombre, 
              u.activo, 
              u.creado_en,
              u.rol_id,
              r.nombre as rol_nombre,
              r.descripcion as rol_descripcion
            FROM usuarios u 
            JOIN roles r ON u.rol_id = r.id
            WHERE u.id = ?
          `;

          db.query(getUserQuery, [insertResult.insertId], (getErr, getResults) => {
            if (getErr) {
              console.error('❌ Error obteniendo usuario creado:', getErr);
              // Aún así responder con éxito, ya que el usuario se creó
              return res.status(201).json({
                success: true,
                message: 'Usuario creado exitosamente con rol USUARIOS',
                data: {
                  id: insertResult.insertId,
                  usuario: usuario,
                  nombre: nombre,
                  rol_id: rol_id,
                  rol_nombre: 'USUARIOS'
                }
              });
            }

            const user = getResults[0];

            // Verificar que el rol asignado sea USUARIOS
            console.log('📊 Usuario creado con rol:', user.rol_nombre, '(rol_id:', user.rol_id, ')');

            res.status(201).json({
              success: true,
              message: 'Usuario registrado exitosamente como USUARIO',
              data: user
            });
          });
        });
      });
    } catch (error) {
      console.error('❌ Error en registro:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // LOGIN DE USUARIO - SIN CAMBIOS
  login: async (req, res) => {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
      return res.status(400).json({
        success: false,
        message: 'Usuario y contraseña son requeridos'
      });
    }

    const query = `
      SELECT u.*, r.nombre as rol_nombre, r.descripcion as rol_descripcion
      FROM usuarios u 
      JOIN roles r ON u.rol_id = r.id 
      WHERE u.usuario = ? AND u.activo = 1
    `;

    db.query(query, [usuario], async (err, results) => {
      if (err) {
        console.error('❌ Error en login:', err);
        return res.status(500).json({
          success: false,
          message: 'Error en el servidor'
        });
      }

      if (results.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Usuario o contraseña incorrectos'
        });
      }

      const user = results[0];

      try {
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          return res.status(401).json({
            success: false,
            message: 'Usuario o contraseña incorrectos'
          });
        }

        // Eliminar password del objeto usuario
        delete user.password;

        // Crear token JWT
        const token = jwt.sign(
          {
            id: user.id,
            usuario: user.usuario,
            rol: user.rol_nombre,
            nombre: user.nombre
          },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );

        res.status(200).json({
          success: true,
          message: 'Login exitoso',
          token,
          data: user
        });
      } catch (error) {
        console.error('❌ Error comparando contraseñas:', error);
        return res.status(500).json({
          success: false,
          message: 'Error en el servidor'
        });
      }
    });
  }
};

module.exports = authController;