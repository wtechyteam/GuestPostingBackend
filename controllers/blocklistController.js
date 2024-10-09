const User = require('./../models/users');  
const Product = require('./../models/products');
const mongoose = require('mongoose');
const blockedProducts = require('./../models/blockedProducts')

// Block a Product for the User
exports.blockProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    // Check if the product is already blocked
    const isAlreadyBlocked = await blockedProducts.findOne({ userId, productId });

    if (isAlreadyBlocked) {
      return res.status(400).json({ message: 'Product is already blocked.' });
    }

    // Create a new blocked product entry
    const newBlockedProduct = new blockedProducts({ userId, productId });
    await newBlockedProduct.save();

    res.status(200).json({ message: 'Product blocked successfully.', productId });
  } catch (error) {
    console.error("Error blocking product:", error);
    res.status(500).json({ message: 'Failed to block product.' });
  }
};

// Unblock a Product for the User
exports.unblockProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    // Find and delete the blocked product entry
    const unblockedProduct = await blockedProducts.findOneAndDelete({ userId, productId });

    if (!unblockedProduct) {
      return res.status(400).json({ message: 'Product is not blocked.' });
    }

    return res.status(200).json({ message: 'Product unblocked successfully.', productId });
  } catch (error) {
    console.error("Error unblocking product:", error);
    return res.status(500).json({ message: 'Failed to unblock product.' });
  }
};

// Get all blocked products for the logged-in user
exports.getBlockedProducts = async (req, res) => {
  try {
    // Extract user ID from the request
    const userId = req.user.id;

    const getBlockProducts = await blockedProducts.find({ userId })
      .populate('productId') 

    // If no blocked products are found, return an empty array
    if (!getBlockProducts) {
      return res.status(404).json({ message: 'No blocked products found.' });
    }

    const blockProducts = getBlockProducts.map((entry) => entry.productId)

    // Return the blocked products
    res.status(200).json(blockProducts);
  } catch (error) {
    console.error("Error fetching blocked products:", error);
    return res.status(500).json({ message: 'Failed to fetch blocked products.', error: error.message });
  }
};

// Get all unblocked products for the logged-in user
exports.getUnblockedProducts = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all products
    const allProducts = await Product.find();

    // Get the blocked products for the user
    const blockedProductsList = await blockedProducts.find({ userId });
    const blockedProductIds = blockedProductsList.map((entry) => entry.productId.toString());

    // Filter out the blocked products
    const unblockedProducts = allProducts.filter((product) => !blockedProductIds.includes(product._id.toString()));

    // Return the unblocked products
    res.status(200).json(unblockedProducts);
  } catch (error) {
    console.error("Error fetching unblocked products:", error);
    return res.status(500).json({ message: 'Failed to fetch unblocked products.', error: error.message });
  }
};
