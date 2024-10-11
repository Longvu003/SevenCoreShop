const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    // {id, name}
    uaer: { type: Object, required: true },
    total: { type: Number, default: 0 },
    // { id, name, price, quantity}
    product: { type: Array, default: [] },
    // 1: xác nhận, 2 : đang giao, 3 : hoàn thành, 4  : hủy bỏ
    status: { type: Number, default: 1 },
    // ngày giờ mua 
    date: { type: Date, default: Date.now },
});



module.exports = mongoose.models.cart || mongoose.model('cart', CartSchema); 