// middlewares/validateEnfermera.js

/**
 * Middleware para validar datos de registro de enfermera
 */
const validateEnfermeraRegistration = (req, res, next) => {
    const {
        usuario,
        nombre,
        apellido,
        email,
        password
    } = req.body;

    // Array para almacenar errores
    const errors = [];

    // Validar usuario
    if (!usuario || typeof usuario !== 'string') {
        errors.push('El campo usuario es requerido y debe ser texto');
    } else if (usuario.trim().length < 3) {
        errors.push('El usuario debe tener al menos 3 caracteres');
    } else if (usuario.trim().length > 50) {
        errors.push('El usuario no puede tener más de 50 caracteres');
    } else if (!/^[a-zA-Z0-9_]+$/.test(usuario)) {
        errors.push('El usuario solo puede contener letras, números y guiones bajos');
    }

    // Validar nombre
    if (!nombre || typeof nombre !== 'string') {
        errors.push('El campo nombre es requerido y debe ser texto');
    } else if (nombre.trim().length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
    } else if (nombre.trim().length > 100) {
        errors.push('El nombre no puede tener más de 100 caracteres');
    }

    // Validar apellido
    if (!apellido || typeof apellido !== 'string') {
        errors.push('El campo apellido es requerido y debe ser texto');
    } else if (apellido.trim().length < 2) {
        errors.push('El apellido debe tener al menos 2 caracteres');
    } else if (apellido.trim().length > 100) {
        errors.push('El apellido no puede tener más de 100 caracteres');
    }

    // Validar email
    if (!email || typeof email !== 'string') {
        errors.push('El campo email es requerido y debe ser texto');
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push('El email no tiene un formato válido');
        } else if (email.length > 100) {
            errors.push('El email no puede tener más de 100 caracteres');
        }
    }

    // Validar contraseña
    if (!password || typeof password !== 'string') {
        errors.push('El campo password es requerido y debe ser texto');
    } else if (password.length < 6) {
        errors.push('La contraseña debe tener al menos 6 caracteres');
    } else if (password.length > 100) {
        errors.push('La contraseña no puede tener más de 100 caracteres');
    }

    // Validar teléfono (opcional)
    if (req.body.telefono && req.body.telefono.trim()) {
        if (req.body.telefono.length > 20) {
            errors.push('El teléfono no puede tener más de 20 caracteres');
        }
    }

    // Validar género (opcional)
    if (req.body.genero && req.body.genero.trim()) {
        const validGeneros = ['M', 'F', 'O'];
        if (!validGeneros.includes(req.body.genero)) {
            errors.push('El género debe ser M (Masculino), F (Femenino) u O (Otro)');
        }
    }

    // Validar fecha de nacimiento (opcional)
    if (req.body.fecha_nacimiento && req.body.fecha_nacimiento.trim()) {
        const fecha = new Date(req.body.fecha_nacimiento);
        if (isNaN(fecha.getTime())) {
            errors.push('La fecha de nacimiento no tiene un formato válido');
        } else {
            // Verificar que la fecha no sea futura
            if (fecha > new Date()) {
                errors.push('La fecha de nacimiento no puede ser futura');
            }
            // Verificar edad mínima (18 años)
            const edad = Math.floor((new Date() - fecha) / (365.25 * 24 * 60 * 60 * 1000));
            if (edad < 18) {
                errors.push('La enfermera debe tener al menos 18 años');
            }
        }
    }

    // Si hay errores, retornar respuesta de error
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errors: errors
        });
    }

    // Si todo está bien, continuar al siguiente middleware/controlador
    next();
};

/**
 * Middleware para validar datos de actualización de enfermera
 */
const validateEnfermeraUpdate = (req, res, next) => {
    const {
        nombre,
        apellido,
        email
    } = req.body;

    const errors = [];

    // Validar nombre (si se proporciona)
    if (nombre !== undefined) {
        if (typeof nombre !== 'string' || nombre.trim().length < 2) {
            errors.push('El nombre debe tener al menos 2 caracteres');
        } else if (nombre.trim().length > 100) {
            errors.push('El nombre no puede tener más de 100 caracteres');
        }
    }

    // Validar apellido (si se proporciona)
    if (apellido !== undefined) {
        if (typeof apellido !== 'string' || apellido.trim().length < 2) {
            errors.push('El apellido debe tener al menos 2 caracteres');
        } else if (apellido.trim().length > 100) {
            errors.push('El apellido no puede tener más de 100 caracteres');
        }
    }

    // Validar email (si se proporciona)
    if (email !== undefined) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push('El email no tiene un formato válido');
        } else if (email.length > 100) {
            errors.push('El email no puede tener más de 100 caracteres');
        }
    }

    // Validar teléfono (si se proporciona)
    if (req.body.telefono !== undefined && req.body.telefono.trim()) {
        if (req.body.telefono.length > 20) {
            errors.push('El teléfono no puede tener más de 20 caracteres');
        }
    }

    // Validar género (si se proporciona)
    if (req.body.genero !== undefined && req.body.genero.trim()) {
        const validGeneros = ['M', 'F', 'O'];
        if (!validGeneros.includes(req.body.genero)) {
            errors.push('El género debe ser M (Masculino), F (Femenino) u O (Otro)');
        }
    }

    // Validar fecha de nacimiento (si se proporciona)
    if (req.body.fecha_nacimiento !== undefined && req.body.fecha_nacimiento.trim()) {
        const fecha = new Date(req.body.fecha_nacimiento);
        if (isNaN(fecha.getTime())) {
            errors.push('La fecha de nacimiento no tiene un formato válido');
        } else if (fecha > new Date()) {
            errors.push('La fecha de nacimiento no puede ser futura');
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errors: errors
        });
    }

    next();
};

/**
 * Middleware para validar ID de enfermera
 */
const validateEnfermeraId = (req, res, next) => {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
            success: false,
            message: 'ID de enfermera inválido'
        });
    }

    next();
};

/**
 * Middleware para sanitizar datos de entrada
 */
const sanitizeEnfermeraData = (req, res, next) => {
    // Trimear strings
    if (req.body.usuario) req.body.usuario = req.body.usuario.trim();
    if (req.body.nombre) req.body.nombre = req.body.nombre.trim();
    if (req.body.apellido) req.body.apellido = req.body.apellido.trim();
    if (req.body.email) req.body.email = req.body.email.trim().toLowerCase();
    if (req.body.telefono) req.body.telefono = req.body.telefono.trim();
    if (req.body.direccion) req.body.direccion = req.body.direccion.trim();
    if (req.body.genero) req.body.genero = req.body.genero.trim().toUpperCase();

    next();
};

module.exports = {
    validateEnfermeraRegistration,
    validateEnfermeraUpdate,
    validateEnfermeraId,
    sanitizeEnfermeraData
};
