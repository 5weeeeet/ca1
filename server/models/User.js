const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  country: { type: String, required: true },
  gender: { type: String, required: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);