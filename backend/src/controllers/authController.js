const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto';

// Registro de usuario
exports.register = async (req, res) => {
    try {
        const { email, password, username } = req.body;

        // Validar campos
        if (!email || !password || !username) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
        }

        // Verificar si el usuario ya existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'El correo ya está registrado.' });
        }

        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear usuario
        const user = new User({
            email,
            password: hashedPassword,
            username
        });
        await user.save();

        // Generar token JWT
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            message: 'Usuario registrado correctamente',
            user: {
                id: user._id,
                email: user.email,
                username: user.username
            },
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Login de usuario
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar campos
        if (!email || !password) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
        }

        // Buscar usuario
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Credenciales inválidas.' });
        }

        // Comparar contraseñas
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales inválidas.' });
        }

        // Generar token JWT
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({
            message: 'Login exitoso',
            user: {
                id: user._id,
                email: user.email,
                username: user.username
            },
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}; 