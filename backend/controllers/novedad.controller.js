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
            const result = await Novedad.create(req.body);
            res.json({ success: true, message: 'Novedad creada', id: result.insertId });
        } catch (error) {
            console.error('❌ Error creando novedad:', error.message);
            res.status(500).json({ success: false, error: 'Error al crear novedad' });
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await Novedad.update(id, req.body);

            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, error: 'Novedad no encontrada' });
            }
            res.json({ success: true, message: 'Novedad actualizada' });
        } catch (error) {
            console.error('❌ Error actualizando novedad:', error.message);
            res.status(500).json({ success: false, error: 'Error al actualizar novedad' });
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