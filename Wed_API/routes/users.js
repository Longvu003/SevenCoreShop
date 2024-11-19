var express = require("express");
var router = express.Router();
const { body, query, validationResult } = require("express-validator");
const userController = require("../controllers/UserController");
const OtpModel = require("../models/OtpModel");

// Hàm kiểm tra dữ liệu đầu vào
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Đăng ký
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Email không hợp lệ"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Mật khẩu phải có ít nhất 6 ký tự"),
    body("username")
      .notEmpty()
      .withMessage("Tên người dùng không được để trống"),
    body("numberphone")
      .isMobilePhone()
      .withMessage("Số điện thoại không hợp lệ"),
    body("address").notEmpty().withMessage("Địa chỉ không được để trống"),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { email, password, username, numberphone, address } = req.body;
      const result = await userController.register(
        email,
        password,
        username,
        numberphone,
        address
      );
      return res.status(200).json({ status: true, data: result });
    } catch (error) {
      console.log("Register error", error.message);
      res.status(500).json({ message: error.message });
    }
  }
);

// Đăng nhập
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email không hợp lệ"),
    body("password").notEmpty().withMessage("Mật khẩu không được để trống"),
  ],
  validateRequest,
  async (req, res) => {
    // try {
    //   const { email, password } = req.body;
    //   const result = await userController.login(email, password);
    //   return res.status(200).json(result);
    // } catch (error) {
    //   console.log("Login error", error.message);
    //   res.status(500).json({ message: error.message });
    // }
    const { email, password } = req.body;
    const result = await userController.login(email, password);
    console.log(result);
    if (result) {
      return res.status(200).json({ status: true, data: result });
      // return res.status(200).json(result);
    } else {
      return res
        .status(400)
        .json({ message: "Mật khẩu và xác nhận mật khẩu không khớp." });
    }
  }
);

// Gửi OTP khi quên mật khẩu
router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Email không hợp lệ")],
  validateRequest,
  async (req, res) => {
    const { email } = req.body;
    try {
      // Gửi OTP
      const otp = await userController.generateAndSaveOtp(email);
      await userController.sendOtpMail(email, otp);
      res.status(200).json({ message: "OTP đã được gửi đến email" });
    } catch (error) {
      console.log("Forgot password error", error.message);
      res.status(500).json({ message: error.message });
    }
  }
);

// Đặt lại mật khẩu
// router.post(
//   "/reset-password",
//   [
//     body("email").isEmail().withMessage("Email không hợp lệ"),
//     body("otp").notEmpty().withMessage("OTP không được để trống"),
//     body("newPassword")
//       .isLength({ min: 6 })
//       .withMessage("Mật khẩu mới phải có ít nhất 6 ký tự"),
//     body("confirmPassword")
//       .notEmpty()
//       .withMessage("Xác nhận mật khẩu không được để trống"),
//   ],
//   validateRequest,
//   async (req, res) => {
//     const { email, otp, newPassword, confirmPassword } = req.body;

// Kiểm tra sự khớp của mật khẩu mới và xác nhận mật khẩu
// if (newPassword !== confirmPassword) {
// =======
// router.post("/login", async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     // console.log(req.body);
//     const result = await userController.login(email, password);
//     if (result) {
//       return res.status(200).json({ status: true, data: result });
//       // return res.status(200).json(result);
//     } else {
// >>>>>>> 0c41e54e254d54a59fe560489db8ebd4b695e321
//       return res
//         .status(400)
//         .json({ message: "Mật khẩu và xác nhận mật khẩu không khớp." });
//     }

//       try {
//         await userController.resetPassword(email, otp, newPassword);
//         res.status(200).json({ message: "Đặt lại mật khẩu thành công" });
//       } catch (error) {
//         console.log("Reset password error", error.message);
//         res.status(500).json({ message: error.message });
//       }
//     }
//   }
// );

// Cập nhật tài khoản
router.put(
  "/updateUser",
  [
    body("email").isEmail().withMessage("Email không hợp lệ"),
    body("username")
      .notEmpty()
      .withMessage("Tên người dùng không được để trống"),
    body("numberphone")
      .isMobilePhone()
      .withMessage("Số điện thoại không hợp lệ"),
    body("birthday").notEmpty().withMessage("Ngày sinh không được để trống"),
  ],
  validateRequest,
  async (req, res) => {
    const { email, username, numberphone, address, birthday } = req.body;

    try {
      const result = await userController.updateUser(
        email,
        username,
        numberphone,
        birthday,
        address
      );

      return res.status(200).json({ status: true, data: result });
    } catch (error) {
      console.log("Update error", error.message);
      res.status(500).json({ message: error.message });
    }
  }
);

// Xác thực email
router.get(
  "/xac-thuc-email",
  [query("email").isEmail().withMessage("Email không hợp lệ")],
  validateRequest,
  async (req, res) => {
    const { email } = req.query;
    try {
      const result = await userController.verify(email);
      return res.status(200).json({ status: true, data: result });
    } catch (error) {
      console.log("Verify error", error.message);
      res.status(500).json({ message: error.message });
    }
  }
);

// Lấy user qua email
router.get(
  "/getUserEmail",
  [query("email").isEmail().withMessage("Email không hợp lệ")],
  validateRequest,
  async (req, res) => {
    const { email } = req.query;
    try {
      const result = await userController.getUserByEmail(email);
      return res.status(200).json({ result });
    } catch (error) {
      console.log("Get user error", error.message);
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
