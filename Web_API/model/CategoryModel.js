const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Định nghĩa Schema cho danh mục
const CategorySchema = new Schema({
    name: { type: String, required: true }, // Tên danh mục
    description: { type: String, default: '' }, // Mô tả danh mục
    images: { type: Array, default: [] } // Danh sách hình ảnh (array)
});

// Đảm bảo rằng mô hình 'Category' chỉ được tạo một lần, tránh lỗi khi tạo nhiều lần
module.exports = mongoose.models.Category || mongoose.model('Category', CategorySchema);
