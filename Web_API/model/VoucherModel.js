const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const voucherSchema = new Schema({
  code: { type: String, required: true, unique: true },
  titleVoucher: { type: String, required: true},
  discountValue: { type: Number, required: true },
  minValue: { type: Number, required: true }, // Thêm trường này
  quantity: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
});

module.exports = mongoose.model("Voucher", voucherSchema);
