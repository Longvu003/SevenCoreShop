const mongoose = require("mongoose");
var express = require("express");

var router = express.Router();

const cartController = require("../controllers/CartController");

/**
 * Thêm sản phẩm vào giỏ hàng
 * Method: POST
 * Body: {userId, productId, nameProduct, quantity, price, images}
 * URL: http://localhost:7777/carts/addItemcart
 * Return: {message, result}
 */
router.post("/addItemcart", async (req, res) => {
  try {
    // console.log("Dữ liệu nhận được từ client:", req.body);
    const { userId, productId, nameProduct, quantity, price, images } =
      req.body;
    const result = await cartController.add(
      userId,
      productId,
      nameProduct,
      quantity,
      price,
      images
    );
    return res.status(200).json({ message: "Thêm thành công", result });
  } catch (error) {
    console.error("Lỗi trong route /addItemcart:", error.stack);
    return res.status(500).json({ status: false, data: error.message });
  }
});

/**
 * Lấy toàn bộ sản phẩm trong giỏ hàng của người dùng
 * Method: GET
 * Query: id (userId)
 * URL: http://localhost:7777/carts/getItemCartById?id=12345
 * Return: {status, data, result}
 */
router.get("/getItemCartById", async (req, res) => {
  try {
    const userId = req.query.userId;

    const result = await cartController.getItemCart(userId);

    const totalPrice = result.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    return res.status(200).json({ status: true, data: totalPrice, result });
  } catch (error) {
    return res.status(500).json({ status: false, data: error.message });
  }
});

/**
 * Xóa sản phẩm khỏi giỏ hàng
 * Method: DELETE
 * Body: {userId, productId, quantity}
 * URL: http://localhost:7777/carts/deleteItemCart
 * Return: {message}
 */
router.delete("/deleteItemCart", async (req, res) => {
  const { userId, productId, quantity } = req.body;
  console.log(
    "Nhận yêu cầu xóa sản phẩm với userId:",
    userId,
    "productId:",
    productId,
    "và quantity:",
    quantity
  );

  try {
    const { success, message, itemDeleted } =
      await cartController.deleteItemcart(userId, productId);

    if (!success) {
      console.log("Lỗi khi xóa sản phẩm:", message);
      return res.status(404).json({ message }); // Nếu không thành công, trả về 404
    }

    // Nếu sản phẩm tồn tại trong giỏ hàng
    itemDeleted.quantity -= quantity;

    // Nếu quantity còn lại <= 0, xóa sản phẩm khỏi giỏ hàng
    if (itemDeleted.quantity <= 0) {
      await itemDeleted.deleteOne();
      return res
        .status(200)
        .json({ message: "Sản phẩm đã được xóa thành công" });
    } else {
      await itemDeleted.save();
      return res.status(200).json({ itemDeleted });
    }
  } catch (error) {
    console.log("Lỗi xử lý yêu cầu:", error);
    return res.status(500).json({ status: false, data: error.message });
  }
});

/**
 * Cập nhật số lượng sản phẩm trong giỏ hàng
 * Method: PUT
 * Body: {userId, productId, quantity}
 * URL: http://localhost:7777/carts/updateItemCart
 * Return: {message, item, totalPrice}
 */
router.put("/updateItemCart", async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    const { success, item, message } = await cartController.updateItemCart(
      userId,
      productId,
      quantity
    );

    if (!success) {
      return res.status(404).json({ message });
    }

    // Nếu cập nhật thành công, tính lại tổng giá của giỏ hàng
    const cart = await cartController.getItemCart(userId);
    if (!cart || cart.length === 0) {
      return res
        .status(404)
        .json({ message: "Giỏ hàng trống hoặc không tồn tại", totalPrice: 0 });
    }

    const totalPrice = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    return res
      .status(200)
      .json({ message: "Update thành công", item, totalPrice });
  } catch (error) {
    console.log("Error updating cart:", error);
    res.status(500).json({ status: false, data: error.message });
  }
});

module.exports = router;
