const PruebaMedica = require('../models/PruebaMedica');

const pruebaMedicaController = {
    getAllByEnfermera: async (req, res) => {
        try {
            const { enfermeraId } = req.query;
            if (!enfermeraId) {
                return res.status(400).json({ success: false, error: 'enfermeraId es requerido' });
            }
            const pruebas = await PruebaMedica.getAllByEnfermera(enfermeraId);
            res.json(pruebas);
        } catch (error) {
            console.error('❌ Error obteniendo pruebas:', error.message);
            res.status(500).json({ success: false, error: 'Error al obtener pruebas' });
        }
    },

    create: async (req, res) => {
        try {
            const result = await PruebaMedica.create(req.body);
            res.json({ success: true, message: 'Prueba médica creada', id: result.insertId });
        } catch (error) {
            console.error('❌ Error creando prueba:', error.message);
            res.status(500).json({ success: false, error: 'Error al crear la prueba' });
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await PruebaMedica.update(id, req.body);
            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, error: 'Prueba no encontrada' });
            }
            res.json({ success: true, message: 'Prueba actualizada' });
        } catch (error) {
            console.error('❌ Error actualizando prueba:', error.message);
            res.status(500).json({ success: false, error: 'Error al actualizar la prueba' });
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await PruebaMedica.delete(id);
            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, error: 'Prueba no encontrada' });
            }
            res.json({ success: true, message: 'Prueba eliminada' });
        } catch (error) {
            console.error('❌ Error eliminando prueba:', error.message);
            res.status(500).json({ success: false, error: 'Error al eliminar la prueba' });
        }
    }
};

module.exports = pruebaMedicaController;
