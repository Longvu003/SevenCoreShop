const express = require('express');
const router = express.Router();
const forgotPasswordController = require('../controllers/ForgotpasswordController'); // Đảm bảo đường dẫn chính xác

// Route POST /forgot-password
router.post('/', forgotPasswordController.forgotPassword);

module.exports = router;
