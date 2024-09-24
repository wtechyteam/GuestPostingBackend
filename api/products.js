const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Products = require('./../models/products')
const { checkForAuthenticationCookie } = require('../middlewares/authentication');
const {addToWishlist, removeFromWishlist, getWishlist} = require('./../controllers/wishlistController')

// Apply the middleware to all routes in this router
router.use(checkForAuthenticationCookie('token')); 

// Get all products from all users
router.get('/api/products', async (req, res) => {
    try {
        const products = await Products.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


// Getting all products for a seller
router.get('/seller/products', async (req, res) => {
    try {
        console.log('Request User:', req.user); 
        const seller = await User.findById(req.user.id).populate('sellerProfile.products');
        if (!seller) return res.status(404).send('Seller not found');
        res.send(seller.sellerProfile.products);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


// Creating a product
router.post('/seller/products', async (req, res) => {
    try {
        const { 
            URL, tags, language, country, pricing, contentSize, links,tat,ahrefsDRrange,
            contentPlacement, writingAndPlacement, completionRate, avgLifetimeOfLinks,
            ahrefsOrganicTraffic, totalTraffic, markedSponsoredBy, taskDomainPrice,
            mozDA, semrushDA, 
        } = req.body;
        
        const newProduct = new Products({
            URL,
            tags,
            language,
            country,
            pricing,
            contentSize,
            links,
            tat,
            contentPlacement,
            writingAndPlacement,
            completionRate,
            avgLifetimeOfLinks,
            ahrefsOrganicTraffic,
            totalTraffic,
            markedSponsoredBy,
            taskDomainPrice,
            mozDA,
            semrushDA,
            ahrefsDRrange,
            seller: req.user.id 
        });

        await newProduct.save();

        const seller = await User.findById(req.user.id);
        seller.sellerProfile.products.push(newProduct._id);
        await seller.save();

        console.log("Product created successfully");
        res.send(newProduct);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


//search for products
router.get('/products/search', async (req,res) => {
    try{
        const {query, tags, language, country} = req.query;

        const filter = {};

        if (query) {
            filter.$or = [
                { URL: { $regex: query, $options: 'i' } },
                { tags: { $regex: query, $options: 'i' } },
                { language: { $regex: query, $options: 'i' } },
                { country: { $regex: query, $options: 'i' } },
            ];
        }

        if (tags) {
            filter.tags = { $regex: tags, $options: 'i'};
        }
        if (language) {
            filter.language = language;
        }
        if (country) {
            filter.country = country;
        }
        const products = await Products.find(filter);

        res.status(200).json(products);
        } catch (error) {
            res.status(500).send({ error: error.message });
    }
})


// Updating a product
router.put('/seller/products/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const updates = req.body;

        const product = await Products.findById(productId);

        if (!product) return res.status(404).send('Product not found');

        if (product.seller.toString() !== req.user.id) {
            return res.status(403).send('Unauthorized action');
        }

        const updatedProduct = await Products.findByIdAndUpdate(productId, updates, { new: true });
        res.send(updatedProduct);
        console.log("Product updated successfully");
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Deleting a product
router.delete('/seller/products/:productId', async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await Products.findById(productId);

        if (!product) return res.status(404).send('Product not found');

        if (product.seller.toString() !== req.user.id) {
            return res.status(403).send('Unauthorized action');
        }

        await Products.findByIdAndDelete(productId);
        res.send({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});




// Getting all orders for a seller
router.get('/seller/orders', async (req, res) => {
    try {
        const seller = await User.findById(req.user.id).populate('sellerProfile.orders');
        if (!seller) return res.status(404).send('Seller not found');
        res.send(seller.sellerProfile.orders);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.post('/wishlist/:productId', checkForAuthenticationCookie('authToken'), addToWishlist);

router.delete('/wishlist/:productId', checkForAuthenticationCookie('authToken'), removeFromWishlist);

router.get('/wishlist', checkForAuthenticationCookie('authToken'), getWishlist);

module.exports = router;
