const User = require('./../models/users');  
const Product = require('./../models/products');

// Add product to wishlist
exports.addToWishlist = async (req, res) => {
    const userId = req.user.id; 
    
    const { productId } = req.params;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if product is already in wishlist
        if (user.buyerProfile.wishlist.includes(productId)) {
            return res.status(400).json({ message: 'Product already in wishlist' });
        }

        // Add product to wishlist
        user.buyerProfile.wishlist.push(productId);
        await user.save();

        res.status(200).json({ message: 'Product added to wishlist', wishlist: user.buyerProfile.wishlist });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {
    const userId = req.user.id; 
    const { productId } = req.params;

    try {
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if product is in wishlist
        if (!user.buyerProfile.wishlist.includes(productId)) {
            return res.status(404).json({ message: 'Product not in wishlist' });
        }

        // Remove product from wishlist
        user.buyerProfile.wishlist = user.buyerProfile.wishlist.filter(id => id.toString() !== productId);
        await user.save();

        res.status(200).json({ message: 'Product removed from wishlist', wishlist: user.buyerProfile.wishlist });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


// Get user's wishlist
exports.getWishlist = async (req, res) => {
    const userId = req.user.id;  
    console.log('Authenticated User:', req.user);

    // if (req.user.role !== 'BUYER') { // Ensure only buyers can access this
    //     return res.status(403).json({ message: 'Access denied, only buyers can access wishlist' });
    // }

    try {
        const user = await User.findById(userId).populate('buyerProfile.wishlist');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ wishlist: user.buyerProfile.wishlist });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
