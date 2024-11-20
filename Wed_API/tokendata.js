const crypto = require('crypto');

// Tạo một khóa bí mật ngẫu nhiên 32 byte (256 bit)
const secretKey = crypto.randomBytes(32).toString('hex');

console.log("Your Secret Key:", secretKey);
// 76379d890898adb806d3e1ee142bc8e2c87e879d19b611884e93053f5164b6ec