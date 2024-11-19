const OrderController = require("../controllers/OrderController");
const express = require("express");
const router = express.Router();
router.post("/checkout", OrderController.checkout);

router.get("/getOrderUser", async (req, res) => {
  try {
    const itemOrder = await OrderController.getOrderUser();
    if (itemOrder) {
      return res.status(200).json(itemOrder);
    } else {
      return res.status(404).json({ message: "Có lỗi khi lấy sản phẩm !" });
    }
  } catch (error) {
    console.log("Lỗi nè", error);
  }
});

router.get("/getOrderUserById", async (req, res) => {
  const { userId } = req.query;
  try {
    const itemOrder = await OrderController.getOrderUser(userId);

    if (itemOrder) {
      return res.status(200).json(itemOrder);
    } else {
      return res.status(404).json((message = "Không tìm thấy sản phẩm"));
    }
  } catch (error) {
    console.log("Lỗi nè", error);
  }
});
module.exports = router;
