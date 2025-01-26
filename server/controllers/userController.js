const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Регистрация нового пользователя
const register = async (req, res) => {
  const { phone, email, country, gender, age, password } = req.body;
  try {
    const user = new User({ phone, email, country, gender, age, password });
    await user.save();
    const token = jwt.sign({ userId: user._id }, 'secret_key', { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Авторизация пользователя
const login = async (req, res) => {
  const { phone, password } = req.body;
  try {
    const user = await User.findOne({ phone });
    if (!user || user.password !== password) {
      throw new Error('Неверные учетные данные');
    }
    const token = jwt.sign({ userId: user._id }, 'secret_key', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Получение данных пользователя
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      throw new Error('Пользователь не найден');
    }
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = { register, login, getUser };