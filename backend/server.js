const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
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

  // Crear tablas básicas
  createBasicTables();
});

// Función para crear tablas básicas
const createBasicTables = () => {
  const tables = [
    // Tabla de pacientes
    `CREATE TABLE IF NOT EXISTS pacientes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      apellido VARCHAR(100) NOT NULL,
      fecha_nacimiento DATE,
      genero ENUM('M','F','O'),
      telefono VARCHAR(20),
      email VARCHAR(100),
      direccion TEXT,
      historial_medico TEXT,
      alergias TEXT,
      contacto_emergencia VARCHAR(100),
      tel_emergencia VARCHAR(20),
      creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Tabla de pruebas médicas
    `CREATE TABLE IF NOT EXISTS pruebas_medicas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      paciente_id INT,
      nombre_paciente VARCHAR(100) NOT NULL,
      tipo_prueba VARCHAR(100) NOT NULL,
      descripcion TEXT NOT NULL,
      resultado TEXT,
      fecha_prueba DATE NOT NULL,
      fecha_resultado DATE,
      estado ENUM('pendiente','completada','cancelada') DEFAULT 'pendiente',
      enfermera_id INT NOT NULL,
      observaciones TEXT,
      creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,

    // Tabla de turnos
    `CREATE TABLE IF NOT EXISTS turnos_enfermera (
      id INT AUTO_INCREMENT PRIMARY KEY,
      enfermera_id INT NOT NULL,
      fecha DATE NOT NULL,
      turno ENUM('matutino','vespertino','nocturno') NOT NULL,
      hora_inicio TIME NOT NULL,
      hora_fin TIME NOT NULL,
      ubicacion VARCHAR(200) NOT NULL,
      asistio TINYINT(1) DEFAULT 0,
      hora_entrada TIME,
      hora_salida TIME,
      evidencia_foto VARCHAR(255),
      observaciones TEXT,
      creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_turno_enfermera (enfermera_id, fecha, turno)
    )`
  ];

  tables.forEach((sql, index) => {
    db.query(sql, (err) => {
      if (err) {
        console.error(`❌ Error creando tabla ${index + 1}:`, err.message);
      } else {
        console.log(`✅ Tabla ${index + 1} verificada/creada`);

        if (index === tables.length - 1) {
          insertTestData();
        }
      }
    });
  });
};

// Insertar datos de prueba
const insertTestData = () => {
  console.log('🌱 Insertando datos de prueba...');

  // Insertar pacientes de prueba
  const pacientesQuery = `
    INSERT IGNORE INTO pacientes (id, nombre, apellido, fecha_nacimiento, genero, telefono, email) VALUES
    (1, 'María', 'González', '1968-05-15', 'F', '555-1234', 'maria.gonzalez@email.com'),
    (2, 'Juan', 'Pérez', '1955-08-22', 'M', '555-5678', 'juan.perez@email.com'),
    (3, 'Ana', 'Rodríguez', '1972-11-30', 'F', '555-9012', 'ana.rodriguez@email.com'),
    (4, 'Carlos', 'Sánchez', '1960-03-10', 'M', '555-3456', 'carlos.sanchez@email.com');
  `;

  db.query(pacientesQuery, (err) => {
    if (err) {
      console.error('❌ Error insertando pacientes:', err.message);
    } else {
      console.log('✅ Pacientes de prueba insertados');
    }

    // Insertar pruebas médicas de prueba
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const tomorrow = new Date(now.setDate(now.getDate() + 1)).toISOString().split('T')[0];
    const dayAfterTomorrow = new Date(now.setDate(now.getDate() + 1)).toISOString().split('T')[0];

    const pruebasQuery = `
      INSERT IGNORE INTO pruebas_medicas 
      (id, paciente_id, nombre_paciente, tipo_prueba, descripcion, resultado, fecha_prueba, fecha_resultado, estado, enfermera_id) VALUES
      (1, 1, 'María González', 'glucemia', 'Prueba de glucemia en ayunas', '95 mg/dL (Normal)', '${today}', '${today}', 'completada', 2),
      (2, 2, 'Juan Pérez', 'presión arterial', 'Control de presión arterial', '120/80 mmHg (Normal)', '${today}', '${today}', 'completada', 2),
      (3, 3, 'Ana Rodríguez', 'COVID-19', 'Prueba PCR para COVID-19', NULL, '${tomorrow}', NULL, 'pendiente', 2),
      (4, 4, 'Carlos Sánchez', 'alergias', 'Prueba de alergias cutáneas', NULL, '${dayAfterTomorrow}', NULL, 'pendiente', 2);
    `;

    db.query(pruebasQuery, (err) => {
      if (err) {
        console.error('❌ Error insertando pruebas:', err.message);
      } else {
        console.log('✅ Pruebas médicas de prueba insertadas');
      }

      // Insertar turnos de prueba
      const turnosQuery = `
        INSERT IGNORE INTO turnos_enfermera 
        (id, enfermera_id, fecha, turno, hora_inicio, hora_fin, ubicacion, asistio) VALUES
        (1, 2, '${today}', 'matutino', '08:00:00', '16:00:00', 'Hospital Central - Piso 3', 0),
        (2, 2, '${tomorrow}', 'vespertino', '16:00:00', '00:00:00', 'Clínica Norte', 0),
        (3, 2, '${dayAfterTomorrow}', 'matutino', '08:00:00', '16:00:00', 'Hospital Central - Piso 3', 0);
      `;

      db.query(turnosQuery, (err) => {
        if (err) {
          console.error('❌ Error insertando turnos:', err.message);
        } else {
          console.log('✅ Turnos de prueba insertados');
        }
      });
    });
  });
};

