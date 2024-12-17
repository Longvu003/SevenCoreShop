//khai báo 1 schema cho product
//(_id, email, password, name, role, carts, creatAt, updateAt, available)
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  quantity: { type: Number, default: 0 },
  images: { type: Array, default: [] },
  description: { type: String, default: "" },
  category: { type: Object, default: {} },
  color: String,
  size: String,
  available: { type: Boolean, default: true },
  userEmail: { type: String, required: true }, // Thêm trường userEmail
  viewedAt: { type: Date, default: Date.now }, // Thêm trường viewedAt
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
