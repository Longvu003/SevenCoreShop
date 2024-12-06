const express = require("express");
const OrderController = require("../controllers/OrderController");
const router = express.Router();

// Endpoint thanh toán và tạo đơn hàng
router.post("/checkout", OrderController.checkout);

// Endpoint lấy danh sách tất cả đơn hàng
router.get("/getOrderUser", OrderController.getOrderUser);

router.get("/getOrderUserById", async (req, res) => {
  const { userId } = req.query;
  try {
    const itemOrder = await OrderController.getOrderUserById(userId);
    if (itemOrder) {
      return res.status(200).json(itemOrder);
    } else {
      return res.status(404).json((message = "Không tìm thấy sản phẩm"));
    }
  } catch (error) {
    console.log("Lỗi nè", error);
  }
});
// router.get("/getOrderUserById", OrderController.getOrderUserById);
module.exports = router;
