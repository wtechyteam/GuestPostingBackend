const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser')

require('dotenv').config();


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
const searchProducts = require('./api/products')
const ordersRouter = require('./api/orders')
const rapidapi = require('./api/rapidAPI')


app.use('/api', signupRoute)
app.use('/api', loginRoute)
app.use('/api', logoutRoute)
app.use('/api', getAllUsers)
app.use('/api', getAllProducts)
app.use('/api', searchProducts)
app.use('/api', ordersRouter)
app.use('/api', rapidapi)

app.get('/test', (req, res) => {
  console.log('Request User:', req.user); // Check if user is set
  res.send(req.user ? req.user : 'No user found');
});

//error handling middleware
  app.use((err, req, res, next) => {
    console.error('Server error:', err); // Log the error
    res.status(500).json({ message: 'Something broke!', error: err.message });
  });
  
//database setup
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));  
  
// Start server
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));