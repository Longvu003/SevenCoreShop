var express = require("express");
var router = express.Router();
const userController = require("../controllers/UserController");
// http://localhost:7777/users

/**
 * register
 * method: post
 * url: http://localhost:7777/users/register
 * body: {email: 'admin@gmail.com', password: 1}
 * response: trả về thông tin user nếu đăng kí thành công, trả về lỗi nếu đăng kí thất bại
 */

router.post("/register", async (req, res, next) => {
  try {
    //lấy thông tin từ body
    const { email, password, name } = req.body;
    console.log(req.body);
    //gọi hàm register từ userController
    const result = await userController.register(email, password, name);
    return res.status(200).json({ status: true, data: result });
  } catch (error) {
    console.log("Register error", error.message);
    res.status(500).json({ message: error.message });
  }
});

/**
 * login
 * method: post
 * url: http://localhost:7777/users/login
 * body: {email: 'admin@gmail.com', password: 1}
 * response: trả về thông tin user nếu đăng nhập thành công, trả về lỗi nếu đăng nhập thất bại
 */
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const result = await userController.login(email, password);
    if (result) {
      return res.status(200).json({ status: true, data: result });
    } else {
      return res
        .status(400)
        .json({ status: false, message: "Email hoặc mật khẩu không đúng" });
    }
  } catch (error) {
    console.log("Login error", error.message);
    res.status(500).json({ message: error.message });
  }
});

//API cập nhật tài khoản
// method: post
// url: http://localhost:7777/users/cap-nhat-tai-khoan
// kết quả: cập nhật thành công hoặc thất bại
router.post("/cap-nhat-tai-khoan", async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const result = await userController.update(email, password, name);
    return res.status(200).json({ status: true, data: result });
  } catch (error) {
    console.log("Update error", error.message);
    res.status(500).json({ message: error.message });
  }
});

//API xác thực email
// method: get
// url: http://localhost:7777/users/xac-thuc-email?email=taitan1922004@gmail.com&code=1
// kết quả: xác thực thành công hoặc thất bại
router.get("/xac-thuc-email", async (req, res, next) => {
  try {
    const { email, code } = req.query;
    const result = await userController.verify(email, code);
    return res.status(200).json({ status: true, data: result });
  } catch (error) {
    console.log("Verify error", error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
