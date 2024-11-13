const userModel = require("../model/UserModel");
const bcrypt = require("bcryptjs");
const { sendMail } = require("../helpers/Mailer");
const httml = require("../helpers/MailContent");

// Đăng ký người dùng mới
const register = async (email, password, name, phone, address) => {
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
      name: name,
      phone: phone,
      address: address,
      available: true, // Mặc định người dùng được kích hoạt
    });

    // Lưu user
    await user.save();

    // Gửi email xác thực tài khoản (tùy chọn)
    // setTimeout(async () => {
    //     const data = {
    //         email: email,
    //         subject: `Xác thực tài khoản ${email}`,
    //         conten: httml.html(name)
    //     }
    //     await sendMail(data)
    // }, 0);

    return "Đăng ký thành công";
  } catch (error) {
    console.log("Register error", error.message);
    throw new Error("Register error");
  }
};

// Đăng nhập
const login = async (email, password) => {
  try {
    const user = await userModel.findOne({ email: email });
    console.log("User found:", user); // Thêm log để kiểm tra thông tin người dùng
    if (!user) {
      throw new Error("Email không tồn tại");
    }

    if (!user.available) {
      throw new Error("Tài khoản của bạn đã bị khóa");
    }

    const check = bcrypt.compareSync(password, user.password);
    console.log("Password check:", check); // Thêm log để kiểm tra kết quả so sánh mật khẩu
    if (check) {
      return {
        _id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address,
        role: user.role,
      };
    }

    return null; // Nếu không tìm thấy user
  } catch (error) {
    console.log("Login error", error.message);
    throw new Error("Login error");
  }
};


// Cập nhật thông tin người dùng
const update = async (email, password, name, phone, address) => {
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

    user.name = name;
    user.phone = phone;
    user.address = address;
    user.updatedAt = Date.now();

    await user.save();
    return "Cập nhật thành công";
  } catch (error) {
    console.log("Update error", error.message);
    throw new Error("Update error");
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
    console.log("Delete error", error.message);
    throw new Error("Delete error");
  }
};

// Lấy tất cả người dùng
const getAllUser = async () => {
  try {
    const users = await userModel.find({}, { password: 0 });
    return users;
  } catch (error) {
    console.log("Get all user error", error.message);
    throw new Error("Get all user error");
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
    console.log("Delete user by id error", error.message);
    throw new Error("Delete user by id error");
  }
};

// Cập nhật người dùng theo ID
const updateUserById = async (id, email, password, name, phone, address, role) => {
  try {
      const user = await userModel.findById(id);
      if (!user) {
          throw new Error("User không tồn tại");
      }

      if (password) {
          const salt = bcrypt.genSaltSync(10);
          password = bcrypt.hashSync(password, salt);
          user.password = password;
      }

      user.email = email;
      user.name = name;
      user.phone = phone;
      user.address = address;
      user.role = role;
      user.updatedAt = Date.now();

      await user.save();
      console.log("User updated successfully:", user); // Thêm log
      return "Cập nhật người dùng thành công";
  } catch (error) {
      console.log("Update user by id error", error.message);
      throw new Error("Update user by id error");
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
    console.log("Lock user by id error", error.message);
    throw new Error("Lock user by id error");
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
    await user.save();
    return "Mở khóa người dùng thành công";
  } catch (error) {
    console.log("Unlock user by id error", error.message);
    throw new Error("Unlock user by id error");
  }
};

module.exports = {
  register, login, update, verify, deleteUser, getAllUser, deleteUserById, updateUserById, lockUserById, unlockUserById
};
