const express = require('express');
const router = express.Router();
const Users = require('../models/users'); // Import model User
const Roles = require('../models/roles');
// Thêm người dùng

// API login bằng email và password
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kiểm tra người dùng có tồn tại không
        const user = await Users.findOne({ email: email });
        if (!user) {
            return res.status(400).json({
                "status": 400,
                "message": "Email không tồn tại"
            });
        }

        // Kiểm tra mật khẩu có khớp không
        if (user.password !== password) {
            return res.status(400).json({
                "status": 400,
                "message": "Mật khẩu không chính xác"
            });
        }

        // Đăng nhập thành công
        res.json({
            "status": 200,
            "message": "Đăng nhập thành công",
            "data": user
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            "status": 500,
            "message": "Lỗi server",
            "error": error.message
        });
    }
});


// router.post('/add-user', async (req, res) => {
//     try {
//         const { username, password, phoneNumber, email, birthday, roleName } = req.body;

//         // Tìm vai trò dựa trên roleName mà người dùng đã chọn
//         const role = await Roles.findOne({ name: roleName });

//         if (!role) {
//             return res.status(400).json({
//                 "status": 400,
//                 "message": "Không tìm thấy vai trò với tên này"
//             });
//         }

//         // Tạo đối tượng user mới với id_role và roleName
//         const newUser = new Users({
//             username,  
//             password,  
//             phoneNumber,  
//             email,  
//             birthday,  
//             id_role: role._id,  // Sử dụng id_role từ role tìm được
//             roleName: role.name  // Lưu tên vai trò
//         });

//         // Lưu người dùng mới vào database
//         const result = await newUser.save();

//         if (result) {
//             res.json({
//                 "status": 200,
//                 "message": "Thêm người dùng thành công",
//                 "data": result
//             });
//         } else {
//             res.json({
//                 "status": 400,
//                 "message": "Thêm người dùng không thành công",
//                 "data": result
//             });
//         }

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             "status": 500,
//             "message": "Lỗi server",
//             "error": error.message
//         });
//     }
// });


router.post('/add-user', async (req, res) => {
    try {
        const { username, password, phoneNumber, email, birthday, id_role ,roleName } = req.body;

        // Tìm vai trò dựa trên roleName mà người dùng đã chọn
        const role = await Roles.findOne({ name: roleName });

        if (!role) {
            return res.status(400).json({
                "status": 400,
                "message": "Không tìm thấy vai trò với tên này"
            });
        }

        // Tạo đối tượng user mới với id_role và roleName
        const newUser = new Users({
            username,  
            password,  
            phoneNumber,  
            email,  
            birthday,  
            id_role: role._id,  // Sử dụng id_role từ role tìm được
            roleName: role.name  // Lưu tên vai trò
        });

        // Lưu người dùng mới vào database
        const result = await newUser.save();

        if (result) {
            res.json({
                "status": 200,
                "message": "Thêm người dùng thành công",
                "data": result
            });
        } else {
            res.json({
                "status": 400,
                "message": "Thêm người dùng không thành công",
                "data": result
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            "status": 500,
            "message": "Lỗi server",
            "error": error.message
        });
    }
});



router.get('/get-list-role', async (req, res) => {
    try {
        // Lấy tất cả role từ database mà không cần populate
        const data = await Roles.find(); 
        
        res.json({
            "status": 200,
            "message": "Danh sách role",
            "data": data
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            "status": 500,
            "message": "Lỗi server",
            "error": error.message
        });
    }
});

router.get('/get-role', async (req, res) => {
    try {
        const { roleName } = req.query; // Lấy nameRole từ query parameters
        
        // Tìm role theo nameRole
        const data = await Roles.find(roleName ? { roleName: roleName } : {}); 
        
        res.json({
            "status": 200,
            "message": "role đây",
            "data": data
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            "status": 500,
            "message": "Lỗi server",
            "error": error.message
        });
    }
});




router.post('/add-role', async (req, res) => {
    try {
        const dataRole = req.body;
        const newRole = new Roles({
            roleName: dataRole.roleName, // Lấy từ data.username (không phải data.name)
        });

        const result = await newRole.save(); // Lưu người dùng mới

        if (result) {
            res.json({
                "status": 200,
                "message": "Thêm thành công",
                "data": result
            });
        } else {
            res.json({
                "status": 400,
                "message": "Lỗi, thêm không thành công",
                "data": result
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            "status": 500,
            "message": "Lỗi server",
            "error": error.message
        });
    }
});

module.exports = router;
