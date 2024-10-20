const userModel = require("./UserModel");
const bcrypt = require("bcryptjs");
const { sendMail } = require("../helpers/Mailer");
const httml = require("../helpers/MailContent");

// đăng ký người dùng mới
const register = async (email, password, name, phone) => {
  try {
    // tìm kiếm email trong database
    let user = await userModel.findOne({ email: email });
    if (user) {
      throw new Error("Email đã tồn tại");
    }
    
    // mã hóa password
    const salt = bcrypt.genSaltSync(10); // tạo muối
    password = bcrypt.hashSync(password, salt); // mã hóa password

    // tạo mới user
    user = new userModel({
      email: email,
      password: password,
      name: name,
      phone: phone, // thêm trường số điện thoại
    });

    // lưu user
    const result = await user.save();
    
    // gửi email xác thực tài khoản
    // setTimeout(async () => {
    //     const data = {
    //         email: email,
    //         subject: `Xác thực tài khoản ${email}`,
    //         conten: httml.html(name)
    //     }
    //     await sendMail(data)
    // }, 0);
    
    return "Đăng kí thành công";
  } catch (error) {
    console.log("Register error", error.message);
    throw new Error("Register error");
  }
};

// đăng nhập
const login = async (email, password) => {
  try {
    // tìm kiếm user trong db theo email
    const user = await userModel.findOne({ email: email });
    if (!user) {
      throw new Error("Email không tồn tại");
    } else {
      // so sánh password
      const check = bcrypt.compareSync(password, user.password); // so sánh password
      // nếu password đúng thì trả về user
      if (check) {
        // xóa field password trc khi trả về
        // delete user._doc.password;
        return {
          _id: user._id,
          email: user.email,
          name: user.name,
          phone: user.phone, // thêm số điện thoại vào kết quả trả về
          role: user.role,
        };
      }
    }
    return null; // nếu không tìm thấy user
  } catch (error) {
    console.log("Login error", error.message);
    throw new Error("Login error");
  }
};

// cập nhật thông tin người dùng
const update = async (email, password, name, phone) => {
  try {
    // tìm kiếm user trong db theo email
    const user = await userModel.findOne({ email: email });
    if (!user) {
      throw new Error("Email không tồn tại");
    }
    
    // mã hóa password nếu được cung cấp
    if (password) {
      const salt = bcrypt.genSaltSync(10); // tạo muối
      password = bcrypt.hashSync(password, salt); // mã hóa password
      user.password = password;
    }
    
    // cập nhật thông tin
    user.name = name;
    user.phone = phone; // thêm trường số điện thoại
    user.updatedAt = Date.now();

    // lưu user
    const result = await user.save();

    return "Cập nhật thành công";
  } catch (error) {
    console.log("Update error", error.message);
    throw new Error("Update error");
  }
};

// xác thực email
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

// Hàm kiểm tra email hợp lệ
const isValidEmail = (email) => {
  const emailRegex = /\S+@\S+\.\S+/;
  return emailRegex.test(email);
};

module.exports = { register, login, update, verify };
