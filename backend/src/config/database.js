const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://juliojeancarlos780:jeanjean123@cluster0.dfdnuxq.mongodb.net/chat-app');
        console.log(`MongoDB conectado: ${conn.connection.host}`);
        console.log('Base de datos:', conn.connection.name);
        console.log('Estado de la conexión:', mongoose.connection.readyState);
    } catch (error) {
        console.error('Error de conexión a MongoDB:', error.message);
        console.error('Detalles del error:', error);
        process.exit(1);
    }
};

// Eventos de conexión
mongoose.connection.on('connected', () => {
    console.log('Mongoose conectado a MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Error en la conexión de Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose desconectado');
});

module.exports = connectDB; 