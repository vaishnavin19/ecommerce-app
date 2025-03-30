const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search products
router.get("/search", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: "Query parameter is required" });
  }

  try {
    // Check if query is numeric (likely SKU)
    if (!isNaN(query)) {
      const products = await Product.find({
        "Variant SKU": query.toString(),
      });
      return res.json(products);
    }

    if (query.includes("under") || query.includes("less than")) {
      const price = parseFloat(query.replace(/[^0-9.]/g, ""));
      if (!isNaN(price)) {
        const products = await Product.find({
          "Variant Price": { $lte: price },
        });
        return res.json(products);
      }
    }

    // Default text search
    const products = await Product.find({
      $or: [
        { Title: { $regex: query, $options: "i" } },
        { "Variant SKU": { $regex: query, $options: "i" } },
      ],
    });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
