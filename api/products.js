const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Products = require("./../models/products");
const {
  checkForAuthenticationCookie,
} = require("../middlewares/authentication");
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require("./../controllers/wishlistController");
const {
  blockProduct,
  unblockProduct,
  getBlockedProducts,
} = require("./../controllers/blocklistController");
const axios = require("axios");

// Apply the middleware to all routes in this router
router.use(checkForAuthenticationCookie("token"));

// Get all products from all users
router.get("/products", async (req, res) => {
  const { query, tags, language, country } = req.query;

  let filters = {};

  if (query) filters.productName = { $regex: query, $options: "i" }; // Case-insensitive search
  if (tags) filters.tags = { $in: tags.split(",") }; // Assuming tags is a comma-separated string
  if (language) filters.language = language;
  if (country) filters.country = country;

  const products = await Products.find(filters);
  res.json(products);
});

// Get all products from all users
router.get("/products", async (req, res) => {
  try {
    const products = await Products.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.post("/seller/products", async (req, res) => {
  try {
    const { domain, URL } = req.query;
    const {
      language,
      markedSponsoredBy,
      tags,
      requirements,
      buyingBuyerArticle,
      workExamples,
      contentSize,
      contentPlacement,
      writingAndPlacement,
      extraContent,
      specialTopic,
      priceForLinks,
      links,
      contentTypes,
    } = req.body;

    if (!URL) {
      return res.status(400).json({ error: "URL is required" });
    }

    const baseURL = "http://localhost:3001";

    // // Fetch metrics concurrently
    // const [majesticRes, semrushRes, ahrefsDRRes, mozDARes, ahrefsTrafficRes] =
    //   await Promise.allSettled([
    //     axios.get(`${baseURL}/api/domain-metrics?url=${url}`),
    //     axios.get(`${baseURL}/api/semrush-checker?url=${url}`),
    //     axios.get(`${baseURL}/api/ahrefs-dr-checker?url=${url}`),
    //     axios.get(`${baseURL}/api/moz-checker?url=${url}`),
    //     axios.get(`${baseURL}/api/ahrefs-traffic?url=${url}`),
    //   ]);

    // const majestic =
    //   majesticRes.status === "fulfilled"
    //     ? majesticRes.value.data.majesticTF || 0
    //     : 0;
    // const semrushDA =
    //   semrushRes.status === "fulfilled" ? semrushRes.value.data.rank || 0 : 0;
    // const ahrefsDRrange =
    //   ahrefsDRRes.status === "fulfilled"
    //     ? ahrefsDRRes.value.data.domainRating || 0
    //     : 0;
    // const mozDA =
    //   mozDARes.status === "fulfilled" ? mozDARes.value.data.rank || 0 : 0;
    // const ahrefsOrganicTraffic =
    //   ahrefsTrafficRes.status === "fulfilled"
    //     ? ahrefsTrafficRes.value.data.trafficMonthlyAvg || 0
    //     : 0;

    // const {URL} = req.body;

    const newProduct = new Products({
      URL,
      language,
      markedSponsoredBy,
      tags,
      requirements,
      buyingBuyerArticle,
      workExamples,
      contentSize,
      contentPlacement,
      writingAndPlacement,
      extraContent,
      specialTopic,
      priceForLinks,
      links,
      contentTypes,
      // ahrefsOrganicTraffic,
      // majestic,
      // mozDA,
      // semrushDA,
      // ahrefsDRrange,
      seller: req.user.id,
    });

    await newProduct.save();

    const seller = await User.findById(req.user.id);
    seller.sellerProfile.products.push(newProduct._id);
    await seller.save();

    console.log("Product created successfully");
    res.send(newProduct);
  } catch (error) {
  if (error.response) {
    console.error("Server responded with an error:", error.response.data);
    console.error("Status code:", error.response.status);
  } else if (error.request) {
    console.error("No response from server:", error.request);
  } else {
    console.error("Error setting up request:", error.message);
  }
}
});

//search api
router.get("/products/search", async (req, res) => {
  try {
    const { query, URL, tags, language, country } = req.query;

    console.log("Query Params:", { query, URL, tags, language, country }); // Debug logging

    const filter = {};

    if (query) {
      filter.$or = [
        { URL: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
        { language: { $regex: query, $options: "i" } },
        { country: { $regex: query, $options: "i" } },
      ];
    }

    if (tags) {
      filter.tags = { $regex: tags, $options: "i" };
    }
    if (language) {
      filter.language = language;
    }
    if (country) {
      filter.country = country;
    }
    if (URL) {
      filter.URL = URL;
    }

    const products = await Products.find(filter);
    // res.status(200).json(products);
    // const products = await Products.find(filter);
    if (!products.length) {
      return res.status(200).json({ message: "No products found" });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Updating a product
router.put("/seller/products/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const updates = req.body;

    const product = await Products.findById(productId);

    if (!product) return res.status(404).send("Product not found");

    if (product.seller.toString() !== req.user.id) {
      return res.status(403).send("Unauthorized action");
    }

    const updatedProduct = await Products.findByIdAndUpdate(
      productId,
      updates,
      { new: true }
    );
    res.send(updatedProduct);
    console.log("Product updated successfully");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Deleting a product
router.delete("/seller/products/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Products.findById(productId);

    if (!product) return res.status(404).send("Product not found");

    if (product.seller.toString() !== req.user.id) {
      return res.status(403).send("Unauthorized action");
    }

    await Products.findByIdAndDelete(productId);
    res.send({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Getting all orders for a seller
router.get(
  "/seller/orders",
  checkForAuthenticationCookie("authToken"),
  async (req, res) => {
    console.log("Authenticated User:", req.user);
    try {
      const seller = await User.findById(req.user.id).populate(
        "sellerProfile.orders"
      );
      if (!seller) return res.status(404).send("Seller not found");
      res.send(seller.sellerProfile.orders);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
);
router.get("/products/seller/:sellerId", async (req, res) => {
  try {
    const { sellerId } = req.params;
    const products = await Products.find({ seller: sellerId }).populate(
      "seller"
    );
    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this seller" });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// //wishlist products api
// router.post('/wishlist/:productId', checkForAuthenticationCookie('authToken'), addToWishlist);

// router.delete('/wishlist/:productId', checkForAuthenticationCookie('authToken'), removeFromWishlist);

// router.get('/wishlist', checkForAuthenticationCookie('authToken'), getWishlist);

// //Block a product API
// router.post('/block/:productId', checkForAuthenticationCookie('authToken'), blockProduct)

// //Unblock a product API
// router.post('/unblock/:productId', checkForAuthenticationCookie('authToken'), unblockProduct)

// //get all blocked products
// router.get('/blockedProducts', checkForAuthenticationCookie('authToken'), getBlockedProducts)

module.exports = router;
