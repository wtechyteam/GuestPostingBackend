const express = require('express');
const router = express.Router();
const User = require('../models/users'); // Adjust the path as necessary

//signup api
router.post('/signup', async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ fullName, email, password });
    await newUser.save();

    const token = await User.matchPasswordAndGenerateToken(email, password);
    res.cookie('authToken', token, { httpOnly: true });
    res.status(201).json({ message: 'User created successfully', token, user: { fullName: newUser.fullName, email: newUser.email } });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

//login api
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const token = await User.matchPasswordAndGenerateToken(email, password);
      const user = await User.findOne({ email });
      res.cookie('authToken', token, { httpOnly: true });
      res.status(200).json({ message: 'Login successful', token, user: { fullName: user.fullName, email: user.email } });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(400).json({ message: 'Invalid credentials', error: error.message });
    }
  });

//logout api
router.post('/logout', (req, res) => {
    res.clearCookie('authToken');
    res.status(200).json({ message: 'Logout successful' });
  });

//getting all users api
router.get('/users', async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching sellers:', error);
      res.status(500).json({ message: 'Failed to fetch sellers', error: error.message });
    }
  });
module.exports = router;