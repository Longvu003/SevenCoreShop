const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 0 },
  images: [String],
  description: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  }, // category là ObjectId
  color: String,
  size: String,
  status: {
    type: String,
    enum: ["Available", "Out of stock", "Discontinued"],
    default: "Available",
  },
  inventory: { type: Number, default: 0, min: 0 },
});

const Product = mongoose.model("Products", productSchema);
module.exports = Product;
