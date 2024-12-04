//khai báo 1 schema cho Size
//(_id, namesize , creatAt, updateAt, avaialble)
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const SizeSchema = new Schema({
    namesize: { type: String, required: true },
    // quantity: { type: Number, default: 0  },
    quantity: { type: Number, default: 0 },
    product: { type: ObjectId, default: {} },
    // ngày giờ tạo
    creatAt: { type: Date, default: Date.now },//Date.now để lấy thời gian hiện tại
    // ngày giờ cập nhật
    updateAt: { type: Date, default: Date.now },
    // tài khoản còn hoạt động hay không
    avaialble: { type: Boolean, default: true }
});
//  //tạo model user từ schema UserSchema chưa có thì tạo mới, có rồi thì sử dụng lại
module.exports = mongoose.model('size', SizeSchema);