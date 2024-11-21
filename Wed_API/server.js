const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sendResetPasswordEmail = require("./helpers/EmailCofig"); // Import hàm gửi email
// Import routes cho bình luận

const app = express();

// Middleware để xử lý CORS và JSON
app.use(cors());
app.use(bodyParser.json()); // Sử dụng bodyParser để parse JSON

// Route để gửi email đặt lại mật khẩu

app.post("/reset-password", async (req, res) => {
  const { email, otp } = req.body;

  try {
    await sendResetPasswordEmail(email, otp);
    res.status(200).send("Email đặt lại mật khẩu đã được gửi thành công!");
  } catch (error) {
    console.error("Lỗi khi gửi email:", error);
    res.status(500).send("Lỗi khi gửi email đặt lại mật khẩu");
  }
});

// Thêm các routes cho bình luận
// Đảm bảo rằng các route cho bình luận nằm dưới /api/comments

// Cấu hình cổng và khởi động server
const PORT = process.env.PORT || 7777;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
