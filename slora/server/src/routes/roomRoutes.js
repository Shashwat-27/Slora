const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const authMiddleware = require('../middlewares/authMiddleware');

// Apply authentication middleware to all room routes
router.use(authMiddleware);

// Room routes
router.post('/', roomController.createRoom);
router.get('/:roomId', roomController.getRoomInfo);
router.post('/:roomId/join', roomController.joinRoom);
router.post('/:roomId/leave', roomController.leaveRoom);

module.exports = router; 