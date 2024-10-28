var express = require("express");
var router = express.Router();

const CartController = require("../controllers/CartController");
const CategoryController = require("../controllers/CategoryController");

/**
 * thêm giỏ hàng mới
 * method: post
 * body: {user, product}
 * url: http://localhost:7777/carts
 * return: {_id,user,product,total,status,date}
 */
router.post("/addItemcart", async (req, res, next) => {
  try {
    const { userId, productId, nameProduct, quantity, price, images } =
      req.body;
    const result = await CartController.add(
      userId,
      productId,
      nameProduct,
      quantity,
      price,
      images
    );
    return res.status(200).json({ message: "Thêm thành công", result });
  } catch (error) {
    return res.status(500).json({ status: false, data: error.message });
  }
});

/**
 * lấy toàn bộ đơn hàng của hệ thống, có sắp xếp theop ngày giờ mua
 * method: get
 * url: http://localhost:7777/carts?status=1&user=1
 * return:[{}]
 */

router.get("/getItemCartById", async (req, res) => {
  try {
    const userId = req.query.id;
    const result = await CartController.getItemCart(userId);
    const totalPrice = result.reduce(
      (total, index) => total + index.price * index.quantity,
      0
    );
    return res.status(200).json({ status: true, data: totalPrice, result });
  } catch (error) {
    return res.status(500).json({ status: false, data: error.message });
  }
});

router.delete("/deleteItemCart", async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    const itemDelete = await CartController.deleteItemcart(userId, productId);
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
  }
});

router.put("/updateItemCart", async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    const item = await CartController.updateItemCart(userId, productId);
    if (!item) {
      res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }
    if (quantity <= 0) {
      await item.deleteOne();
      return res.status(200).json({ message: "Xóa thành công" });
    }

    if (item) {
      item.quantity = quantity;
      item.priceItem = item.quantity * item.price;
      await item.save();
      const cart = await CartController.getItemCart(userId);
      if (!Array.isArray(cart) || cart.length === 0) {
        return res.status(404).json({
          message: "Giỏ hàng trống hoặc không tồn tại",
          totalPrice: 0,
        });
      }
      const totalPrice = cart.reduce((total, index) => {
        return total + index.price * index.quantity;
      }, 0);
      return res.status(200).json({
        message: "update thành công",
        item: item,
        totalPrice,
      });
    } else {
      res.status(404).json({ message: "Sản PHẨM KHÔNG TỒN TẠI" });
    }

    item.quantity = item;
    // await item.save();
    return res.status(200).json({ message: "Update thành công" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
