// controllers/novedadPaciente.controller.js
const NovedadPaciente = require('../models/NovedadPaciente');

const novedadPacienteController = {
    getAll: async (req, res) => {
        try {
            const { pacienteId } = req.query;
            const novedades = await NovedadPaciente.getAll(pacienteId);
            res.json(novedades);
        } catch (error) {
            console.error('❌ Error obteniendo novedades de pacientes:', error.message);
            res.status(500).json({ success: false, error: 'Error al obtener novedades' });
        }
    },

    create: async (req, res) => {
        try {
            console.log('📥 Recibiendo novedad de paciente:', req.body);
            const result = await NovedadPaciente.create(req.body);
            console.log('✅ Novedad de paciente registrada con ID:', result.insertId);
            res.json({ success: true, message: 'Novedad de paciente registrada', id: result.insertId });
        } catch (error) {
            console.error('❌ Error creando novedad de paciente:', error.message);
            res.status(500).json({ success: false, error: 'Error al registrar novedad', details: error.message });
        }
    }
};

module.exports = novedadPacienteController;
