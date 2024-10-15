//khai báo 1 schema cho product
//(_id, email, password, name, role, carts, creatAt, updateAt, avaialble)
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ProductSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true , default: 0 },
    quantity: { type: Number, default: 0  },
    images: { type: Array, default: [] },
    description: { type: String, default: '' },
    category: { type: Object, default: {} },
    // ngày giờ tạo
    creatAt: { type: Date, default: Date.now },//Date.now để lấy thời gian hiện tại
    // ngày giờ cập nhật
    updateAt: { type: Date, default: Date.now },
    // tài khoản còn hoạt động hay không
    avaialble: { type: Boolean, default: true }
});
// tiếng anh, số ít, chữ thường, không dấu, không cách  
//  //tạo model user từ schema UserSchema chưa có thì tạo mới, có rồi thì sử dụng lại
module.exports = mongoose.model('product', ProductSchema); 