const jwt = require('jsonwebtoken');
const secret = process.env.SECRET_KEY; //confidential

const createTokenForUser = (user) => {
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };
  
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    console.log('Generated User Token service:', token); 
    return token;
  };
  
  const validateToken = (token) => {
  try {
    return jwt.verify(token, secret); 
  } catch (error) {
    throw new Error('Invalid token');
  }
};

  module.exports = {createTokenForUser, validateToken}