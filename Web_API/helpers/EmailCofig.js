const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "thienthtps33246@fpt.edu.vn", // Email của bạn
    pass: "riho gjnw tzsr cyyc", // Mật khẩu ứng dụng hoặc mật khẩu email
  },
});

const sendResetPasswordEmail = (email, otp) => {
  const mailOptions = {
    from: "thienthtps33246@fpt.edu.vn", // Email của bạn
    to: email, // Gửi đến email của người dùng
    subject: "Đặt Lại Mật Khẩu",
    text: `Mã Token của bạn là ${otp}. Dùng Token này để đặt lại mật khẩu của bạn.`,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendResetPasswordEmail;
