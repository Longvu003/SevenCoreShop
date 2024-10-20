const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true }, // unique: true để đảm bảo không có email trùng nhau 
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: Number, default: 1 }, // 1 là user, 2 là admin (thay đổi từ String sang Number cho đồng nhất)
    carts: { type: Array, default: [] }, // lịch sử mua hàng
    isVerify: { type: Number, default: 1 }, // 1: chưa xác thực, 2: đã xác thực
    creatAt: { type: Date, default: Date.now }, // ngày giờ tạo
    updateAt: { type: Date, default: Date.now }, // ngày giờ cập nhật
    available: { type: Boolean, default: true } // sửa typo từ 'avaialble' thành 'available'
});

// Cập nhật trường 'updateAt' mỗi khi người dùng được cập nhật
UserSchema.pre('save', function(next) {
    if (this.isModified('updateAt')) {
        this.updateAt = Date.now();
    }
    next();
});

// Tạo model user từ schema UserSchema. Nếu model đã tồn tại thì sử dụng lại, nếu không thì tạo mới.
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
