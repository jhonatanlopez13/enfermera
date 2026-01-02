const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const crypto = require('crypto');
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
    console.log('   3. La base de datos "enfermeras" exista');
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
      console.log('✅ Tabla "usuarios" verificada/creada');
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
      getUsuarios: 'GET /api/usuarios',
      createUsuario: 'POST /api/usuarios',
      login: 'POST /api/auth/login',
      health: 'GET /api/health',
      testDb: 'GET /api/test-db'
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

// Ruta para obtener todos los usuarios
app.get('/api/usuarios', (req, res) => {
  console.log('📨 GET /api/usuarios Recibido');

  const query = 'SELECT * FROM usuarios ORDER BY creado_en DESC';

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error obteniendo usuarios:', err.message);
      return res.status(500).json({
        error: 'Error obteniendo usuarios',
        details: err.message
      });
    }

    console.log(`✅ Enviando ${results.length} usuarios`);
    res.json(results);
  });
});

// Ruta para crear un nuevo usuario
app.post('/api/usuarios', (req, res) => {
  console.log('📨 POST /api/usuarios recibido');
  console.log('📦 Datos recibidos:', req.body);

  const { usuario, nombre, password, rol_id } = req.body;

  if (!usuario || !nombre || !password) {
    return res.status(400).json({
      error: 'Faltan campos obligatorios',
      required: ['usuario', 'nombre', 'password']
    });
  }

  // Encriptar contraseña con MD5
  const md5Password = crypto.createHash('md5').update(password).digest('hex');

  const defaultRolId = rol_id || 3;
  const query = 'INSERT INTO usuarios (usuario, nombre, password, rol_id, activo) VALUES (?, ?, ?, ?, 1)';

  db.query(query, [usuario, nombre, md5Password, defaultRolId], (err, result) => {
    if (err) {
      console.error('❌ Error insertando usuario:', err.message);
      return res.status(500).json({
        error: 'Error guardando el usuario en la base de datos',
        details: err.message
      });
    }

    console.log(`✅ Usuario guardado con ID: ${result.insertId}`);
    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      id: result.insertId
    });
  });
});

// Ruta para login de usuario
app.post('/api/auth/login', (req, res) => {
  console.log('📨 POST /api/auth/login');
  console.log('📦 Datos recibidos:', req.body);

  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({
      error: 'Usuario y contraseña son obligatorios'
    });
  }

  // Encriptar la contraseña con MD5
  const md5Password = crypto.createHash('md5').update(password).digest('hex');

  const query = `
    SELECT u.*, r.nombre as rol_nombre 
    FROM usuarios u 
    INNER JOIN roles r ON u.rol_id = r.id 
    WHERE u.usuario = ? AND u.password = ? AND u.activo = 1
  `;

  db.query(query, [usuario, md5Password], (err, results) => {
    if (err) {
      console.error('❌ Error en login:', err.message);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = results[0];

    // Eliminar password del objeto de respuesta
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login exitoso',
      user: userWithoutPassword
    });
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

// Ruta para probar recepción de datos (DEBUG)
app.post('/api/test-register', (req, res) => {
  console.log('📨 POST /api/test-register recibido');
  console.log('📦 Datos recibidos:', req.body);

  res.json({
    success: true,
    message: 'Datos recibidos correctamente',
    data: req.body,
    timestamp: new Date().toISOString()
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
  console.log(`   http://localhost:${PORT}/api/usuarios`);
  console.log(`   http://localhost:${PORT}/api/auth/login`);
  console.log(`   http://localhost:${PORT}/api/test-db`);
});

