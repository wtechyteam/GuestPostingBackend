const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Products = require('./../models/products')
const { checkForAuthenticationCookie } = require('../middlewares/authentication');

// Apply the middleware to all routes in this router
router.use(checkForAuthenticationCookie('token')); // Adjust the cookie name if different

// Getting all products for a seller
router.get('/api/seller/products', async (req, res) => {
    try {
        console.log('Request User:', req.user); // Log to see if _id is present
        const seller = await User.findById(req.user.id).populate('sellerProfile.products');
        if (!seller) return res.status(404).send('Seller not found');
        res.send(seller.sellerProfile.products);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


// Creating a product
router.post('/api/seller/products', async (req, res) => {
    try {
        const { URL, tags, language, country, pricing, contentSize, links } = req.body;
        const newProduct = new Products({
            URL,
            tags,
            language,
            country,
            pricing,
            contentSize,
            links,
            sellerId: req.user.id
        });

        await newProduct.save();

        const seller = await User.findById(req.user.id);
        seller.sellerProfile.products.push(newProduct._id);
        await seller.save();

        res.send(newProduct);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Getting all orders for a seller
router.get('/api/seller/orders', async (req, res) => {
    try {
        const seller = await User.findById(req.user.id).populate('sellerProfile.orders');
        if (!seller) return res.status(404).send('Seller not found');
        res.send(seller.sellerProfile.orders);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;
