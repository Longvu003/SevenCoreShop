const sendMail = require("../helpers/EmailCofig");
const crypto = require("crypto");
const OtpModel = require("../models/OtpModel");
const UserModel = require("../model/UserModel");
const bcrypt = require("bcrypt");
const { sendOtpMail } = require("../controllers/UserController");

function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

async function generateAndSaveOtp(email) {
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 1 * 60 * 1000);

  await OtpModel.create({
    userEmail: email,
    otp: otp,
    otpExpiry: otpExpiry,
    createdAt: new Date(),
  });

  return otp;
}

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(404).send({ message: "Email không tồn tại." });
    }

    const otp = await generateAndSaveOtp(email);

    await sendOtpMail(email, otp);

    res
      .status(200)
      .send({
        message: "Mã xác thực đặt lại mật khẩu đã được gửi đến email của bạn.",
      });
  } catch (error) {
    console.error("Lỗi khi gửi mã OTP:", error);
    res.status(500).send({ message: "Gửi mã OTP thất bại." });
  }
};
