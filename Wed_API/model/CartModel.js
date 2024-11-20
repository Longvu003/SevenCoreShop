const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new Schema({
  userId: { type: String, required: true },
  productId: { type: String, required: true },
  nameProduct: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  // 1: xác nhận, 2 : đang giao, 3 : hoàn thành, 4  : hủy bỏ
  statusProduct: { type: Number, default: 1 },
  images: {
    type: [String],
  },
  // ngày giờ mua
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.models.cart || mongoose.model("cart", CartSchema);
