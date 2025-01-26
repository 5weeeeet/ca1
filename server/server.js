const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const videoRoutes = require('./routes/videoRoutes');

const app = express();

mongoose.connect('mongodb://localhost:27017/videochat', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use(authRoutes);
app.use(userRoutes);
app.use(videoRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});