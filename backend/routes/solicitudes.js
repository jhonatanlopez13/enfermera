const express = require('express');
const router = express.Router();
const solicitudesController = require('../controllers/solicitudes.controller');

// Middleware para convertir BigInt a String
const bigIntToStringMiddleware = (req, res, next) => {
    const originalJson = res.json;
    res.json = function (data) {
        const replacer = (key, value) => {
            if (typeof value === 'bigint') {
                return value.toString();
            }
            return value;
        };
        const safeData = JSON.parse(JSON.stringify(data, replacer));
        return originalJson.call(this, safeData);
    };
    next();
};

// Aplicar middleware solo a estas rutas
router.use(bigIntToStringMiddleware);

// Rutas
router.get('/', solicitudesController.getSolicitudes);
router.post('/', solicitudesController.createSolicitud);
router.get('/test', solicitudesController.testConnection);

module.exports = router;