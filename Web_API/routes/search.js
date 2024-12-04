const express = require('express');
const router = express.Router();
const User = require('../model/UserModel'); // Đảm bảo import đúng mô hình người dùng

// Định nghĩa route tìm kiếm
router.get('/', async (req, res) => {
    const { name,} = req.body; // Lấy tham số từ query

    // Kiểm tra xem có ít nhất một tham số tìm kiếm không
    if (!name) {
        return res.status(400).json({ message: 'Please provide a name to search.' });
    }

    try {
        const query = {};

        // Thêm điều kiện tìm kiếm theo tên nếu có
        if (name) {
            query.name = new RegExp(name, 'i'); // Tìm kiếm tên không phân biệt chữ hoa chữ thường
        }

        const users = await User.find(query); // Tìm kiếm theo điều kiện
        res.json(users); // Trả về danh sách người dùng
    } catch (err) {
        res.status(500).json({ message: err.message }); // Trả về lỗi nếu có
    }
});

module.exports = router;
