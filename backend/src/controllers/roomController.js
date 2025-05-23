const Room = require('../models/Room');

// Crear una sala
exports.createRoom = async (req, res) => {
    try {
        const { name, description, isPrivate, maxMembers } = req.body;
        const userId = req.user.id;

        if (!name) {
            return res.status(400).json({ message: 'El nombre de la sala es obligatorio.' });
        }

        const room = new Room({
            name,
            description,
            isPrivate: isPrivate || false,
            createdBy: userId,
            members: [userId],
            maxMembers: maxMembers || 50
        });

        await room.save();
        res.status(201).json({ message: 'Sala creada correctamente', room });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la sala' });
    }
};

// Listar salas (públicas y privadas del usuario)
exports.getRooms = async (req, res) => {
    try {
        const userId = req.user.id;
        // Salas públicas o privadas donde el usuario es miembro
        const rooms = await Room.find({
            $or: [
                { isPrivate: false },
                { members: userId }
            ]
        }).populate('createdBy', 'username email');
        res.json({ rooms });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las salas' });
    }
};

// Unirse a una sala
exports.joinRoom = async (req, res) => {
    try {
        const userId = req.user.id;
        const roomId = req.params.id;

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Sala no encontrada.' });
        }

        // Verificar si ya es miembro
        if (room.members.includes(userId)) {
            return res.status(400).json({ message: 'Ya eres miembro de esta sala.' });
        }

        // Verificar límite de miembros
        if (room.members.length >= room.maxMembers) {
            return res.status(400).json({ message: 'La sala está llena.' });
        }

        room.members.push(userId);
        await room.save();

        res.json({ message: 'Te has unido a la sala correctamente.', room });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al unirse a la sala' });
    }
};

// Salir de una sala
exports.leaveRoom = async (req, res) => {
    try {
        const userId = req.user.id;
        const roomId = req.params.id;

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Sala no encontrada.' });
        }

        // Verificar si el usuario es miembro
        if (!room.members.includes(userId)) {
            return res.status(400).json({ message: 'No eres miembro de esta sala.' });
        }

        // Eliminar usuario del array de miembros
        room.members = room.members.filter(memberId => memberId.toString() !== userId);
        await room.save();

        res.json({ message: 'Has salido de la sala correctamente.', room });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al salir de la sala' });
    }
};

// Eliminar una sala (solo el creador)
exports.deleteRoom = async (req, res) => {
    try {
        const userId = req.user.id;
        const roomId = req.params.id;

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Sala no encontrada.' });
        }

        // Verificar si el usuario es el creador
        if (room.createdBy.toString() !== userId) {
            return res.status(403).json({ message: 'No tienes permisos para eliminar esta sala.' });
        }

        await room.deleteOne();
        res.json({ message: 'Sala eliminada correctamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar la sala' });
    }
}; 