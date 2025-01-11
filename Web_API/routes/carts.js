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
    const { userId, productId, nameProduct, quantity, price, images } =
      req.body;

    // Kiểm tra xem có đủ thông tin trong body không
    if (
      !userId ||
      !productId ||
      !nameProduct ||
      !quantity ||
      !price ||
      !images
    ) {
      // return res.status(400).json({
      //   status: false,
      //   message: "Thiếu thông tin cần thiết. Vui lòng cung cấp đầy đủ thông tin.",
      // });
      console.log("Thiếu thông tin user !");
    }

    // Gọi controller add để thêm sản phẩm vào giỏ hàng
    const result = await cartController.add(
      userId,
      productId,
      nameProduct,
      quantity,
      price,
      images
    );

    // Kiểm tra kết quả trả về từ controller
    if (result.status) {
      return res.status(200).json({
        status: true,
        message: "Thêm thành công vào giỏ hàng",
        result: result,
      });
    } else {
      return res.status(400).json({
        status: false,
        message:
          result.message || "Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng.",
      });
    }
  } catch (error) {
    console.error("Lỗi trong route /addItemcart:", error.stack);
    return res.status(500).json({
      status: false,
      message: "Đã xảy ra lỗi khi thực hiện yêu cầu.",
      error: error.message,
    });
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
    // if (!result || result.length === 0) {
    //   return res
    //     .status(404)
    //     .json({ status: false, message: "Có lỗi khi lấy result" });
    // }
    const newResult = result[0].cartItems;

    const totalPrice = newResult.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    return res.status(200).json({ status: true, data: totalPrice, result });
  } catch (error) {
    console.log(error.message);
    // return res.status(500).json({ status: false });
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
  const { userId, productId } = req.body;

  try {
    const itemDelete = await cartController.deleteItemcart(userId, productId);
    if (!itemDelete) {
      console.log("Lỗi khi xóa sản phẩm:");
      return res.status(404).json({ message: "có lỗi khi xóa" }); // Nếu không thành công, trả về 404
    }

    return res.status(200).json({ message: "Sản phẩm đã được xóa thành công" });
  } catch (error) {
    console.log("Lỗi xử lý yêu cầu:", error);
    return res.status(500).json({ data: error.message });
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
    const itemInCart = await cartController.getItemCart(userId);

    if (!itemInCart || !itemInCart[0]) {
      return res
        .status(404)
        .json({ success: false, message: "Giỏ hàng không tồn tại" });
    }

    const dataProduct = itemInCart[0].cartItems;
    const productIndex = dataProduct.findIndex(
      (item) => String(item.productId) === String(productId)
    );

    if (productIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Sản phẩm không tồn tại" });
    }

    if (quantity <= 0) {
      // Xóa sản phẩm nếu số lượng <= 0
      dataProduct.splice(productIndex, 1);
    } else {
      // Cập nhật số lượng sản phẩm
      dataProduct[productIndex].quantity = quantity;
    }

    // Lưu lại giỏ hàng sau khi cập nhật

    await itemInCart[0].save();

    return res.json({ success: true, cart: itemInCart[0] });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/deleteItemPayment", async (req, res) => {
  try {
    const userId = req.body;
    const item = await cartController.deleteCartPayment(userId);

    if (item) {
      await item.deleteOne(userId);
      return res.status(200).json({ message: "Xóa thành công giỏ hàng" });
    }
    return res.status(400).json({ message: "Xóa thất bại" });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/resetCart", cartController.resetCart);
module.exports = router;
