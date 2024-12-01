const express = require("express");
const OrderController = require("../controllers/OrderController");
const router = express.Router();

// Endpoint thanh toán và tạo đơn hàng
router.post("/checkout", OrderController.checkout);

// Endpoint lấy danh sách tất cả đơn hàng
router.get("/getOrderUser", OrderController.getOrderUser);

// Endpoint lấy đơn hàng theo ID người dùng
router.get("/getOrderUserById", OrderController.getOrderUserById);

module.exports = router;
