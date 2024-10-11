const express = require('express');
const router = express.Router();
const User = require('../models/users'); 
const { check, validationResult } = require('express-validator');

// Signup API with validation
router.post('/signup', [
  // Validation rules
  check('fullName').not().isEmpty().withMessage('Full name is required'),
  check('email').isEmail().withMessage('Valid email is required'),
  check('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/\d/).withMessage('Password must contain at least one numeric value')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character'),
  // check('role').not().isEmpty().withMessage('Role is required'),
  check('contact').not().isEmpty().withMessage('Contact information is required'),
  // check('DOB').not().isEmpty().withMessage('Date of birth is required'),
  // check('location').not().isEmpty().withMessage('Location is required')
], async (req, res) => {
  // Find validation errors in the request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, email, password, role, location, contact, DOB } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user 
    const newUser = new User({ fullName, email, password, role, contact, DOB, location });
    await newUser.save();

    const { token } = await User.matchPasswordAndGenerateToken(email, password);
    res.cookie('authToken', token, { httpOnly: true });
    res.status(201).json({ 
      message: 'User created successfully', 
      token, 
      user: { 
        fullName: newUser.fullName, 
        email: newUser.email, 
        role: newUser.role, 
        contact: newUser.contact, 
        DOB: newUser.DOB, 
        location: newUser.location 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Login API with validation
router.post('/login', [
  // Validation rules
  check('email').isEmail().withMessage('Valid email is required'),
  check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
], async (req, res) => {
  // Find validation errors in the request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const { token } = await User.matchPasswordAndGenerateToken(email, password);
    const user = await User.findOne({ email });
    res.cookie('authToken', token, { httpOnly: true });
    res.status(200).json({ 
      message: 'Login successful', 
      token, 
      user: { 
        fullName: user.fullName, 
        email: user.email, 
        _id: user._id 
      } 
    });
    console.log('User ID on successful login:', user._id);
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
//getting a single user
  router.get('/users/:id', async (req, res) => {
    try {
      const {id} = req.params 
      const user = await User.findById(id);
      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching sellers:', error);
      res.status(500).json({ message: 'Failed to fetch sellers', error: error.message });
    }
  });

 //update all users api
 router.put('/users/:id', async (req, res) => {
  const { id } = req.params; 
  const { fullName, email, password, role, contact, DOB, location } = req.body;  

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { fullName, email, password, role, contact, DOB, location },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
});
 
module.exports = router;

//patch request pending