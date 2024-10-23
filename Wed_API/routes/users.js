var express = require("express");
var router = express.Router();
const userController = require("../controllers/UserController");

// http://localhost:7777/users

/**
 * Đăng ký người dùng
 * method: POST
 * url: http://localhost:7777/users/register
 * body: {email: 'admin@gmail.com', password: '1', name: 'Admin', phone: '0123456789', address: '123 Street'}
 * response: trả về thông tin user nếu đăng ký thành công, trả về lỗi nếu đăng ký thất bại
 */
router.post("/register", async (req, res, next) => {
  try {
    const { email, password, name, phone, address } = req.body;
    console.log(req.body);
    const result = await userController.register(email, password, name, phone, address);
    return res.status(201).json({ status: true, message: "Đăng ký thành công", data: result });
  } catch (error) {
    console.log("Register error", error.message);
    res.status(500).json({ status: false, message: error.message });
  }
});

/**
 * Đăng nhập người dùng
 * method: POST
 * url: http://localhost:7777/users/login
 * body: {email: 'admin@gmail.com', password: '1'}
 * response: trả về thông tin user nếu đăng nhập thành công, trả về lỗi nếu đăng nhập thất bại
 */
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const result = await userController.login(email, password);
    if (result) {
      return res.status(200).json({ status: true, message: "Đăng nhập thành công", data: result });
    } else {
      return res.status(400).json({ status: false, message: "Email hoặc mật khẩu không đúng" });
    }
  } catch (error) {
    console.log("Login error", error.message);
    res.status(500).json({ status: false, message: error.message });
  }
});

// API cập nhật tài khoản
// method: POST
// url: http://localhost:7777/users/cap-nhat-tai-khoan
// body: {email: 'admin@gmail.com', password: 'newpassword', name: 'New Name', phone: '0987654321', address: '456 Avenue'}
// response: cập nhật thành công hoặc thất bại
router.post("/updateuser", async (req, res, next) => {
  try {
    const { email, password, name, phone, address } = req.body;
    const result = await userController.update(email, password, name, phone, address);
    return res.status(200).json({ status: true, message: "Cập nhật thành công", data: result });
  } catch (error) {
    console.log("Update error", error.message);
    res.status(500).json({ status: false, message: error.message });
  }
});

// API xác thực email
// method: GET
// url: http://localhost:7777/users/xac-thuc-email?email=taitan1922004@gmail.com&code=1
// response: xác thực thành công hoặc thất bại
router.get("/xac-thuc-email", async (req, res, next) => {
  try {
    const { email, code } = req.query;
    const result = await userController.verify(email, code);
    return res.status(200).json({ status: true, message: "Xác thực thành công", data: result });
  } catch (error) {
    console.log("Verify error", error.message);
    res.status(500).json({ status: false, message: error.message });
  }
});

router.get("/delete", async (req, res, next) => {
  try {
    const { email } = req.query;
    const result = await userController.delete(email);
    return res.status(200).json({ status: true, message: "Xóa tài khoản thành công", data: result });
  } catch (error) {
    console.log("Delete error", error.message);
    res.status(500).json({ status: false, message: error.message });
  }
});
//get user by id
router.get("/getuserbyid", async (req, res, next) => {
  try {
    const { id } = req.query;
    const result = await userController.getUserById(id);
    return res.status(200).json({ status: true, message: "Lấy thông tin tài khoản thành công", data: result });
  } catch (error) {
    console.log("Get user by id error", error.message);
    res.status(500).json({ status: false, message: error.message });
  }
});

//get all user
router.get("/getalluser", async (req, res, next) => {
  try {
    const result = await userController.getAllUser();
    return res.status(200).json({ status: true, message: "Lấy thông tin tất cả tài khoản thành công", data: result });
  } catch (error) {
    console.log("Get all user error", error.message);
    res.status(500).json({ status: false, message: error.message });
  }
});

//delete user by id
router.post("/:id/deleteuserbyid", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await userController.deleteUserById(id);
    return res.status(200).json({ status: true, message: "Xóa tài khoản thành công", data: result });
  } catch (error) {
    console.log("Delete user by id error", error.message);
    res.status(500).json({ status: false, message: error.message });
  }
}
);


module.exports = router;

