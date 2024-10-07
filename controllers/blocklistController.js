const User = require('./../models/users');  
const Product = require('./../models/products');
const mongoose = require('mongoose');

// Block a Product for the User
exports.blockProduct = async (req, res) => {
  try {
    // Extract the user ID from the request (ensure req.user is populated correctly)
    const userId = req.user ? req.user.id : null;
    console.log("User ID:", userId);

    // Check if user ID is present
    if (!userId) {
      return res.status(400).json({ message: 'User not authenticated.' });
    }

    // Extract the product ID from the request parameters
    const productId = req.params.productId;
    console.log("Product ID to block:", productId);

    // Validate product ID format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID.' });
    }

    // Find the user based on the ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the product is already blocked
    if (user.blockedProducts.includes(productId)) {
      return res.status(400).json({ message: 'Product is already blocked.' });
    }

    // Block the product and save the user data
    user.blockedProducts.push(productId);
    await user.save();

    console.log("Product blocked successfully for user:", userId);
    return res.status(200).json({ message: 'Product blocked successfully.' });
  } catch (error) {
    console.error("Error blocking product:", error);
    return res.status(500).json({ message: 'Error blocking product.', error: error.message });
  }
};

// Unblock a Product for the User
exports.unblockProduct = async (req, res) => {
  try {
    // Extract the user ID from the request
    const userId = req.user ? req.user.id : null;
    console.log("User ID:", userId);

    // Check if user ID is present
    if (!userId) {
      return res.status(400).json({ message: 'User not authenticated.' });
    }

    // Extract the product ID from the request parameters
    const productId = req.params.productId;
    console.log("Product ID to unblock:", productId);

    // Validate product ID format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID.' });
    }

    // Find the user based on the ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the product is in the blocked list
    const productIndex = user.blockedProducts.indexOf(productId);
    if (productIndex === -1) {
      return res.status(400).json({ message: 'Product is not blocked.' });
    }

    // Unblock the product by removing it from the array
    user.blockedProducts.splice(productIndex, 1);
    await user.save();

    console.log("Product unblocked successfully for user:", userId);
    return res.status(200).json({ message: 'Product unblocked successfully.' });
  } catch (error) {
    console.error("Error unblocking product:", error);
    return res.status(500).json({ message: 'Error unblocking product.', error: error.message });
  }
};

exports.getBlockedProducts =  async (req,res) => {
  const userId = req.user.id;

  try {
    // Find the user and populate the blockedProducts
    const user = await User.findById(userId).populate('blockedProducts');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ blockedProducts: user.blockedProducts });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching blocked products', error: err.message });
  }
}
