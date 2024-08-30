const { validateToken} = require("../services/authentication");

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue) {
      console.log('No token found in cookies');
      return next(); // Proceed if no token is present
    }
    try {
      const userPayload = validateToken(tokenCookieValue);
      console.log('User Payload:', userPayload); // Log userPayload to ensure it's correct
      req.user = userPayload; // Set the payload to req.user
    } catch (error) {
      console.error('Token validation failed:', error.message);
    }
    next(); // Proceed even if token validation fails
  };
}

module.exports = { checkForAuthenticationCookie };

