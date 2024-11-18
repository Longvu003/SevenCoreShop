const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
      images: [String],
    },
  ],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ["COD"], required: true },
  status: { type: String, default: "Đang giao hàng" }, // Trạng thái đơn hàng
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", OrderSchema);
