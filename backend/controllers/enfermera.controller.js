// controllers/enfermera.controller.js
const Enfermera = require('../models/Enfermera');

const enfermeraController = {
    /**
     * Registrar una nueva enfermera
     * POST /api/enfermeras/register
     */
    register: async (req, res) => {
        try {
            const {
                usuario,
                nombre,
                apellido,
                email,
                telefono,
                direccion,
                fecha_nacimiento,
                genero,
                password
            } = req.body;

            console.log('📥 Datos recibidos para registro de ENFERMERA:', {
                usuario,
                nombre,
                apellido,
                email
            });

            // Validaciones básicas (ya validadas por middleware, pero doble verificación)
            if (!usuario || !nombre || !apellido || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Los campos usuario, nombre, apellido, email y password son obligatorios'
                });
            }

            // Verificar si el usuario o email ya existen
            const existingUser = await Enfermera.checkExisting(usuario, email);

            if (existingUser) {
                const field = existingUser.usuario === usuario ? 'usuario' : 'email';
                return res.status(400).json({
                    success: false,
                    message: `El ${field} ya está registrado en el sistema`
                });
            }

            // Crear la enfermera
            const result = await Enfermera.create({
                usuario,
                nombre,
                apellido,
                email,
                telefono,
                direccion,
                fecha_nacimiento,
                genero,
                password
            });

            console.log('✅ Enfermera registrada con ID:', result.insertId);

            // Obtener los datos de la enfermera creada
            const newEnfermera = await Enfermera.findById(result.insertId);

            if (!newEnfermera) {
                return res.status(201).json({
                    success: true,
                    message: 'Enfermera registrada exitosamente',
                    userId: result.insertId
                });
            }

            // Eliminar campos sensibles
            const { password: _, token_reset_password, ...enfermeraData } = newEnfermera;

            res.status(201).json({
                success: true,
                message: 'Enfermera registrada exitosamente con rol de ENFERMERA',
                userId: result.insertId,
                user: enfermeraData
            });

        } catch (error) {
            console.error('❌ Error en registro de enfermera:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor al registrar enfermera',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    /**
     * Obtener todas las enfermeras
     * GET /api/enfermeras
     */
    getAll: async (req, res) => {
        try {
            const enfermeras = await Enfermera.findAll();

            res.json({
                success: true,
                count: enfermeras.length,
                data: enfermeras
            });

        } catch (error) {
            console.error('❌ Error obteniendo enfermeras:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener la lista de enfermeras',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    /**
     * Obtener una enfermera por ID
     * GET /api/enfermeras/:id
     */
    getById: async (req, res) => {
        try {
            const { id } = req.params;

            const enfermera = await Enfermera.findById(id);

            if (!enfermera) {
                return res.status(404).json({
                    success: false,
                    message: 'Enfermera no encontrada'
                });
            }

            // Eliminar campos sensibles
            const { password, token_reset_password, ...enfermeraData } = enfermera;

            res.json({
                success: true,
                data: enfermeraData
            });

        } catch (error) {
            console.error('❌ Error obteniendo enfermera:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener datos de la enfermera',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    /**
     * Actualizar datos de enfermera
     * PUT /api/enfermeras/:id
     */
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const {
                nombre,
                apellido,
                email,
                telefono,
                direccion,
                fecha_nacimiento,
                genero
            } = req.body;

            // Verificar que la enfermera existe
            const enfermera = await Enfermera.findById(id);

            if (!enfermera) {
                return res.status(404).json({
                    success: false,
                    message: 'Enfermera no encontrada'
                });
            }

            // Actualizar datos
            await Enfermera.update(id, {
                nombre,
                apellido,
                email,
                telefono,
                direccion,
                fecha_nacimiento,
                genero
            });

            // Obtener datos actualizados
            const updatedEnfermera = await Enfermera.findById(id);
            const { password, token_reset_password, ...enfermeraData } = updatedEnfermera;

            res.json({
                success: true,
                message: 'Datos de enfermera actualizados exitosamente',
                data: enfermeraData
            });

        } catch (error) {
            console.error('❌ Error actualizando enfermera:', error);
            res.status(500).json({
                success: false,
                message: 'Error al actualizar datos de la enfermera',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    /**
     * Desactivar enfermera
     * DELETE /api/enfermeras/:id
     */
    deactivate: async (req, res) => {
        try {
            const { id } = req.params;

            // Verificar que la enfermera existe
            const enfermera = await Enfermera.findById(id);

            if (!enfermera) {
                return res.status(404).json({
                    success: false,
                    message: 'Enfermera no encontrada'
                });
            }

            // Desactivar enfermera
            await Enfermera.deactivate(id);

            res.json({
                success: true,
                message: 'Enfermera desactivada exitosamente'
            });

        } catch (error) {
            console.error('❌ Error desactivando enfermera:', error);
            res.status(500).json({
                success: false,
                message: 'Error al desactivar enfermera',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    /**
     * Obtener estadísticas de una enfermera
     * GET /api/enfermeras/:id/stats
     */
    getStats: async (req, res) => {
        try {
            const { id } = req.params;

            // Verificar que la enfermera existe
            const enfermera = await Enfermera.findById(id);

            if (!enfermera) {
                return res.status(404).json({
                    success: false,
                    message: 'Enfermera no encontrada'
                });
            }

            // Obtener estadísticas
            const stats = await Enfermera.getStats(id);

            res.json({
                success: true,
                data: {
                    enfermera: {
                        id: enfermera.id,
                        nombre: `${enfermera.nombre} ${enfermera.apellido}`,
                        usuario: enfermera.usuario
                    },
                    estadisticas: stats
                }
            });

        } catch (error) {
            console.error('❌ Error obteniendo estadísticas:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener estadísticas de la enfermera',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
};

module.exports = enfermeraController;



