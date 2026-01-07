const db = require('../db');

const Novedad = {
    getAll: () => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT n.*, u.nombre AS usuario_nombre, u.apellido AS usuario_apellido
                FROM novedades_calendario n
                LEFT JOIN usuarios u ON n.usuario_id = u.id
                ORDER BY n.fecha DESC, n.creado_en DESC
            `;

            db.query(query, (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    },

    create: (novedadData) => {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO novedades_calendario 
                (fecha, nota, usuario_id, evidencia_foto) 
                VALUES (?, ?, ?, ?)
            `;
            const params = [
                novedadData.fecha,
                novedadData.nota,
                novedadData.usuario_id,
                novedadData.evidencia_foto || null
            ];

            db.query(query, params, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    },

    update: (id, novedadData) => {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE novedades_calendario 
                SET nota = ?, evidencia_foto = ?, actualizado_en = CURRENT_TIMESTAMP
                WHERE id = ?
            `;
            const params = [
                novedadData.nota,
                novedadData.evidencia_foto,
                id
            ];

            db.query(query, params, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    },

    delete: (id) => {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM novedades_calendario WHERE id = ?';
            db.query(query, [id], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }
};

module.exports = Novedad;