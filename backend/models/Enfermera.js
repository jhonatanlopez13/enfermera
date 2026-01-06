// models/Enfermera.js
const db = require('../db');
const crypto = require('crypto');

const Enfermera = {
    /**
     * Crear una nueva enfermera
     * @param {Object} enfermeraData - Datos de la enfermera
     * @returns {Promise} Resultado de la inserción
     */
    create: (enfermeraData) => {
        const {
            usuario,
            nombre,
            apellido,
            email,
            telefono,
            direccion,
            fecha_nacimiento,
            genero,
            password
        } = enfermeraData;

        // Hashear contraseña con MD5 (mantener consistencia con el sistema actual)
        const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

        return new Promise((resolve, reject) => {
            const query = `
        INSERT INTO usuarios (
          usuario, nombre, apellido, email, telefono, direccion,
          fecha_nacimiento, genero, password, rol_id, activo, creado_en
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 2, 1, NOW())
      `;

            const values = [
                usuario,
                nombre,
                apellido,
                email,
                telefono || null,
                direccion || null,
                fecha_nacimiento || null,
                genero || null,
                hashedPassword
            ];

            db.query(query, values, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },

    /**
     * Verificar si un usuario o email ya existe
     * @param {string} usuario - Nombre de usuario
     * @param {string} email - Email
     * @returns {Promise} Usuario encontrado o null
     */
    checkExisting: (usuario, email) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT id, usuario, email FROM usuarios WHERE usuario = ? OR email = ?';

            db.query(query, [usuario, email], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results.length > 0 ? results[0] : null);
                }
            });
        });
    },

    /**
     * Obtener enfermera por ID con información del rol
     * @param {number} id - ID de la enfermera
     * @returns {Promise} Datos de la enfermera
     */
    findById: (id) => {
        return new Promise((resolve, reject) => {
            const query = `
        SELECT 
          u.id,
          u.usuario,
          u.nombre,
          u.apellido,
          u.email,
          u.telefono,
          u.direccion,
          u.fecha_nacimiento,
          u.genero,
          u.activo,
          u.creado_en,
          r.id as rol_id,
          r.nombre as rol_nombre,
          r.descripcion as rol_descripcion
        FROM usuarios u
        LEFT JOIN roles r ON u.rol_id = r.id
        WHERE u.id = ? AND u.rol_id = 2
      `;

            db.query(query, [id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results[0] || null);
                }
            });
        });
    },

    /**
     * Obtener todas las enfermeras activas
     * @returns {Promise} Lista de enfermeras
     */
    findAll: () => {
        return new Promise((resolve, reject) => {
            const query = `
        SELECT 
          u.id,
          u.usuario,
          u.nombre,
          u.apellido,
          u.email,
          u.telefono,
          u.direccion,
          u.fecha_nacimiento,
          u.genero,
          u.activo,
          u.creado_en,
          r.nombre as rol_nombre
        FROM usuarios u
        LEFT JOIN roles r ON u.rol_id = r.id
        WHERE u.rol_id = 2 AND u.activo = 1
        ORDER BY u.creado_en DESC
      `;

            db.query(query, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    },

    /**
     * Actualizar datos de enfermera
     * @param {number} id - ID de la enfermera
     * @param {Object} updateData - Datos a actualizar
     * @returns {Promise} Resultado de la actualización
     */
    update: (id, updateData) => {
        const {
            nombre,
            apellido,
            email,
            telefono,
            direccion,
            fecha_nacimiento,
            genero
        } = updateData;

        return new Promise((resolve, reject) => {
            const query = `
        UPDATE usuarios 
        SET nombre = ?, apellido = ?, email = ?, telefono = ?, 
            direccion = ?, fecha_nacimiento = ?, genero = ?
        WHERE id = ? AND rol_id = 2
      `;

            const values = [
                nombre,
                apellido,
                email,
                telefono || null,
                direccion || null,
                fecha_nacimiento || null,
                genero || null,
                id
            ];

            db.query(query, values, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },

    /**
     * Desactivar enfermera (soft delete)
     * @param {number} id - ID de la enfermera
     * @returns {Promise} Resultado de la desactivación
     */
    deactivate: (id) => {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE usuarios SET activo = 0 WHERE id = ? AND rol_id = 2';

            db.query(query, [id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },

    /**
     * Obtener estadísticas de una enfermera
     * @param {number} enfermeraId - ID de la enfermera
     * @returns {Promise} Estadísticas
     */
    getStats: (enfermeraId) => {
        return new Promise((resolve, reject) => {
            const query = `
        SELECT 
          COUNT(*) as total_pruebas,
          SUM(CASE WHEN estado = 'completada' THEN 1 ELSE 0 END) as pruebas_completadas,
          SUM(CASE WHEN estado = 'pendiente' THEN 1 ELSE 0 END) as pruebas_pendientes,
          (SELECT COUNT(*) FROM turnos_enfermera 
           WHERE enfermera_id = ? AND asistio = 1 AND MONTH(fecha) = MONTH(CURRENT_DATE())) as turnos_este_mes
        FROM pruebas_medicas 
        WHERE enfermera_id = ?
      `;

            db.query(query, [enfermeraId, enfermeraId], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results[0] || {});
                }
            });
        });
    }
};

module.exports = Enfermera;
