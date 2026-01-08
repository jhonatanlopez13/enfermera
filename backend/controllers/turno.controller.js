const Turno = require('../models/Turno');

const turnoController = {
    getAll: async (req, res) => {
        try {
            const { enfermeraId } = req.query;
            const turnos = await Turno.getAll(enfermeraId);
            res.json(turnos);
        } catch (error) {
            console.error('❌ Error obteniendo turnos:', error.message);
            res.status(500).json({ success: false, error: 'Error al obtener turnos', details: error.message });
        }
    },

    create: async (req, res) => {
        try {
            const result = await Turno.create(req.body);
            res.json({ success: true, message: 'Turno creado', id: result.insertId });
        } catch (error) {
            console.error('❌ Error creando turno:', error.message);
            res.status(500).json({ success: false, error: 'Error al crear turno' });
        }
    },

    registerAsistencia: async (req, res) => {
        try {
            const { id } = req.params;
            const data = {
                ...req.body,
                evidencia_foto: req.file ? req.file.filename : req.body.evidencia_foto
            };

            const result = await Turno.registerAsistencia(id, data);

            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, error: 'Turno no encontrado' });
            }
            res.json({
                success: true,
                message: 'Asistencia registrada exitosamente',
                evidencia_foto: data.evidencia_foto
            });
        } catch (error) {
            console.error('❌ Error registrando asistencia:', error.message);
            res.status(500).json({ success: false, error: 'Error registrando asistencia', details: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await Turno.update(id, req.body);

            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, error: 'Turno no encontrado' });
            }
            res.json({ success: true, message: 'Turno actualizado' });
        } catch (error) {
            console.error('❌ Error actualizando turno:', error.message);
            res.status(500).json({ success: false, error: 'Error al actualizar turno' });
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await Turno.delete(id);

            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, error: 'Turno no encontrado' });
            }
            res.json({ success: true, message: 'Turno eliminado' });
        } catch (error) {
            console.error('❌ Error eliminando turno:', error.message);
            res.status(500).json({ success: false, error: 'Error al eliminar turno' });
        }
    }
};

module.exports = turnoController;