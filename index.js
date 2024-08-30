const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

//Initialize the app
const app = express();

//Port setup
const PORT = process.env.PORT || 3001;

//Middlewares
const { checkForAuthenticationCookie } = require('./middlewares/authentication');
const { validateToken } = require('./services/authentication');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));

//route
const signupRoute = require('./api/users')
const loginRoute = require('./api/users')
const logoutRoute = require('./api/users')
const getAllUsers = require('./api/users')
const getAllProducts = require('./api/products')
app.use('/api', signupRoute)
app.use('/api', loginRoute)
app.use('/api', logoutRoute)
app.use('/api', getAllUsers)
app.use('/api', getAllProducts)
app.get('/test', (req, res) => {
  console.log('Request User:', req.user); // Check if user is set
  res.send(req.user ? req.user : 'No user found');
});


//database setup
mongoose.connect('mongodb://127.0.0.1/GuestPosting')
.then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

//error handling middleware
  app.use((err, req, res, next) => {
    console.error('Server error:', err); // Log the error
    res.status(500).json({ message: 'Something broke!', error: err.message });
  });
  
  
  // Start server
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));