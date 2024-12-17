//khai báo 1 schema cho product
//(_id, email, password, name, role, carts, creatAt, updateAt, available)
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

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
  },
  color: String,
  size: String,
  status: {
    type: String,
    enum: ["Available", "Out of stock", "Discontinued"],
    default: "Available",
  },
  inventory: { type: Number, default: 0, min: 0 },
  userEmail: { type: String, required: true }, // Thêm trường userEmail
  viewedAt: { type: Date, default: Date.now }, // Thêm trường viewedAt
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
