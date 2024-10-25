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
    const salt = bcrypt.genSaltSync(10); // Tạo muối
    password = bcrypt.hashSync(password, salt); // Mã hóa password

    // Tạo mới user
    user = new userModel({
      email: email,      // Thêm trường email
      password: password,
      name: name,        // Thêm trường tên
      phone: phone,      // Thêm trường số điện thoại
      address: address,  // Thêm trường địa chỉ
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
    // Tìm kiếm user trong db theo email
    const user = await userModel.findOne({ email: email });
    if (!user) {
      throw new Error("Email không tồn tại");
    } else {
      // So sánh password
      const check = bcrypt.compareSync(password, user.password); // So sánh password
      // Nếu password đúng thì trả về user
      if (check) {
        return {
          _id: user._id,
          email: user.email,      // Trả về email
          name: user.name,        // Trả về tên
          phone: user.phone,      // Trả về số điện thoại
          address: user.address,  // Trả về địa chỉ
          role: user.role,
        };
      }
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
    // Tìm kiếm user trong db theo email
    const user = await userModel.findOne({ email: email });
    if (!user) {
      throw new Error("Email không tồn tại");
    }
    
    // Mã hóa password nếu được cung cấp
    if (password) {
      const salt = bcrypt.genSaltSync(10); // Tạo muối
      password = bcrypt.hashSync(password, salt); // Mã hóa password
      user.password = password;
    }
    
    // Cập nhật thông tin
    user.name = name;            // Cập nhật tên
    user.phone = phone;          // Cập nhật số điện thoại
    user.address = address;      // Cập nhật địa chỉ
    user.updatedAt = Date.now();

    // Lưu user
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
// delete user
const deleteUser = async (email) => {
  try {
    // Tìm kiếm user trong db theo email
    const user = await userModel.findOne({ email: email });
    if (!user) {
      throw new Error("Email không tồn tại");
    }

    // Xóa user
    await userModel.deleteOne({ email: email });

    return "Xóa người dùng thành công";
  } catch (error) {
    console.log("Delete error", error.message);
    throw new Error("Delete error");
  }
};

// get all user
const getAllUser = async () => {
  try {
    // Lấy danh sách user
    const users = await userModel.find();
    return users;
  } catch (error) {
    console.log("Get all user error", error.message);
    throw new Error("Get all user error");
  }
};
//delete user by id
const deleteUserById = async (id) => {
  try {
    // Tìm kiếm user trong db theo id
    const user
      = await userModel.findByIdAndDelete(id);
    if (!user) {
      throw new Error("User không tồn tại");
    }
  } catch (error) {
    console.log("Delete user by id error", error.message);
    throw new Error("Delete user by id error");
  }
}
//update user by id
const updateUserById = async (id, email, password, name, phone, address) => {
  try {
    // Tìm kiếm user trong db theo id
    const user = await userModel
      .findById(id);
    if (!user) {
      throw new Error("User không tồn tại");
    }
    // Mã hóa password nếu được cung cấp
    if (password) {
      const salt = bcrypt.genSaltSync(10); // Tạo muối
      password = bcrypt.hashSync(password, salt); // Mã hóa password
      user.password = password;
    }
    // Cập nhật thông tin
    user.email = email;        // Cập nhật email
    user.name = name;          // Cập nhật tên
    user.phone = phone;        // Cập nhật số điện thoại
    user.address = address;    // Cập nhật địa chỉ
    user.updatedAt = Date.now();
    // Lưu user
    await user.save();
    return "Cập nhật người dùng thành công";
  }
  catch (error) {
    console.log("Update user by id error", error.message);
    throw new Error("Update user by id error");
  }
}



module.exports = { register, login, update, verify, deleteUser, getAllUser,deleteUserById, updateUserById };
