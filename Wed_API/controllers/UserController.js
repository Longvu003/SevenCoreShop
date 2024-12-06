const userModel = require("../model/UserModel");
const bcrypt = require("bcrypt");
const sendResetPasswordEmail = require("../helpers/EmailCofig");
const httml = require("../helpers/MailContent");
const OtpModel = require("../models/OtpModel");
const crypto = require("crypto"); // Sử dụng để tạo OTP ngẫu nhiên

// Hàm kiểm tra email hợp lệ
const isValidEmail = (email) => {
  const emailRegex = /\S+@\S+\.\S+/;
  return emailRegex.test(email);
};
// Lấy tất cả người dùng
const getAllUser = async () => {
  try {
    const users = await userModel.find();
    return users;
  } catch (error) {
    console.log("Get all user error", error.message);
    throw new Error("Get all user error");
  }
};

// Tìm kiếm user bằng email
const getUserByEmail = async (email) => {
  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      throw new Error("User không tồn tại");
    }
    return user;
  } catch (error) {
    console.log("Get user error", error.message);
    throw new Error("Get user error: " + error.message);
  }
};

// Đăng ký người dùng mới
const register = async (email, password, username, numberphone, address) => {
  try {
    // Kiểm tra email đã tồn tại trong cơ sở dữ liệu
    let user = await userModel.findOne({ email: email });
    if (user) {
      throw new Error("Email đã tồn tại");
    }

    // Mã hóa mật khẩu
    const salt = bcrypt.genSaltSync(10);
    password = bcrypt.hashSync(password, salt);

    // Tạo người dùng mới
    user = new userModel({
      email: email,
      password: password,
      username: username,
      numberphone: numberphone,
      // birthday: birthday,
      address: address,
    });

    // Lưu người dùng
    await user.save();

    return "Đăng kí thành công";
  } catch (error) {
    console.log("Register error", error.message);
    throw new Error("Register error: " + error.message);
  }
};

// Đăng nhập
const login = async (email, password) => {
  try {
    // Tìm kiếm người dùng trong cơ sở dữ liệu theo email
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("Email không tồn tại");
    }

    // So sánh mật khẩu
    const check = bcrypt.compareSync(password, user.password);
    if (!check) {
      throw new Error("Mật khẩu không đúng");
    }

    // Trả về thông tin người dùng nhưng không bao gồm mật khẩu
    return {
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
  } catch (error) {
    console.log("Login error", error.message);
    throw new Error("Login error: " + error.message);
  }
};
// Hàm tạo và lưu OTP
async function generateAndSaveOtp(email) {
  const otp = crypto.randomInt(100000, 999999).toString(); // Tạo OTP 6 chữ số
  const otpExpiry = new Date(Date.now() + 1 * 60 * 1000); // Đặt thời gian hết hạn cho OTP

  // Lưu OTP vào cơ sở dữ liệu
  await OtpModel.create({
    userEmail: email,
    otp: otp,
    otpExpiry: otpExpiry,
    createdAt: new Date(),
  });

  return otp;
}

// Gửi OTP qua email
async function sendOtpMail(email, otp) {
  await sendResetPasswordEmail(email, otp); // Gọi hàm gửi email
}

// Gửi OTP khi người dùng quên mật khẩu
const forgotPassword = async (email) => {
  try {
    const user = await getUserByEmail(email); // Kiểm tra nếu người dùng tồn tại
    if (!user) {
      throw new Error("Không tìm thấy người dùng với email này");
    }

    const otp = await generateAndSaveOtp(email); // Tạo và lưu OTP vào db

    // Gửi OTP qua email
    await sendOtpMail(email, otp);

    return "OTP đã được gửi đến email của bạn";
  } catch (error) {
    console.error("Forgot password error:", error.message);
    throw new Error("Forgot password error: " + error.message);
  }
};

// Đặt lại mật khẩu với OTP hợp lệ
// const resetPassword = async (email, otp, newPassword) => {
//   try {
//     // Tìm kiếm OTP trong cơ sở dữ liệu và xác minh nó có còn hiệu lực không
//     const otpRecord = await OtpModel.findOne({ userEmail: email, otp: otp });
//     if (!otpRecord || otpRecord.otpExpiry < Date.now()) {
//       throw new Error("OTP không hợp lệ hoặc đã hết hạn");
//     }

//     // Mã hóa mật khẩu mới
//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     // Cập nhật mật khẩu cho người dùng
//     const user = await getUserByEmail(email);
//     user.password = hashedPassword;
//     await user.save();

//     // Xóa OTP sau khi sử dụng
//     await OtpModel.deleteOne({ userEmail: email, otp: otp });

//     return "Mật khẩu đã được đặt lại thành công";
//   } catch (error) {
//     console.error("Reset password error:", error.message);
//     throw new Error("Reset password error: " + error.message);
//   }
// };

// Cập nhật thông tin người dùng
const updateUser = async (email, username, numberphone, birthday, address) => {
  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      throw new Error("Email không tồn tại");
    }
    user.username = username;
    user.numberphone = numberphone;
    user.birthday = birthday;
    user.address = address;
    user.updatedAt = Date.now();
    await user.save();

    return "Cập nhật thành công";
  } catch (error) {
    console.log("Update error", error.message);
    throw new Error("Update error: " + error.message);
  }
};

// Xác thực email
const verify = async (email) => {
  try {
    // Kiểm tra xem email có hợp lệ không
    if (!isValidEmail(email)) {
      throw new Error("Email không hợp lệ");
    }

    // Tìm kiếm user trong db theo email
    const user = await userModel.findOne({ email: email });
    if (!user) {
      throw new Error("Email không tồn tại");
    }

    // Kiểm tra xem user đã được xác thực chưa
    if (user.verify) {
      throw new Error("Email đã được xác thực trước đó");
    }

    // Cập nhật user
    user.verify = true;
    user.updatedAt = Date.now();

    // Lưu user
    const result = await user.save();
    return "Xác thực thành công";
  } catch (error) {
    console.log("Verify error:", error.message);
    return "Xác thực thất bại: " + error.message;
  }
};

const updateUserById = async (
  id,
  email,
  password,
  username,
  numberphone,
  address
) => {
  try {
    const user = await userModel.findById(id);
    if (!user) {
      throw new Error("User không tồn tại");
    }

    // Cập nhật thông tin người dùng
    user.email = email;
    user.username = username;
    user.numberphone = numberphone;
    user.address = address;
    user.updatedAt = Date.now();

    // Chỉ băm và cập nhật mật khẩu nếu có giá trị mật khẩu mới được cung cấp
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt); // Băm mật khẩu mới
    }

    await user.save();
    return "Cập nhật người dùng thành công";
  } catch (error) {
    console.log("Update user by id error", error.message);
    throw new Error("Update user by id error");
  }
};

// Xuất khẩu các hàm
module.exports = {
  register,
  login,
  updateUser,
  verify,
  getUserByEmail,
  generateAndSaveOtp,
  forgotPassword,
  // resetPassword,
  sendOtpMail,
  getAllUser,
  updateUserById,
};