// ========== RUTAS PRINCIPALES ========== //

app.get('/', (req, res) => {
  res.json({
    message: '🚀 Backend de Enfermera Corazón funcionando',
    status: 'OK',
    endpoints: {
      health: 'GET /api/health',
      checkTables: 'GET /api/check-tables',
      pruebas: 'GET /api/pruebas?enfermeraId=2',
      turnos: 'GET /api/turnos?enfermeraId=2',
      pacientes: 'GET /api/pacientes',
      login: 'POST /api/auth/login'
    }
  });
});

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend funcionando correctamente',
    database: db.state === 'connected' ? 'Conectado' : 'Desconectado',
    timestamp: new Date().toISOString()
  });
});

// Verificar tablas
app.get('/api/check-tables', (req, res) => {
  const queries = [
    'SHOW TABLES',
    'SELECT COUNT(*) as total FROM pruebas_medicas',
    'SELECT COUNT(*) as total FROM turnos_enfermera',
    'SELECT COUNT(*) as total FROM pacientes'
  ];

  db.query(queries.join(';'), (err, results) => {
    if (err) {
      return res.status(500).json({
        error: 'Error verificando tablas',
        details: err.message
      });
    }

    res.json({
      tables: results[0],
      total_pruebas: results[1][0].total,
      total_turnos: results[2][0].total,
      total_pacientes: results[3][0].total,
      status: 'OK'
    });
  });
});

// ========== RUTAS DE ENFERMERA ========== //

// Obtener pruebas médicas
app.get('/api/pruebas', (req, res) => {
  const { enfermeraId } = req.query;

  let query = `
    SELECT p.*, 
           CONCAT(pac.nombre, ' ', pac.apellido) as paciente_completo
    FROM pruebas_medicas p
    LEFT JOIN pacientes pac ON p.paciente_id = pac.id
    WHERE 1=1
  `;

  let params = [];

  if (enfermeraId) {
    query += ' AND p.enfermera_id = ?';
    params.push(enfermeraId);
  }

  query += ' ORDER BY p.fecha_prueba DESC';

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('❌ Error obteniendo pruebas:', err.message);
      return res.status(500).json({
        error: 'Error al obtener pruebas',
        details: err.message
      });
    }

    console.log(`✅ Enviando ${results.length} pruebas`);
    res.json(results);
  });
});

// Crear nueva prueba
app.post('/api/pruebas', (req, res) => {
  const {
    paciente_id,
    nombre_paciente,
    tipo_prueba,
    descripcion,
    fecha_prueba,
    observaciones,
    enfermera_id
  } = req.body;

  console.log('📝 Creando nueva prueba:', req.body);

  const query = `
    INSERT INTO pruebas_medicas 
    (paciente_id, nombre_paciente, tipo_prueba, descripcion, fecha_prueba, observaciones, enfermera_id, estado)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'pendiente')
  `;

  db.query(query, [
    paciente_id || null,
    nombre_paciente,
    tipo_prueba,
    descripcion,
    fecha_prueba,
    observaciones || '',
    enfermera_id
  ], (err, result) => {
    if (err) {
      console.error('❌ Error creando prueba:', err.message);
      return res.status(500).json({
        error: 'Error al crear prueba',
        details: err.message
      });
    }

    console.log(`✅ Prueba creada con ID: ${result.insertId}`);

    res.json({
      success: true,
      message: 'Prueba creada exitosamente',
      id: result.insertId
    });
  });
});

