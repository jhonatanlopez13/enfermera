const Novedad = require('../models/Novedad');

const novedadController = {
    getAll: async (req, res) => {
        try {
            const novedades = await Novedad.getAll();
            res.json(novedades);
        } catch (error) {
            console.error('❌ Error obteniendo novedades:', error.message);
            res.status(500).json({ success: false, error: 'Error al obtener novedades' });
        }
    },

    create: async (req, res) => {
        try {
            const data = {
                ...req.body,
                evidencia_foto: req.file ? req.file.filename : req.body.evidencia_foto
            };
            const result = await Novedad.create(data);
            res.json({ success: true, message: 'Novedad creada', id: result.insertId, evidencia_foto: data.evidencia_foto });
        } catch (error) {
            console.error('❌ Error creando novedad:', error.message);
            res.status(500).json({ success: false, error: 'Error al crear novedad', details: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const data = {
                ...req.body,
                evidencia_foto: req.file ? req.file.filename : req.body.evidencia_foto
            };
            const result = await Novedad.update(id, data);

            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, error: 'Novedad no encontrada' });
            }
            res.json({ success: true, message: 'Novedad actualizada', evidencia_foto: data.evidencia_foto });
        } catch (error) {
            console.error('❌ Error actualizando novedad:', error.message);
            res.status(500).json({ success: false, error: 'Error al actualizar novedad', details: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await Novedad.delete(id);

            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, error: 'Novedad no encontrada' });
            }
            res.json({ success: true, message: 'Novedad eliminada' });
        } catch (error) {
            console.error('❌ Error eliminando novedad:', error.message);
            res.status(500).json({ success: false, error: 'Error al eliminar novedad' });
        }
    }
};

module.exports = novedadController;