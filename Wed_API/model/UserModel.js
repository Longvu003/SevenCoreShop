const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true }, // unique: true để đảm bảo không có email trùng nhau 
    password: { type: String, required: true },
    username: { type: String, required: true },               // Thêm trường tên
    numberphone: { type: String, required: true },              // Thêm trường số điện thoại
    address: { type: String, required: true },            // Thêm trường địa chỉ
    role: { type: Number, default: 1 },                   // 1 là user, 2 là admin
    carts: { type: Array, default: [] },                  // Lịch sử mua hàng
    isVerify: { type: Number, default: 1 },               // 1: chưa xác thực, 2: đã xác thực
    createdAt: { type: Date, default: Date.now },        // Ngày giờ tạo
    updatedAt: { type: Date, default: Date.now },        // Ngày giờ cập nhật
    available: { type: Boolean, default: true }           // Trạng thái khả dụng
});

// Cập nhật trường 'updatedAt' mỗi khi người dùng được cập nhật
UserSchema.pre('save', function(next) {
    this.updatedAt = Date.now(); // Luôn cập nhật trường 'updatedAt' mỗi khi save
    next();
});

// Tạo model user từ schema UserSchema. Nếu model đã tồn tại thì sử dụng lại, nếu không thì tạo mới.
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