// Actualizar prueba
app.put('/api/pruebas/:id', (req, res) => {
  const { id } = req.params;
  const { resultado, estado, observaciones } = req.body;

  console.log(`📝 Actualizando prueba ID: ${id}`, req.body);

  const query = `
    UPDATE pruebas_medicas 
    SET resultado = ?, estado = ?, observaciones = ?, fecha_resultado = ?
    WHERE id = ?
  `;

  db.query(query, [
    resultado || '',
    estado || 'pendiente',
    observaciones || '',
    estado === 'completada' ? new Date().toISOString().split('T')[0] : null,
    id
  ], (err, result) => {
    if (err) {
      console.error('❌ Error actualizando prueba:', err.message);
      return res.status(500).json({
        error: 'Error al actualizar prueba',
        details: err.message
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Prueba no encontrada' });
    }

    console.log(`✅ Prueba ${id} actualizada`);
    res.json({
      success: true,
      message: 'Prueba actualizada exitosamente'
    });
  });
});

// Eliminar prueba
app.delete('/api/pruebas/:id', (req, res) => {
  const { id } = req.params;
  console.log(`🗑️ Eliminando prueba ID: ${id}`);

  db.query('DELETE FROM pruebas_medicas WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('❌ Error eliminando prueba:', err.message);
      return res.status(500).json({
        error: 'Error al eliminar prueba',
        details: err.message
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Prueba no encontrada' });
    }

    console.log(`✅ Prueba ${id} eliminada`);
    res.json({
      success: true,
      message: 'Prueba eliminada exitosamente'
    });
  });
});

// Obtener turnos
app.get('/api/turnos', (req, res) => {
  const { enfermeraId } = req.query;

  let query = `SELECT * FROM turnos_enfermera WHERE 1=1`;
  let params = [];

  if (enfermeraId) {
    query += ` AND enfermera_id = ?`;
    params.push(enfermeraId);
  }

  query += ` ORDER BY fecha, hora_inicio`;

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('❌ Error obteniendo turnos:', err.message);
      return res.status(500).json({
        error: 'Error al obtener turnos',
        details: err.message
      });
    }

    console.log(`✅ Enviando ${results.length} turnos`);
    res.json(results);
  });
});

// Registrar asistencia
app.post('/api/turnos/:id/asistencia', (req, res) => {
  const { id } = req.params;
  const { hora_entrada, hora_salida, observaciones } = req.body;

  console.log(`✅ Registrando asistencia para turno ID: ${id}`);

  const query = `
    UPDATE turnos_enfermera 
    SET asistio = 1, 
        hora_entrada = ?,
        hora_salida = ?,
        observaciones = ?
    WHERE id = ?
  `;

  db.query(query, [
    hora_entrada || null,
    hora_salida || null,
    observaciones || '',
    id
  ], (err, result) => {
    if (err) {
      console.error('❌ Error registrando asistencia:', err.message);
      return res.status(500).json({
        error: 'Error al registrar asistencia',
        details: err.message
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Turno no encontrado' });
    }

    console.log(`✅ Asistencia registrada para turno ${id}`);
    res.json({
      success: true,
      message: 'Asistencia registrada exitosamente'
    });
  });
});

// Obtener pacientes
app.get('/api/pacientes', (req, res) => {
  const query = `
    SELECT id, CONCAT(nombre, ' ', apellido) as nombre_completo, 
           telefono, email, fecha_nacimiento
    FROM pacientes 
    ORDER BY nombre, apellido
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error obteniendo pacientes:', err.message);
      return res.status(500).json({
        error: 'Error al obtener pacientes',
        details: err.message
      });
    }

    console.log(`✅ Enviando ${results.length} pacientes`);
    res.json(results);
  });
});

// ========== RUTAS DE AUTENTICACIÓN ========== //

// Login
app.post('/api/auth/login', (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({
      error: 'Usuario y contraseña son obligatorios'
    });
  }

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
      return res.status(500).json({
        error: 'Error interno del servidor',
        details: err.message
      });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = results[0];
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login exitoso',
      user: userWithoutPassword
    });
  });
});

// ========== RUTAS EXISTENTES ========== //

app.get('/api/solicitudes', (req, res) => {
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

app.post('/api/solicitudes', (req, res) => {
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

    res.status(201).json({
      success: true,
      message: 'Solicitud creada exitosamente',
      id: result.insertId
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
  console.log(`   http://localhost:${PORT}/api/check-tables`);
  console.log(`   http://localhost:${PORT}/api/pruebas?enfermeraId=2`);
  console.log(`   http://localhost:${PORT}/api/turnos?enfermeraId=2`);
  console.log(`   http://localhost:${PORT}/api/pacientes`);
  console.log(`   http://localhost:${PORT}/api/auth/login`);
});