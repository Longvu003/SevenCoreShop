const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors
const sendResetPasswordEmail = require('./helpers/EmailCofig'); // Import hàm gửi email

const app = express();
app.use(cors()); // Thêm middleware CORS
app.use(bodyParser.json());

// Route để gửi email đặt lại mật khẩu
app.post('/reset-password', async (req, res) => {
    const { email, otp } = req.body; // Lấy email và token từ yêu cầu

    try {
        await sendResetPasswordEmail(email, otp); // Gọi hàm gửi email
        res.status(200).send('Email đặt lại mật khẩu đã được gửi thành công!');
    } catch (error) {
        console.error('Lỗi khi gửi email:', error);
        res.status(500).send('Lỗi khi gửi email đặt lại mật khẩu');
    }
});

const PORT = process.env.PORT || 7777;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
