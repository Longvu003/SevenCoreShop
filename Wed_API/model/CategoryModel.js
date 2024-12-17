//huy
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Định nghĩa Schema cho danh mục
const CategorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  images: { type: Array, default: [] },
});

// Sửa lại phần xuất model:
module.exports =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);
