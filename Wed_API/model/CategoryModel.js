//khai báo 1 schema cho product
//(_id, email, password, name, role, carts, creatAt, updateAt, avaialble)
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
});
// tiếng anh, số ít, chữ thường, không dấu, không cách  
//  //tạo model user từ schema UserSchema chưa có thì tạo mới, có rồi thì sử dụng lại
module.exports = mongoose.model.category || mongoose.model('category', CategorySchema); 