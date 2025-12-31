const pool = require('./db');

async function testConnection() {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log('✅ Conexión a MariaDB exitosa');

        // Verificar si la tabla existe
        const tables = await conn.query("SHOW TABLES LIKE 'solicitudes_atencion'");
        if (tables.length > 0) {
            console.log('✅ Tabla "solicitudes_atencion" existe');
        } else {
            console.log('❌ Tabla "solicitudes_atencion" NO existe');
        }

        // Verificar estructura de la tabla
        const columns = await conn.query("DESCRIBE solicitudes_atencion");
        console.log('📊 Estructura de la tabla:');
        columns.forEach(col => {
            console.log(`  - ${col.Field} (${col.Type})`);
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (conn) conn.release();
        process.exit();
    }
}

testConnection();