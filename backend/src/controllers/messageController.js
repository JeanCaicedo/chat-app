const Message = require('../models/Message');
const Room = require('../models/Room');

// Enviar mensaje a una sala
exports.sendMessage = async (req, res) => {
    try {
        const userId = req.user.id;
        const roomId = req.params.roomId;
        const { content, type } = req.body;

        if (!content) {
            return res.status(400).json({ message: 'El contenido del mensaje es obligatorio.' });
        }

        // Verificar que la sala existe y el usuario es miembro
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Sala no encontrada.' });
        }
        if (!room.members.includes(userId)) {
            return res.status(403).json({ message: 'No eres miembro de esta sala.' });
        }

        const message = new Message({
            content,
            room: roomId,
            sender: userId,
            type: type || 'text',
            readBy: [userId]
        });
        await message.save();

        res.status(201).json({ message: 'Mensaje enviado correctamente.', data: message });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al enviar el mensaje' });
    }
};

// Listar mensajes de una sala (con paginación)
exports.getMessages = async (req, res) => {
    try {
        const userId = req.user.id;
        const roomId = req.params.roomId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // Verificar que la sala existe y el usuario es miembro
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Sala no encontrada.' });
        }
        if (!room.members.includes(userId)) {
            return res.status(403).json({ message: 'No eres miembro de esta sala.' });
        }

        const messages = await Message.find({ room: roomId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('sender', 'username email');

        res.json({
            messages,
            page,
            limit
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los mensajes' });
    }
};

// Eliminar un mensaje (solo el autor)
exports.deleteMessage = async (req, res) => {
    try {
        const userId = req.user.id;
        const messageId = req.params.id;

        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: 'Mensaje no encontrado.' });
        }

        // Verificar si el usuario es el autor
        if (message.sender.toString() !== userId) {
            return res.status(403).json({ message: 'No tienes permisos para eliminar este mensaje.' });
        }

        await message.deleteOne();
        res.json({ message: 'Mensaje eliminado correctamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el mensaje' });
    }
}; 