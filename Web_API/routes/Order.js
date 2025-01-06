const express = require("express");
const OrderController = require("../controllers/OrderController");
const router = express.Router();
const moment = require("moment-timezone");

// cập nhật trạng thái thanh toán
router.post("/updateStatusPay", async (req, res) => {
  const { orderId, statuspay } = req.body;
  try {
    const order = await OrderController.updateStatusPay(req, res);
    return res.status(200).json(order);
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái thanh toán:", error);
    res.status(500).json({
      message: "Lỗi khi cập nhật trạng thái thanh toán",
      error: error.message,
    });
  }
});

// cập nhật trạng thái đơn hàng
router.post("/updateStatus", async (req, res) => {
  const { orderId, status } = req.body;
  try {
    const order = await OrderController.updateOrderStatus(req, res);
    return res.status(200).json(order);
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
    res.status(500).json({
      message: "Lỗi khi cập nhật trạng thái đơn hàng",
      error: error.message,
    });
  }
});

router.post("/checkout", OrderController.checkout);
router.get("/cron", OrderController.checkAndUpdateAllOrders);

router.get("/getOrderUser", OrderController.getOrderUser);

router.get("/getOrderUserById", async (req, res) => {
  const { userId } = req.query;
  try {
    const orders = await OrderController.getOrderUserById(userId);
    const itemOrder = orders.map((order) => ({
      ...order._doc,
      date: moment(order.date)
        .tz("Asia/Ho_Chi_Minh")
        .format("YYYY-MM-DD HH:mm:ss"),
    }));
    console.log(itemOrder);
    if (itemOrder) {
      return res.status(200).json(itemOrder);
    } else {
      return res.status(404).json((message = "Không tìm thấy sản phẩm"));
    }
  } catch (error) {
    console.log("Lỗi nè", error);
  }
});

router.post("/searchOrder", OrderController.searchOrder);

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

router.get("/top-order", OrderController.getBestSellingProducts);

router.get("/pho-bien", OrderController.getPopularProducts);

module.exports = router;
