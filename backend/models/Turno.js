const db = require('../db');

const Turno = {
    getAll: (enfermeraId) => {
        return new Promise((resolve, reject) => {
            let query = `
                SELECT t.*, u.nombre AS enfermera_nombre, u.apellido AS enfermera_apellido
                FROM turnos_enfermera t
                LEFT JOIN usuarios u ON t.enfermera_id = u.id
            `;
            const params = [];

            if (enfermeraId) {
                query += ' WHERE t.enfermera_id = ?';
                params.push(enfermeraId);
            }

            query += ' ORDER BY t.fecha DESC, t.hora_inicio ASC';

            db.query(query, params, (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    },

    create: (turnoData) => {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO turnos_enfermera 
                (enfermera_id, fecha, turno, hora_inicio, hora_fin, ubicacion, observaciones) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            const params = [
                turnoData.enfermera_id,
                turnoData.fecha,
                turnoData.turno,
                turnoData.hora_inicio,
                turnoData.hora_fin,
                turnoData.ubicacion,
                turnoData.observaciones || ''
            ];

            db.query(query, params, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    },

    registerAsistencia: (id, asistenciaData) => {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE turnos_enfermera 
                SET asistio = 1, 
                    hora_entrada = ?, 
                    hora_salida = ?, 
                    observaciones = ?,
                    evidencia_foto = ?
                WHERE id = ?
            `;
            const params = [
                asistenciaData.hora_entrada,
                asistenciaData.hora_salida,
                asistenciaData.observaciones,
                asistenciaData.evidencia_foto,
                id
            ];

            db.query(query, params, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    },

    update: (id, turnoData) => {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE turnos_enfermera 
                SET fecha = ?, turno = ?, hora_inicio = ?, hora_fin = ?, 
                    ubicacion = ?, observaciones = ?
                WHERE id = ?
            `;
            const params = [
                turnoData.fecha,
                turnoData.turno,
                turnoData.hora_inicio,
                turnoData.hora_fin,
                turnoData.ubicacion,
                turnoData.observaciones,
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
            const query = 'DELETE FROM turnos_enfermera WHERE id = ?';
            db.query(query, [id], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
    }
};

module.exports = Turno;