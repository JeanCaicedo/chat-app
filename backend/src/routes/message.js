const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

// Enviar mensaje a una sala
router.post('/:roomId', auth, messageController.sendMessage);

// Listar mensajes de una sala
router.get('/:roomId', auth, messageController.getMessages);

// Eliminar un mensaje
router.delete('/:id', auth, messageController.deleteMessage);

module.exports = router; 