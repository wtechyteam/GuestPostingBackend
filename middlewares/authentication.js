const { validateToken} = require("../services/authentication");

function checkForAuthenticationCookie(authToken) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies.authToken;
    if (!tokenCookieValue) {
      console.log('No token found in cookies');
      console.log(req.cookies.authToken)
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

