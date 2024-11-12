const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    id_user: { type: String, required: true }, // ID của người dùng
    amount: { type: Number, required: true, default: 0 }, // Tổng tiền đơn hàng
    products: { type: [String], required: true, default: [] }, // Mảng chứa ID của các sản phẩm
    statusDelivery: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
    statusPay: { 
        type: String, 
        enum: ['Pending', 'Paid', 'Failed', 'Refunded'], // Trạng thái thanh toán
        default: 'Pending' 
    },
    paymentMethod: { type: String, enum: ['Momo'], default: 'Momo' },
    paymentCode: { type: String },  // Thêm dòng này nếu cần
    orderInfo: { type: String, default: '' },  // Thêm trường orderInfo vào đây
    createdAt: { type: Date, default: Date.now },
    UpdatedAt: { type: Date, default: Date.now }, // Ngày cập nhật đơn hàng
    Available: { type: Boolean, default: true } // Tình trạng đơn hàng còn hoạt động hay không
});

// Tạo model Order từ schema OrderSchema
module.exports = mongoose.model('Order', OrderSchema);
