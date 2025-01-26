// const express = require('express');
// const mongoose = require('mongoose');
// const authRoutes = require('./routes/authRoutes');
// const userRoutes = require('./routes/userRoutes');
// const videoRoutes = require('./routes/videoRoutes');

// const app = express();

// mongoose.connect('mongodb://localhost:27017/videochat', { useNewUrlParser: true, useUnifiedTopology: true });

// app.use(express.json());
// app.use(authRoutes);
// app.use(userRoutes);
// app.use(videoRoutes);

// app.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });

// const express = require('express');
// const Pusher = require('pusher');
// const bodyParser = require('body-parser');

// const app = express();
// app.use(bodyParser.json());

// // Инициализация Pusher
// const pusher = new Pusher({
//   appId: "1931874",
//   key: "d1f91a7cd0838753276e",
//   secret: "c794093270ff59bf6dc0",
//   cluster: "eu",
//   useTLS: true
// });

// // Эндпоинт для отправки offer
// app.post('/send-offer', (req, res) => {
//   const { offer } = req.body;

//   // Отправка offer через Pusher
//   pusher.trigger('video-chat-channel', 'offer', { offer });

//   res.status(200).send('Offer отправлен');
// });

// // Эндпоинт для отправки answer
// app.post('/send-answer', (req, res) => {
//   const { answer } = req.body;

//   // Отправка answer через Pusher
//   pusher.trigger('video-chat-channel', 'answer', { answer });

//   res.status(200).send('Answer отправлен');
// });

// // Эндпоинт для отправки candidate
// app.post('/send-candidate', (req, res) => {
//   const { candidate } = req.body;

//   // Отправка candidate через Pusher
//   pusher.trigger('video-chat-channel', 'candidate', { candidate });

//   res.status(200).send('Candidate отправлен');
// });

// // Запуск сервера
// app.listen(3000, () => {
//   console.log('Сервер запущен на http://localhost:3000');
// });

const express = require('express');
const Pusher = require('pusher');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Инициализация Pusher
const pusher = new Pusher({
  appId: "1931874",
  key: "d1f91a7cd0838753276e",
  secret: "c794093270ff59bf6dc0",
  cluster: "eu",
  useTLS: true
});

const usersSearching = []; // Очередь пользователей, ищущих собеседника

// Эндпоинт для поиска собеседника
app.post('/search', (req, res) => {
  const { isSearching } = req.body;

  if (isSearching) {
    usersSearching.push(req.ip); // Добавляем пользователя в очередь поиска
    if (usersSearching.length >= 2) {
      const user1 = usersSearching.shift();
      const user2 = usersSearching.shift();

      // Уведомляем обоих пользователей о найденном собеседнике
      pusher.trigger('video-chat-channel', 'found', { user1, user2 });
    }
  } else {
    // Удаляем пользователя из очереди поиска
    const index = usersSearching.indexOf(req.ip);
    if (index !== -1) {
      usersSearching.splice(index, 1);
    }
  }

  res.status(200).json({ message: 'Запрос обработан' });
});

// Запуск сервера
app.listen(3000, () => {
  console.log('Сервер запущен на http://localhost:3000');
});