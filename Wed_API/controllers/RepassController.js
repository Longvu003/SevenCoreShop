exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.status(400).send({ message: 'Mật khẩu và xác nhận mật khẩu không khớp.' });
  }

  try {
    const otpRecord = await OtpModel.findOne({ userEmail: email, otp: otp });

    if (!otpRecord || (otpRecord.otpExpiry && otpRecord.otpExpiry < Date.now())) {
      return res.status(400).send({ message: 'OTP không hợp lệ hoặc đã hết hạn.' });
    }

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(404).send({ message: 'User không tồn tại.' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    await OtpModel.deleteOne({ _id: otpRecord._id });

    res.status(200).send({ message: 'Đặt lại mật khẩu thành công.' });
  } catch (error) {
    console.error('Lỗi khi đặt lại mật khẩu:', error);
    res.status(500).send({ message: 'Đặt lại mật khẩu thất bại.' });
  }
};