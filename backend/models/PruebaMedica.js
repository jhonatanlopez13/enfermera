const db = require('../db');

const PruebaMedica = {
    getAllByEnfermera: (enfermeraId) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT p.*, 
                       CONCAT(pac.nombre, ' ', pac.apellido) as paciente_completo
                FROM pruebas_medicas p
                LEFT JOIN pacientes pac ON p.paciente_id = pac.id
                WHERE p.enfermera_id = ?
                ORDER BY p.fecha_prueba DESC
            `;
            db.query(query, [enfermeraId], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    },

    create: (data) => {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO pruebas_medicas 
                (paciente_id, nombre_paciente, tipo_prueba, descripcion, fecha_prueba, observaciones, enfermera_id, estado)
                VALUES (?, ?, ?, ?, ?, ?, ?, 'pendiente')
            `;
            const values = [
                data.paciente_id,
                data.nombre_paciente,
                data.tipo_prueba,
                data.descripcion,
                data.fecha_prueba,
                data.observaciones,
                data.enfermera_id
            ];
            db.query(query, values, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    update: (id, data) => {
        return new Promise((resolve, reject) => {
            const { resultado, estado, observaciones } = data;
            const query = `
                UPDATE pruebas_medicas 
                SET resultado = ?, estado = ?, observaciones = ?, fecha_resultado = ?
                WHERE id = ?
            `;
            const fecha_resultado = estado === 'completada' ? new Date().toISOString().split('T')[0] : null;
            db.query(query, [resultado, estado, observaciones, fecha_resultado, id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    delete: (id) => {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM pruebas_medicas WHERE id = ?';
            db.query(query, [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }
};

module.exports = PruebaMedica;
