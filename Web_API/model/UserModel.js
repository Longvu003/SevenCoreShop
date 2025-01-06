//khai báo 1 schema cho user
//(_id, email, password, name, role, carts, creatAt, updateAt, avaialble)
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true }, // unique: true để đảm bảo không có email trùng nhau
  password: { type: String, required: true },
  username: { type: String, required: true }, // Thêm trường tên
  numberphone: { type: String, required: true }, // Thêm trường số điện thoại
  address: [
    {
      userNameAddress: {
        type: String,
        minlength: [3, "Tên phải có ít nhất 3 ký tự"],
        maxlength: [15, "Tên không được vượt quá 15 ký tự"],
      },
      phoneAddress: {
        type: String,
        match: [/^\d{10}$/, "Số điện thoại phải có 10 chữ số"],
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
      isDefault: { type: Boolean, default: false },
    },
  ],

  role: { type: Number, default: 1 }, // 1 là user, 2 là admin
  carts: { type: Array, default: [] }, // Lịch sử mua hàng
  isVerify: { type: Number, default: 1 }, // 1: chưa xác thực, 2: đã xác thực
  createdAt: { type: Date, default: Date.now }, // Ngày giờ tạo
  updatedAt: { type: Date, default: Date.now }, // Ngày giờ cập nhật
  available: { type: Boolean, default: true }, // Trạng thái khả dụng
});

// Cập nhật trường 'updatedAt' mỗi khi người dùng được cập nhật
UserSchema.pre("save", function (next) {
  this.updatedAt = Date.now(); // Luôn cập nhật trường 'updatedAt' mỗi khi save
  next();
});

// Tạo model user từ schema UserSchema. Nếu model đã tồn tại thì sử dụng lại, nếu không thì tạo mới.
module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
