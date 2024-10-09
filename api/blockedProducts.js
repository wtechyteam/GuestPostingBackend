const express = require ('express');
const router = express.Router()
const {blockProduct, unblockProduct, getBlockedProducts, getUnblockedProducts} = require('./../controllers/blocklistController')
const {checkForAuthenticationCookie} = require('./../middlewares/authentication');


router.get('/blockedProducts', checkForAuthenticationCookie('authToken'), getBlockedProducts);

router.post('/block/:productId', checkForAuthenticationCookie('authToken'), blockProduct);

router.post('/unblock/:productId', checkForAuthenticationCookie('authToken'), unblockProduct);

router.get('/unblockedProducts', checkForAuthenticationCookie('authToken'), getUnblockedProducts)

module.exports = router;