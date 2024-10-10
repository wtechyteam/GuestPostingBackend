const User = require('./../models/users');
const Wishlist = require('./../models/wishlistProducts')  
const Product = require('./../models/products');

// Add Product to Wishlist
exports.addProductToWishlist = async (req, res) => {
    try {
      const { productId } = req.params;
      const userId = req.user.id;
  
      // Check if product is already in wishlist
      const isAlreadyWishlisted = await Wishlist.findOne({ userId, productId });
  
      if (isAlreadyWishlisted) {
        return res.status(400).json({ message: "Product is already in wishlist." });
      }
  
      // Create new wishlist entry
      const newWishlistItem = new Wishlist({ userId, productId });
      await newWishlistItem.save();
  
      return res.status(200).json({ message: "Product added to wishlist.", productId });
    } catch (error) {
      console.error("Error adding product to wishlist:", error);
      return res.status(500).json({ message: "Failed to add product to wishlist." });
    }
  };

// Remove Product from Wishlist
exports.removeProductFromWishlist = async (req, res) => {
    try {
      const { productId } = req.params;
      const userId = req.user.id;
  
      // Find and delete the wishlist entry
      const removedWishlistItem = await Wishlist.findOneAndDelete({ userId, productId });
  
      if (!removedWishlistItem) {
        return res.status(400).json({ message: "Product is not in the wishlist." });
      }
  
      return res.status(200).json({ message: "Product removed from wishlist.", productId });
    } catch (error) {
      console.error("Error removing product from wishlist:", error);
      return res.status(500).json({ message: "Failed to remove product from wishlist." });
    }
  };
  
  // Get All Wishlist Products for the Logged-in User
  exports.getWishlistProducts = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const wishlistItems = await Wishlist.find({ userId }).populate("productId");
  
      if (!wishlistItems || wishlistItems.length === 0) {
        return res.status(404).json({ message: "No wishlist products found." });
      }
  
      const products = wishlistItems.map((entry) => entry.productId);
  
      return res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching wishlist products:", error);
      return res.status(500).json({ message: "Failed to fetch wishlist products." });
    }
  };