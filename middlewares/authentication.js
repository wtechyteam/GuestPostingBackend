const { validateToken} = require("../services/authentication");

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue) {
      console.log('No token found in cookies');
      return next(); 
    }
    try {
      const userPayload = validateToken(tokenCookieValue);
      console.log('User Payload:', userPayload); 
      req.user = userPayload;
    } catch (error) {
      console.error('Token validation failed:', error.message);
    }
    next(); 
  };
}

module.exports = { checkForAuthenticationCookie };

