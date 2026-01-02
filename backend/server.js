const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Permite solicitudes desde el frontend
  credentials: true
}));
app.use(express.json());

// Configuración de la base de datos MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'enfermeras',
  port: process.env.DB_PORT || 3306
});

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error('❌ Error conectando a la base de datos MySQL:', err.message);
    console.log('📌 Verifica que:');
    console.log('   1. XAMPP esté corriendo');
    console.log('   2. MySQL esté iniciado en XAMPP');
    console.log('   3. La base de datos "enfermera_db" exista');
    return;
  }
  console.log('✅ Conectado a la base de datos MySQL');

  // Crear tabla si no existe
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS solicitudes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre_contacto VARCHAR(100) NOT NULL,
      telefono VARCHAR(20) NOT NULL,
      email VARCHAR(100) NOT NULL,
      nombre_paciente VARCHAR(100) NOT NULL,
      edad_paciente INT NOT NULL,
      tipo_servicio VARCHAR(100) NOT NULL,
      urgencia VARCHAR(20) NOT NULL,
      description TEXT NOT NULL,
      estado VARCHAR(20) DEFAULT 'pendiente',
      fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error('❌ Error creando tabla:', err.message);
    } else {
      console.log('✅ Tabla "solicitudes" verificada/creada');
    }
  });
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Backend de Enfermera Corazón funcionando',
    endpoints: {
      getSolicitudes: 'GET /api/solicitudes',
      createSolicitud: 'POST /api/solicitudes',
      health: 'GET /api/health'
    }
  });
});

// Ruta para verificar salud del servidor
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend funcionando correctamente',
    database: db.state === 'connected' ? 'Conectado' : 'Desconectado',
    timestamp: new Date().toISOString()
  });
});

// Ruta para obtener todas las solicitudes
app.get('/api/solicitudes', (req, res) => {
  console.log('📨 GET /api/solicitudes recibido');

  const query = 'SELECT * FROM solicitudes ORDER BY fecha_creacion DESC';

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error obteniendo solicitudes:', err.message);
      return res.status(500).json({
        error: 'Error obteniendo solicitudes',
        details: err.message
      });
    }

    console.log(`✅ Enviando ${results.length} solicitudes`);
    res.json(results);
  });
});

// Ruta para crear una nueva solicitud
app.post('/api/solicitudes', (req, res) => {
  console.log('📨 POST /api/solicitudes recibido');
  console.log('📦 Datos recibidos:', req.body);

  const {
    nombre_contacto,
    telefono,
    email,
    nombre_paciente,
    edad_paciente,
    tipo_servicio,
    urgencia,
    description
  } = req.body;

  // Validación de campos obligatorios
  if (!nombre_contacto || !telefono || !email || !nombre_paciente || !tipo_servicio || !description) {
    return res.status(400).json({
      error: 'Faltan campos obligatorios',
      required: ['nombre_contacto', 'telefono', 'email', 'nombre_paciente', 'tipo_servicio', 'description']
    });
  }

  const query = `
    INSERT INTO solicitudes 
    (nombre_contacto, telefono, email, nombre_paciente, edad_paciente, tipo_servicio, urgencia, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    nombre_contacto,
    telefono,
    email,
    nombre_paciente,
    edad_paciente || 0,
    tipo_servicio,
    urgencia || 'Normal',
    description
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('❌ Error insertando solicitud:', err.message);
      return res.status(500).json({
        error: 'Error guardando la solicitud en la base de datos',
        details: err.message
      });
    }

    console.log(`✅ Solicitud guardada con ID: ${result.insertId}`);

    // Obtener la solicitud recién creada
    db.query('SELECT * FROM solicitudes WHERE id = ?', [result.insertId], (err, rows) => {
      if (err) {
        return res.status(201).json({
          success: true,
          message: 'Solicitud creada exitosamente',
          id: result.insertId
        });
      }

      res.status(201).json({
        success: true,
        message: 'Solicitud creada exitosamente',
        data: rows[0]
      });
    });
  });
});

// Ruta para probar la conexión a la base de datos
app.get('/api/test-db', (req, res) => {
  db.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) {
      return res.status(500).json({
        error: 'Error de conexión a la base de datos',
        message: err.message
      });
    }

    res.json({
      database: 'Conectado',
      testQuery: results[0].solution === 2 ? 'OK' : 'Error',
      connection: db.state
    });
  });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.path,
    method: req.method
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en: http://localhost:${PORT}`);
  console.log(`📡 Endpoints disponibles:`);
  console.log(`   http://localhost:${PORT}/`);
  console.log(`   http://localhost:${PORT}/api/health`);
  console.log(`   http://localhost:${PORT}/api/solicitudes`);
  console.log(`   http://localhost:${PORT}/api/test-db`);
});