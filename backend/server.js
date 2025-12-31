// const express = require('express');
// const cors = require('cors');
// const solicitudesRoutes = require('./routes/solicitudes');

// const app = express();
// const PORT = process.env.PORT || 3001;

// // Middleware global para manejar BigInt
// app.use((req, res, next) => {
//   const originalJson = res.json;
//   res.json = function (data) {
//     const replacer = (key, value) => {
//       return typeof value === 'bigint' ? value.toString() : value;
//     };
//     const safeData = JSON.parse(JSON.stringify(data, replacer));
//     return originalJson.call(this, safeData);
//   };
//   next();
// });

// // Configuración CORS
// app.use(cors({
//   origin: 'http://localhost:3000', // URL de tu frontend React
//   credentials: true
// }));

// // Middleware para parsear JSON
// app.use(express.json());

// // Log de todas las peticiones
// app.use((req, res, next) => {
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
//   next();
// });

// // Rutas
// app.use('/api/solicitudes', solicitudesRoutes);

// // Ruta de prueba general
// app.get('/test', (req, res) => {
//   res.json({
//     success: true,
//     message: 'Backend funcionando',
//     timestamp: new Date().toISOString()
//   });
// });

// // Ruta de salud
// app.get('/health', (req, res) => {
//   res.json({
//     status: 'OK',
//     service: 'Enfermera Corazón API',
//     timestamp: new Date().toISOString()
//   });
// });

// // Manejo de errores 404
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     error: 'Ruta no encontrada'
//   });
// });

// // Manejo de errores generales
// app.use((err, req, res, next) => {
//   console.error('🔥 Error general:', err);
//   res.status(500).json({
//     success: false,
//     error: 'Error interno del servidor',
//     message: err.message
//   });
// });

// // Iniciar servidor
// app.listen(PORT, () => {
//   console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
//   console.log(`📡 Endpoints disponibles:`);
//   console.log(`   GET  http://localhost:${PORT}/api/solicitudes`);
//   console.log(`   POST http://localhost:${PORT}/api/solicitudes`);
//   console.log(`   GET  http://localhost:${PORT}/test`);
//   console.log(`   GET  http://localhost:${PORT}/health`);
// });

// server.js// server.js




const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configurar CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5000'],
  credentials: true
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/users.routes');
const adminRoutes = require('./routes/admin.routes');
const enfermeraRoutes = require('./routes/enfermera.routes');
const recepcionistaRoutes = require('./routes/recepcionista.routes');
const solicitudesRoutes = require('./routes/solicitudes');

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/enfermera', enfermeraRoutes);
app.use('/api/recepcionista', recepcionistaRoutes);
app.use('/api/solicitudes', solicitudesRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'API de Gestión Hospitalaria',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      admin: '/api/admin',
      enfermera: '/api/enfermera',
      recepcionista: '/api/recepcionista',
      solicitudes: '/api/solicitudes'
    }
  });
});

// Manejo de errores 404
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
  console.log(`📝 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
});