// controllers/solicitudes.controller.js
const db = require('../db');

const solicitudesController = {
  // Obtener todas las solicitudes
  getAll: (req, res) => {
    const query = 'SELECT * FROM solicitudes ORDER BY created_at DESC';
    
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error al obtener solicitudes:', err);
        return res.status(500).json({ 
          success: false,
          message: 'Error al obtener solicitudes',
          error: err.message 
        });
      }
      
      res.status(200).json(results);
    });
  },

  // Obtener una solicitud por ID
  getById: (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM solicitudes WHERE id = ?';
    
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error al obtener solicitud:', err);
        return res.status(500).json({ 
          success: false,
          message: 'Error al obtener solicitud',
          error: err.message 
        });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ 
          success: false,
          message: 'Solicitud no encontrada' 
        });
      }
      
      res.status(200).json(results[0]);
    });
  },

  // Crear una nueva solicitud
  create: (req, res) => {
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

    // Validar campos requeridos
    if (!nombre_contacto || !telefono || !email || !nombre_paciente || !tipo_servicio || !urgencia) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios'
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
      urgencia,
      description || ''
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Error al crear solicitud:', err);
        return res.status(500).json({ 
          success: false,
          message: 'Error al crear solicitud',
          error: err.message 
        });
      }
      
      res.status(201).json({
        success: true,
        message: 'Solicitud creada exitosamente',
        data: {
          id: result.insertId,
          ...req.body
        }
      });
    });
  },

  // Actualizar una solicitud
  update: (req, res) => {
    const { id } = req.params;
    const {
      nombre_contacto,
      telefono,
      email,
      nombre_paciente,
      edad_paciente,
      tipo_servicio,
      urgencia,
      description,
      estado
    } = req.body;

    const query = `
      UPDATE solicitudes 
      SET 
        nombre_contacto = ?,
        telefono = ?,
        email = ?,
        nombre_paciente = ?,
        edad_paciente = ?,
        tipo_servicio = ?,
        urgencia = ?,
        description = ?,
        estado = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    const values = [
      nombre_contacto,
      telefono,
      email,
      nombre_paciente,
      edad_paciente || 0,
      tipo_servicio,
      urgencia,
      description || '',
      estado || 'pendiente',
      id
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Error al actualizar solicitud:', err);
        return res.status(500).json({ 
          success: false,
          message: 'Error al actualizar solicitud',
          error: err.message 
        });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          success: false,
          message: 'Solicitud no encontrada' 
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Solicitud actualizada exitosamente'
      });
    });
  },

  // Eliminar una solicitud
  delete: (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM solicitudes WHERE id = ?';
    
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error('Error al eliminar solicitud:', err);
        return res.status(500).json({ 
          success: false,
          message: 'Error al eliminar solicitud',
          error: err.message 
        });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          success: false,
          message: 'Solicitud no encontrada' 
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Solicitud eliminada exitosamente'
      });
    });
  },

  // Cambiar estado de una solicitud
  updateStatus: (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado || !['pendiente', 'en_proceso', 'completada', 'cancelada'].includes(estado)) {
      return res.status(400).json({
        success: false,
        message: 'Estado inválido. Los valores permitidos son: pendiente, en_proceso, completada, cancelada'
      });
    }

    const query = 'UPDATE solicitudes SET estado = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    
    db.query(query, [estado, id], (err, result) => {
      if (err) {
        console.error('Error al actualizar estado:', err);
        return res.status(500).json({ 
          success: false,
          message: 'Error al actualizar estado',
          error: err.message 
        });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          success: false,
          message: 'Solicitud no encontrada' 
        });
      }
      
      res.status(200).json({
        success: true,
        message: `Estado actualizado a: ${estado}`
      });
    });
  },

  // Obtener estadísticas
  getStats: (req, res) => {
    const query = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN estado = 'pendiente' THEN 1 ELSE 0 END) as pendientes,
        SUM(CASE WHEN estado = 'en_proceso' THEN 1 ELSE 0 END) as en_proceso,
        SUM(CASE WHEN estado = 'completada' THEN 1 ELSE 0 END) as completadas,
        SUM(CASE WHEN urgencia = 'Urgente' THEN 1 ELSE 0 END) as urgentes,
        SUM(CASE WHEN urgencia = 'Normal' THEN 1 ELSE 0 END) as normales,
        DATE(created_at) as fecha,
        COUNT(*) as por_dia
      FROM solicitudes 
      WHERE DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
      ORDER BY fecha DESC
    `;
    
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error al obtener estadísticas:', err);
        return res.status(500).json({ 
          success: false,
          message: 'Error al obtener estadísticas',
          error: err.message 
        });
      }
      
      // Obtener totales generales
      const totalsQuery = `
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN estado = 'pendiente' THEN 1 ELSE 0 END) as pendientes,
          SUM(CASE WHEN estado = 'en_proceso' THEN 1 ELSE 0 END) as en_proceso,
          SUM(CASE WHEN estado = 'completada' THEN 1 ELSE 0 END) as completadas,
          SUM(CASE WHEN urgencia = 'Urgente' THEN 1 ELSE 0 END) as urgentes
        FROM solicitudes
      `;
      
      db.query(totalsQuery, (errTotals, totalsResults) => {
        if (errTotals) {
          console.error('Error al obtener totales:', errTotals);
          return res.status(500).json({ 
            success: false,
            message: 'Error al obtener totales',
            error: errTotals.message 
          });
        }
        
        res.status(200).json({
          success: true,
          data: {
            stats: results,
            totals: totalsResults[0] || {}
          }
        });
      });
    });
  }
};

module.exports = solicitudesController;