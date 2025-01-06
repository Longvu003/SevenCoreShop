const express = require('express');
const router = express.Router();
const VoucherController = require("../controllers/VoucherController");

// Validate voucher
router.post("/validate", VoucherController.validateVoucher);

// Create a new voucher (Admin function)
router.post("/create", VoucherController.createVoucher);

// Get all vouchers (Admin function)
router.get("/", VoucherController.getVouchers);

module.exports = router;
