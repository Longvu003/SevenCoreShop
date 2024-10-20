const User = require('../controllers/UserModel');

// Tìm kiếm người dùng dựa trên tên và email
const searchUsers = async (req, res) => {
    try {
        const { name } = req.body; // Lấy từ khóa tìm kiếm từ query params

        let searchCriteria = {};

        // Nếu có tên trong query, thêm vào tiêu chí tìm kiếm
        if (name) {
            searchCriteria.name = { $regex: name, $options: 'i' }; // Tìm kiếm tên không phân biệt hoa thường
        }

        const results = await User.find(searchCriteria); // Tìm kiếm trong cơ sở dữ liệu
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error occurred during search', error });
    }
};

module.exports = { searchUsers };
