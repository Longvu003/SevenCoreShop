const userModel = require("../model/UserModel");
const bcrypt = require("bcryptjs");
const httml = require("../helpers/MailContent");
const OtpModel = require("../models/OtpModel");
const crypto = require("crypto");
const sendResetPasswordEmail = require("../helpers/EmailCofig");
const UserModel = require("../model/UserModel");
const { default: mongoose } = require("mongoose");

// Đăng ký người dùng mới
const register = async (email, password, username, numberphone) => {
  try {
    // Tìm kiếm email trong database
    let user = await userModel.findOne({ email: email });
    if (user) {
      throw new Error("Email đã tồn tại");
    }

    // Mã hóa password
    const salt = bcrypt.genSaltSync(10);
    password = bcrypt.hashSync(password, salt);

    // Tạo mới user
    user = new userModel({
      email: email,
      password: password,
      username: username,
      numberphone: numberphone,

      available: true, // Mặc định người dùng được kích hoạt
    });

    // Lưu user
    await user.save();

    return "Đăng ký thành công";
  } catch (error) {
    console.log("Lỗi Đăng ký", error.message);
    throw new Error("Lỗi Đăng ký");
  }
};

// Đăng nhập
const login = async (email, password) => {
  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      throw new Error("Email không tồn tại");
    }

    if (!user.available) {
      throw new Error("Tài khoản của bạn đã bị khóa");
    }

    const check = bcrypt.compareSync(password, user.password);
    if (check) {
      return {
        _id: user._id,
        email: user.email,
        username: user.username,
        numberphone: user.numberphone,
        address: user.address,
        role: user.role,
      };
    }

    return null; // Nếu không tìm thấy user
  } catch (error) {
    console.log("Lỗi đăng nhập", error.message);
    throw new Error("Lỗi đăng nhập");
  }
};

// Cập nhật thông tin người dùng
const update = async (email, password, username, numberphone, address) => {
  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      throw new Error("Email không tồn tại");
    }

    if (password) {
      const salt = bcrypt.genSaltSync(10);
      password = bcrypt.hashSync(password, salt);
      user.password = password;
    }

    user.username = username;
    user.numberphone = numberphone;
    user.address = address;
    user.updatedAt = Date.now();

    await user.save();
    return "Cập nhật thành công";
  } catch (error) {
    console.log("Lỗi cập nhật người dùng", error.message);
    throw new Error("Lỗi cập nhật người dùng");
  }
};

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

// Xác thực email
const verify = async (email) => {
  try {
    if (!isValidEmail(email)) {
      throw new Error("Email không hợp lệ");
    }

    const user = await userModel.findOne({ email: email });
    if (!user) {
      throw new Error("Email không tồn tại");
    }

    if (user.verify) {
      throw new Error("Email đã được xác thực trước đó");
    }

    user.verify = true;
    user.updatedAt = Date.now();

    await user.save();
    return "Xác thực thành công";
  } catch (error) {
    console.log("Verify error:", error.message);
    return "Xác thực thất bại: " + error.message;
  }
};

// Hàm kiểm tra email hợp lệ
const isValidEmail = (email) => {
  const emailRegex = /\S+@\S+\.\S+/;
  return emailRegex.test(email);
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

// Xóa người dùng
const deleteUser = async (email) => {
  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      throw new Error("Email không tồn tại");
    }

    await userModel.deleteOne({ email: email });
    return "Xóa người dùng thành công";
  } catch (error) {
    console.log("Xóa người dùng thất bại", error.message);
    throw new Error("Xóa người dùng thất bại");
  }
};

// Lấy tất cả người dùng
const getAllUser = async () => {
  try {
    const users = await userModel.find({}, { address: 0 });
    return users;
  } catch (error) {
    console.log("Lỗi lấy dữ liệu người dùng", error.message);
    throw new Error("Lỗi lấy dữ liệu người dùng");
  }
};

// Xóa người dùng theo ID
const deleteUserById = async (id) => {
  try {
    const user = await userModel.findByIdAndDelete(id);
    if (!user) {
      throw new Error("User không tồn tại");
    }
    return "Xóa người dùng thành công";
  } catch (error) {
    console.log("Lỗi xóa người dùng bằng id", error.message);
    throw new Error("Lỗi xóa người dùng bằng id");
  }
};

// Cập nhật người dùng theo ID
const updateUserById = async (
  id,
  // email,
  username,
  numberphone,
  // address,
  role
) => {
  try {
    const user = await userModel.findById(id);
    if (!user) {
      throw new Error("User không tồn tại");
    }
    // user.email = email;
    user.username = username;
    user.numberphone = numberphone;
    // user.address = address.map((item) => ({
    //   nameAddress: item.nameAddress,
    //   address: item.address,
    //   isDefault: item.isDefault,
    // }));
    user.role = role;
    user.updatedAt = Date.now();
    await user.save();
    return "Cập nhật người dùng thành công";
  } catch (error) {
    console.log("Lỗi cập nhật user bằng id", error.message);
    throw new Error("Lỗi cập nhật user bằng id");
  }
};

// Đặt lại mật khẩu với OTP hợp lệ
const resetPassword = async (email, otp, newPassword) => {
  try {
    // Tìm kiếm OTP trong cơ sở dữ liệu và xác minh nó có còn hiệu lực không
    const otpRecord = await OtpModel.findOne({ userEmail: email, otp: otp });
    if (!otpRecord || otpRecord.otpExpiry < Date.now()) {
      throw new Error("OTP không hợp lệ hoặc đã hết hạn");
    }

    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu cho người dùng
    const user = await getUserByEmail(email);
    user.password = hashedPassword;
    await user.save();

    // Xóa OTP sau khi sử dụng
    await OtpModel.deleteOne({ userEmail: email, otp: otp });

    return "Mật khẩu đã được đặt lại thành công";
  } catch (error) {
    console.error("Reset password error:", error.message);
    throw new Error("Reset password error: " + error.message);
  }
};

// Khóa người dùng theo ID
const lockUserById = async (id) => {
  try {
    const user = await userModel.findById(id);
    if (!user) {
      throw new Error("User không tồn tại");
    }
    user.available = false; // Khóa người dùng
    user.updatedAt = Date.now();
    await user.save();
    return "Khóa người dùng thành công";
  } catch (error) {
    console.log("Lỗi khóa người dùng bằng id", error.message);
    throw new Error("Lỗi khóa người dùng bằng id");
  }
};

// Mở khóa người dùng theo ID
const unlockUserById = async (id) => {
  try {
    const user = await userModel.findById(id);
    if (!user) {
      throw new Error("User không tồn tại");
    }

    user.available = true; // Mở khóa người dùng
    user.updatedAt = Date.now();
    await user.update();
    return "Mở khóa người dùng thành công";
  } catch (error) {
    console.log("Lỗi mở khóa người dùng bằng id", error.message);
    throw new Error("Lỗi mở khóa người dùng bằng id");
  }
};

const getUserById = async (id) => {
  // const ObjectId = new mongoose.Types.ObjectId(id);
  const item = await UserModel.findOne({ id });

  if (!item) {
    return null;
  }
  return item;
};

module.exports = {
  register,
  login,
  update,
  verify,
  deleteUser,
  getAllUser,
  deleteUserById,
  updateUserById,
  lockUserById,
  unlockUserById,
  generateAndSaveOtp,
  forgotPassword,
  resetPassword,
  getUserByEmail,
  sendOtpMail,
  generateAndSaveOtp,
  getUserById,
};
