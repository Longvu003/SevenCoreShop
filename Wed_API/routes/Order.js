const express = require("express");
const OrderController = require("../controllers/OrderController");
const router = express.Router();

// cập nhật trạng thái đơn hàng 
router.post("/updateStatus", async (req, res) => {
  const { orderId, status } = req.body;
  try {
    const order = await OrderController.updateOrderStatus(req, res);
    return res.status(200).json(order);
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật trạng thái đơn hàng", error: error.message });
  }
});


// Endpoint thanh toán và tạo đơn hàng
router.post("/checkout", OrderController.checkout);
router.get("/cron", OrderController.checkAndUpdateAllOrders);

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

//lấy danh sách tất cả đơn hàng
router.get("/getOrder", async (req, res) => {
  try {
    const orders = await OrderController.getOrder();
    return res.status(200).json(orders);
  } catch (error) {
    console.log("Lỗi nè", error);
  }
});

// router.get("/getOrderUserById", OrderController.getOrderUserById);
module.exports = router;
