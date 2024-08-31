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
        console.log("Product created successfully")

        res.send(newProduct);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Updating a product
router.put('/api/seller/products/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const updates = req.body;
        const product = await Products.findByIdAndUpdate(productId, updates, { new: true });
        if (!product) return res.status(404).send('Product not found');
        res.send(product);
        console.log("product updated successfully")
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


//Deleting a product
router.delete('/api/seller/products/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Products.findById(productId);
        if (!product) return res.status(404).send('Product not found');
        
        // Check if the logged-in user is the owner of the product
        if (product.sellerId.toString() !== req.user.id) {
            return res.status(403).send('Unauthorized action');
        }

        await Products.findByIdAndDelete(productId);
        res.send({ message: 'Product deleted successfully' });
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
