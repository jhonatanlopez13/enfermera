// controllers/paciente.controller.js
const Paciente = require('../models/Paciente');

const pacienteController = {
    getAll: async (req, res) => {
        try {
            const pacientes = await Paciente.getAll();
            res.json(pacientes);
        } catch (error) {
            console.error('❌ Error obteniendo pacientes:', error.message);
            res.status(500).json({ success: false, error: 'Error al obtener pacientes' });
        }
    }
};

module.exports = pacienteController;
