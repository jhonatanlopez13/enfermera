const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/users.routes');
const turnoRoutes = require('./routes/turno.routes');
const novedadRoutes = require('./routes/novedad.routes');
const pacienteRoutes = require('./routes/paciente.routes');
const novedadPacienteRoutes = require('./routes/novedadPaciente.routes');
const solicitudesRoutes = require('./routes/solicitudes');
const enfermeraRoutes = require('./routes/enfermera.routes');
const pruebaMedicaRoutes = require('./routes/pruebaMedica.routes');

// ========== RUTAS DEL API ========== //
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/turnos', turnoRoutes);
app.use('/api/novedades', novedadRoutes);
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/novedades-pacientes', novedadPacienteRoutes);
app.use('/api/solicitudes', solicitudesRoutes);
app.use('/api/enfermeras', enfermeraRoutes);
app.use('/api/pruebas', pruebaMedicaRoutes);

// Ruta de salud
app.get('/api/health', (req, res) => {
  db.query('SELECT 1', (err) => {
    res.json({
      status: 'OK',
      message: 'Backend funcionando correctamente',
      database: err ? 'Error: ' + err.message : 'Conectado',
      timestamp: new Date().toISOString()
    });
  });
});

app.get('/', (req, res) => {
  res.json({
    message: '🚀 Backend de Sistema de Enfermeras',
    status: 'OK',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/usuarios',
      turnos: '/api/turnos',
      novedades: '/api/novedades',
      pacientes: '/api/pacientes',
      novedades_pacientes: '/api/novedades-pacientes',
      solicitudes: '/api/solicitudes',
      enfermeras: '/api/enfermeras'
    }
  });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada',
    path: req.path
  });
});

// Manejo de errores general
app.use((err, req, res, next) => {
  console.error('❌ Error del servidor:', err);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en: http://localhost:${PORT}`);
});