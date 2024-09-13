const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Product = require("./../models/products");
const Order = require("./../models/orders");
const { checkForAuthenticationCookie } = require("./../middlewares/authentication");

router.post("/orders", checkForAuthenticationCookie("authToken"), async (req, res) => {
    try {
      const { productId, quantity } = req.body;

      //authentication
      if (!req.user || !req.user.id) {
        return res
          .status(401)
          .json({ message: "Authentication required to place an order" });
      }
      // Validation
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      const seller = await User.findById(product.seller);
      if (!seller) {
        return res.status(404).json({ message: "Seller not found" });
      }

      const totalPrice = product.pricing * quantity;

      const newOrder = new Order({
        buyerId: req.user.id,
        sellerId: product.seller,
        productId,
        quantity,
        price: totalPrice,
      });

      await newOrder.save();
      console.log("starting success");
      console.log("New Order Details:", newOrder);
      console.log("Seller Profile before Push:", seller.sellerProfile);
      console.log("Buyer Profile before Push:", buyer.buyerProfile);

      // Optionally update buyer's order history
      if (!buyer.buyerProfile) {
        buyer.buyerProfile = { orders: [] }; 
      }
      buyer.buyerProfile.orders.push(newOrder._id);

      // Optionally update seller's order history
      if (!seller.sellerProfile) {
        seller.sellerProfile = { orders: [] }; 
      }
      seller.sellerProfile.orders.push(newOrder._id);

      res.status(201).json({
        message: "Order placed successfully",
        order: newOrder,
      });
    } catch (error) {
      console.error("Error placing order:", error);
      res.status(500).json({
        message: "Server error while placing order",
        error: error.message,
      });
    }
  }
);

router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().populate("buyer seller products");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("orders/buyer/:buyerId", async (req, res) => {
  try {
    const { buyerId } = req.params;
    const orders = await Order.find({ buyer: buyerId }).populate(
      "products seller"
    );
    if (orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this buyer" });
    }
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/orders/seller/:sellerId", async (req, res) => {
  try {
    const { sellerId } = req.params;
    const orders = await Order.find({ seller: sellerId }).populate(
      "products buyer"
    );
    if (orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this seller" });
    }
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
