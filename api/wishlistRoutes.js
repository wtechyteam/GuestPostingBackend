const express = require ('express');
const router = express.Router()
const {addProductToWishlist, removeProductFromWishlist, getWishlistProducts} = require('./../controllers/wishlistController')
const {checkForAuthenticationCookie} = require('./../middlewares/authentication');


router.post("/wishlist/:productId", checkForAuthenticationCookie('authToken'), addProductToWishlist);
router.delete("/wishlist/:productId", checkForAuthenticationCookie('authToken'), removeProductFromWishlist);
router.get("/wishlist", checkForAuthenticationCookie('authToken'), getWishlistProducts);

module.exports = router; 