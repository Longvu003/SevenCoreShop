const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product",
      },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      image: {
        type: [String],
      },
    },
  ],
  totalAmount: { type: Number, required: true },
  address: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  numberphone: { type: String, required: true },
  status: { type: String, default: "Đang xử lý" },
  statuspay: { type: String, default: "Đang xử lý" },
  orderCode: { type: String, required: true },
  // paymentMethod: {
  //   type: String,
  //   enum: ['credit_card', 'paypal', 'momo', 'cash_on_delivery'],
  //   required: true
  // },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'failed'],
    default: 'unpaid'
  },
  deliveryStatus: {
    type: String,
    enum: ['pending', 'shipped', 'delivered'],
    default: 'pending'
  },
  payUrl: {
    type: String
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  date: { type: Date, default: Date.now },
  
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;