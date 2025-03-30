const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    Handle: String,
    Title: String,
    Vendor: String,
    Type: String,
    Tags: [String],
    "Variant SKU": { type: String, index: true },
    "Variant Price": Number,
    "Image Src": String,
  },
  {
    collection: "Product",
  }
);

module.exports = mongoose.model("Product", productSchema);
