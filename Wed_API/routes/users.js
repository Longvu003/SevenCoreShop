var express = require("express");
var router = express.Router();
const { body, query, validationResult } = require("express-validator");
const userController = require("../controllers/UserController");
const OtpModel = require("../models/OtpModel");
const UserModel = require("../model/UserModel");

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
    const { email, password } = req.body;
    console.log(req.body);
    const result = await userController.login(email, password);
    if (result) {
      return res.status(200).json({ status: true, data: result });
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
  "/updateuser",
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
    const { email, username, numberphone, address } = req.body;

    try {
      const result = await userController.updateUser(
        email,
        username,
        numberphone,
        address
      );

      return res.status(200).json({ status: true, data: result });
    } catch (error) {
      console.log("Update error", error.message);
      res.status(500).json({ message: error.message });
    }
  }
);
router.post("/:id/updateuserbyid", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email, password, username, numberphone, address } = req.body;
    const result = await userController.updateUserById(
      id,
      email,
      password,
      username,
      numberphone,
      address
    );
    return res.status(200).json({
      status: true,
      message: "Cập nhật tài khoản thành công",
      data: result,
    });
  } catch (error) {
    console.log("Update user by id error", error.message);
    res.status(500).json({ status: false, message: error.message });
  }
});

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
      console.log(result);
      return res.status(200).json({ result });
    } catch (error) {
      console.log("Get user error", error.message);
      res.status(500).json({ message: error.message });
    }
  }
);

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
    const result = await userController.login(email, password);
    if (result) {
      return res
        .status(200)
        .json({ status: true, message: "Đăng nhập thành công", data: result });
    } else {
      return res
        .status(400)
        .json({ status: false, message: "Email hoặc mật khẩu không đúng" });
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
    const { email, password, username, numberphone, address } = req.body;
    const result = await userController.update(
      email,
      password,
      username,
      numberphone,
      address
    );
    return res
      .status(200)
      .json({ status: true, message: "Cập nhật thành công", data: result });
  } catch (error) {
    console.log("Update error", error.message);
    res.status(500).json({ status: false, message: error.message });
  }
});
//lấy địa chỉ theo ID
// Lấy địa chỉ của người dùng dựa trên userID
const mongoose = require("mongoose");

router.get("/:id/address", async (req, res) => {
  const { id } = req.params;
  console.log("Received ID:", id); // Kiểm tra ID nhận được

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("Invalid ID:", id);
    return res.status(400).json({ message: "ID không hợp lệ" });
  }

  try {
    const user = await UserModel.findById(id).select("address");
    console.log("User fetched from database:", user); // Log kết quả truy vấn

    if (!user) {
      console.log("User not found with ID:", id);
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // API xác thực email
    // method: GET
    // url: http://localhost:7777/users/verify?email=taitan1922004@gmail.com
    // response: xác thực thành công hoặc thất bại
    router.get("/verify", async (req, res, next) => {
      try {
        const { email } = req.query;
        const result = await userController.verify(email);
        return res
          .status(200)
          .json({ status: true, message: "Xác thực thành công", data: result });
      } catch (error) {
        console.log("Verify error", error.message);
        res.status(500).json({ status: false, message: error.message });
      }
    });

    // Xóa người dùng theo email
    router.get("/delete", async (req, res, next) => {
      try {
        const { email } = req.query;
        const result = await userController.delete(email);
        return res.status(200).json({
          status: true,
          message: "Xóa tài khoản thành công",
          data: result,
        });
      } catch (error) {
        console.log("Delete error", error.message);
        res.status(500).json({ status: false, message: error.message });
      }
    });

    // Lấy người dùng theo ID
    router.get("/getuserbyid", async (req, res, next) => {
      try {
        const { id } = req.query;
        const result = await userController.getUserById(id);
        return res.status(200).json({
          status: true,
          message: "Lấy thông tin tài khoản thành công",
          data: result,
        });
      } catch (error) {
        console.log("Get user by id error", error.message);
        res.status(500).json({ status: false, message: error.message });
      }
    });

    // Lấy tất cả người dùng
    router.get("/getalluser", async (req, res, next) => {
      try {
        const result = await userController.getAllUser();
        return res.status(200).json({
          status: true,
          message: "Lấy thông tin tất cả tài khoản thành công",
          data: result,
        });
      } catch (error) {
        console.log("Get all user error", error.message);
        res.status(500).json({ status: false, message: error.message });
      }
    });

    // Xóa người dùng theo ID
    router.post("/:id/deleteuserbyid", async (req, res, next) => {
      try {
        const { id } = req.params;
        const result = await userController.deleteUserById(id);
        return res.status(200).json({
          status: true,
          message: "Xóa tài khoản thành công",
          data: result,
        });
      } catch (error) {
        console.log("Delete user by id error", error.message);
        res.status(500).json({ status: false, message: error.message });
      }
    });

    // Cập nhật người dùng theo ID
    router.post("/:id/updateuserbyid", async (req, res, next) => {
      try {
        const { id } = req.params;
        const { email, password, username, numberphone, address, role } =
          req.body;
        const result = await userController.updateUserById(
          id,
          email,
          password,
          username,
          numberphone,
          address,
          role
        );
        return res.status(200).json({
          status: true,
          message: "Cập nhật tài khoản thành công",
          data: result,
        });
      } catch (error) {
        console.log("Update user by id error", error.message);
        res.status(500).json({ status: false, message: error.message });
      }
    });

    // Khóa người dùng theo ID
    router.post("/:id/lockuserbyid", async (req, res, next) => {
      try {
        const { id } = req.params;
        const result = await userController.lockUserById(id);
        return res.status(200).json({
          status: true,
          message: "Khóa tài khoản thành công",
          data: result,
        });
      } catch (error) {
        console.log("Lock user by id error", error.message);
        res.status(500).json({ status: false, message: error.message });
      }
    });

    // Mở khóa người dùng theo ID
    router.post("/:id/unlockuserbyid", async (req, res, next) => {
      try {
        const { id } = req.params;
        const result = await userController.unlockUserById(id);
        return res.status(200).json({
          status: true,
          message: "Mở khóa tài khoản thành công",
          data: result,
        });
      } catch (error) {
        console.log("Unlock user by id error", error.message);
        res.status(500).json({ status: false, message: error.message });
      }
    });

    res.status(200).json({ address: user.address });
  } catch (error) {
    console.error("Error fetching user address:", error.message); // Log lỗi
    res.status(500).json({ message: "Lỗi khi lấy địa chỉ người dùng" });
  }
});

module.exports = router;
