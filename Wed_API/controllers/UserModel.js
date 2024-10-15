//khai báo 1 schema cho user
//(_id, email, password, name, role, carts, creatAt, updateAt, avaialble)
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
    email: { type: String, required: true , unique: true},//unique: true để đảm bảo không có email trùng nhau 
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, default: 1 },//1 là user, 2 là admin
    // lịch sử mua hàng
    carts: { type: Array, default: [] },
    //xác thực tài khoản
    // 1: chưa xác thực, 2: đã xác thực
    isVerify: { type: Number, default: 1 },
    // ngày giờ tạo
    creatAt: { type: Date, default: Date.now },//Date.now để lấy thời gian hiện tại
    // ngày giờ cập nhật
    updateAt: { type: Date, default: Date.now },
    // tài khoản còn hoạt động hay không
    avaialble: { type: Boolean, default: true }
    });
// tiếng anh, số ít, chữ thường, không dấu, không cách  
//  //tạo model user từ schema UserSchema chưa có thì tạo mới, có rồi thì sử dụng lại
module.exports = mongoose.model.user || mongoose.model('user', UserSchema); 