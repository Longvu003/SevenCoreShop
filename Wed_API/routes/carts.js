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
    console.log("Dữ liệu nhận được từ client:", req.body);
    const { userId, productId, nameProduct, quantity, price, images } = req.body;
    const result = await cartController.add(userId, productId, nameProduct, quantity, price, images);
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
    const userId = req.query.id;
    const result = await cartController.getItemCart(userId);
    const totalPrice = result.reduce((total, item) => total + item.price * item.quantity, 0);
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
  try {
    const itemDelete = await cartController.deleteItemcart(userId, productId);
    if (!itemDelete) {
      res.status(404).json({ message: "Không tìm thấy người dùng" });
    } else {
      itemDelete.quantity -= quantity;
      if (itemDelete.quantity <= 0) {
        await itemDelete.deleteOne();
        res.status(200).json({ message: "Xóa thành công" });
      } else {
        await itemDelete.save();
        res.status(200).json({ itemDelete });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, data: error.message });
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
    const { success, item, message } = await cartController.updateItemCart(userId, productId, quantity);

    if (!success) {
      return res.status(404).json({ message });
    }

    // Nếu cập nhật thành công, tính lại tổng giá của giỏ hàng
    const cart = await cartController.getItemCart(userId);
    if (!cart || cart.length === 0) {
      return res.status(404).json({ message: "Giỏ hàng trống hoặc không tồn tại", totalPrice: 0 });
    }

    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    return res.status(200).json({ message: "Update thành công", item, totalPrice });
  } catch (error) {
    console.log("Error updating cart:", error);
    res.status(500).json({ status: false, data: error.message });
  }
});



router.post('/checkout', cartController.checkout);


module.exports = router;
