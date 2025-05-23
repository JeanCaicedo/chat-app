const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto';

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Espera formato: Bearer <token>

    if (!token) {
        return res.status(401).json({ message: 'No se proporcionó token. Acceso denegado.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado.' });
    }
}; 