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
  address: [
    {
      userNameAddress: {
        type: String,
        minlength: [3, "Tên phải có ít nhất 3 ký tự"],
        maxlength: [15, "Tên không được vượt quá 15 ký tự"],
      },
      phoneAddress: {
        type: String,
        match: [/^\d{10,11}$/, "Số điện thoại phải có 10-11 chữ số"],
      },
      addressDetail: {
        type: String,
        required: true,
        minlength: [3, "Địa chỉ phải có ít nhất 3 ký tự"],
        maxlength: [60, "Địa chỉ  không được vượt quá 60 ký tự"],
      },
      province: {
        type: String,
        required: true,
      },
      district: {
        type: String,
        required: true,
      },
      ward: {
        type: String,
      },
      addressDetail: {
        type: String,
        required: true,
        maxlength: [50],
      },
    },
  ],
  paymentMethod: { type: String, required: true },
  status: { type: String, default: "Đang xử lý" },
  statuspay: { type: String, default: "Đang xử lý" },
  orderCode: { type: String, required: true },
  // paymentMethod: {
  //   type: String,
  //   enum: ['credit_card', 'paypal', 'momo', 'cash_on_delivery'],
  //   required: true
  // },
  date: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
