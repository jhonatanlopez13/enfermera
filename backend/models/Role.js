// models/Role.js
const db = require('../db');

const Role = {
  findAll: () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM roles';
      db.query(query, (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  },

  findByName: (nombre) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM roles WHERE nombre = ?';
      db.query(query, [nombre], (err, results) => {
        if (err) reject(err);
        resolve(results[0]);
      });
    });
  },

  findById: (id) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM roles WHERE id = ?';
      db.query(query, [id], (err, results) => {
        if (err) reject(err);
        resolve(results[0]);
      });
    });
  }
};

module.exports = Role;