// models/Paciente.js
const db = require('../db');

const Paciente = {
    getAll: () => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM pacientes ORDER BY nombre ASC';
            db.query(query, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    findById: (id) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM pacientes WHERE id = ?';
            db.query(query, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    }
};

module.exports = Paciente;
