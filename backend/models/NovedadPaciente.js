// models/NovedadPaciente.js
const db = require('../db');

const NovedadPaciente = {
    getAll: (pacienteId = null) => {
        return new Promise((resolve, reject) => {
            let query = 'SELECT n.*, p.nombre, p.apellido FROM novedades_pacientes n JOIN pacientes p ON n.paciente_id = p.id';
            let params = [];

            if (pacienteId) {
                query += ' WHERE n.paciente_id = ?';
                params.push(pacienteId);
            }

            query += ' ORDER BY n.fecha DESC, n.creado_en DESC';

            db.query(query, params, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    create: (novedadData) => {
        return new Promise((resolve, reject) => {
            const { paciente_id, tipo_novedad, descripcion, fecha, evidencia_foto, usuario_id } = novedadData;
            const query = `
                INSERT INTO novedades_pacientes (paciente_id, tipo_novedad, descripcion, fecha, evidencia_foto, usuario_id)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            db.query(query, [paciente_id, tipo_novedad, descripcion, fecha, evidencia_foto, usuario_id || null], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
};

module.exports = NovedadPaciente;
