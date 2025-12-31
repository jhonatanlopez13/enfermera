const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: "localhost",
    user: "root",
    password: "", // tu contraseña aquí
    database: "enfermeras", // verifica que la base se llame igual
    connectionLimit: 5
});

// Función para probar la conexión
pool.getConnection()
    .then(conn => {
        console.log('Conexión a la base de datos establecida');
        conn.release();
    })
    .catch(err => {
        console.error('Error conectando a la base de datos:', err.message);
    });

module.exports = pool;