const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Регистрация и авторизация
router.post('/register', userController.register);
router.post('/login', userController.login);

// Получение данных пользователя (требуется авторизация)
router.get('/me', authMiddleware, userController.getUser);

module.exports = router;