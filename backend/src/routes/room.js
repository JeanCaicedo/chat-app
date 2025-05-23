const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const auth = require('../middleware/auth');

// Crear sala
router.post('/', auth, roomController.createRoom);

// Listar salas
router.get('/', auth, roomController.getRooms);

// Unirse a una sala
router.post('/:id/join', auth, roomController.joinRoom);

// Salir de una sala
router.post('/:id/leave', auth, roomController.leaveRoom);

// Eliminar una sala
router.delete('/:id', auth, roomController.deleteRoom);

module.exports = router; 