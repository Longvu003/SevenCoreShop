const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FBSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "users", required: true }, // ID người dùng
  favoriteItems: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product", // Tham chiếu đến bảng Product
        required: true,
      },
      nameProduct: { type: String, required: true }, // Tên sản phẩm
      price: { type: Number, required: true }, // Giá sản phẩm
      quantity: { type: Number, default: 1 },
      images: { type: [String] }, // Hình ảnh sản phẩm
      date: { type: Date, default: Date.now }, // Ngày thêm sản phẩm vào danh sách
    },
  ],
});

// Xuất mô hình với tên 'Favorite'
module.exports = mongoose.model("Favorite", FBSchema);
