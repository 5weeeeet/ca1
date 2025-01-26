const User = require('../models/User');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { phone, email, country, gender, age, password } = req.body;
  try {
    const user = new User({ phone, email, country, gender, age, password });
    await user.save();
    const token = jwt.sign({ userId: user._id }, 'secret_key');
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { phone, password } = req.body;
  try {
    const user = await User.findOne({ phone });
    if (!user || user.password !== password) {
      throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ userId: user._id }, 'secret_key');
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { register, login };