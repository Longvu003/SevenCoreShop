const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
  cartItems: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Products",
        required: true,
      },
      nameProduct: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, default: 1 },
      images: { type: [String] },
      statusProduct: {
        type: String,
        enum: ["Đang xác nhận", "Đang giao", "Đã hoàn thành", "Đã hủy"],
        default: "Đang xác nhận",
      },

      date: { type: Date, default: Date.now },
    },
  ],
});
module.exports = mongoose.model("carts", CartSchema);
