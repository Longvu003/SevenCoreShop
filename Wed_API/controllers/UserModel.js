const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String },
    role: { type: String, default: "1" }, // Để role là string '1' hoặc '2'
    numberphone: { type: String },
    birthday: { type: String },
    address: { type: String },
    isVerify: { type: Number, default: 1 },
    available: { type: Boolean, default: true },
  },
  {
    timestamps: { createdAt: "creatAt", updatedAt: "updateAt" },
  }
);

// Sử dụng model user nếu đã tồn tại, nếu chưa thì tạo mới
module.exports = mongoose.models.user || mongoose.model("user", UserSchema);
