const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const videoRoutes = require('./routes/videoRoutes');

const app = express();

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/videochat', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB подключен'))
  .catch((err) => console.error('Ошибка подключения к MongoDB:', err));

// Middleware для обработки JSON
app.use(express.json());

// Маршруты
app.use('/api/users', userRoutes);
app.use('/api/video', videoRoutes);

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Что-то пошло не так!' });
});

module.exports = app;