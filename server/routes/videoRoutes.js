const express = require('express');
const videoController = require('../controllers/videoController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Управление видеосоединениями (требуется авторизация)
router.post('/start', authMiddleware, videoController.startVideoChat);
router.post('/stop', authMiddleware, videoController.stopVideoChat);

module.exports = router;