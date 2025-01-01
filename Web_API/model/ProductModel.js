const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    quantity: { type: Number, default: 0 },
    images: { type: [String], default: [] }, // Mảng chứa các URL hình ảnh
    description: { type: String, default: "" },
    category: {
      category_id: { type: Object, ref: "Category", required: true },
      category_name: { type: String, required: true },
    },
    availaable: { type: Boolean, default: true },
  },
  {
    timestamps: true, // Tự động tạo createdAt và updatedAt
  }
);
// Tạo model từ schema
module.exports = mongoose.model("Product", ProductSchema);
