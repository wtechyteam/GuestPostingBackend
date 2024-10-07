const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie() {
  return (req, res, next) => {
    // Check for token in cookies
    let token = req.cookies.authToken;

    // If no cookie token, check the Authorization header
    if (!token && req.headers['authorization']) {
      const authHeader = req.headers['authorization'];
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'
      }
    }

    // If no token found in both cookies and headers, log and proceed
    if (!token) {
      console.log('No token found in cookies or headers');
      return next(); 
    }

    try {
      const userPayload = validateToken(token); // Validate the token
      console.log('User Payload:', userPayload); 
      req.user = userPayload;
    } catch (error) {
      console.error('Token validation failed:', error.message);
    }
    next(); // Proceed to the next middleware or route handler
  };
}

module.exports = { checkForAuthenticationCookie };
