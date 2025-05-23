const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/database');
const auth = require('./middleware/auth');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
const port = process.env.PORT || 3001;

// Conectar a MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/rooms', require('./routes/room'));
app.use('/api/messages', require('./routes/message'));

// Ruta protegida de ejemplo
app.get('/api/protegido', auth, (req, res) => {
    res.json({ message: `Acceso concedido. Tu ID de usuario es: ${req.user.id}` });
});

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: 'Backend funcionando correctamente' });
});

// Configuración de Socket.IO
io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);

    // Unirse a una sala
    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`Usuario ${socket.id} se unió a la sala ${roomId}`);
    });

    // Enviar mensaje
    socket.on('send_message', (data) => {
        socket.to(data.roomId).emit('receive_message', data);
    });

    // Desconexión
    socket.on('disconnect', () => {
        console.log('Usuario desconectado:', socket.id);
    });
});

// Iniciar el servidor
server.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
}); 