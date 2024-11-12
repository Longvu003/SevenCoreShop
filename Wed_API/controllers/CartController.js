const mongoose = require("mongoose");
const CartModel = require("./CartModel");
const UserModel = require("./UserModel");
const ProductModel = require("./ProductModel");
const OrderModel = require("./OrderModel");
// const OrderModel = require("./OrderModel");

// Hàm thêm sản phẩm vào giỏ hàng
const add = async (userId, productId, nameProduct, quantity, price, images) => {
  try {
    const item = await CartModel.findOne({ userId, productId });
    if (item) {
      // Nếu sản phẩm đã tồn tại trong giỏ hàng, tăng số lượng
      await CartModel.updateOne(
        { userId, productId },
        { $inc: { quantity: quantity } } // Tăng số lượng
      );
    } else {
      // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
      const newItem = new CartModel({
        userId,
        productId,
        nameProduct,
        quantity,
        price,
        images,
      });
      await newItem.save();
    }
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error.stack);
  }
};

// Hàm xóa sản phẩm khỏi giỏ hàng
const deleteItemcart = async (userId, productId) => {
  try {
    const itemDeleted = await CartModel.findOneAndDelete({ userId, productId });
    if (itemDeleted) {
      return { success: true, message: "Đã xóa sản phẩm khỏi giỏ hàng" };
    } else {
      console.log("Sản phẩm không tồn tại trong giỏ hàng");
      return {
        success: false,
        message: "Sản phẩm không tồn tại trong giỏ hàng",
      };
    }
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
    return { success: false, message: "Đã xảy ra lỗi khi xóa sản phẩm" };
  }
};

// Hàm lấy sản phẩm trong giỏ hàng
const getItemCart = async (userId) => {
  try {
    const items = await CartModel.find({ userId });
    return items.length ? items : [];
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm trong giỏ hàng:", error);
  }
};

// Hàm cập nhật sản phẩm trong giỏ hàng
const updateItemCart = async (userId, productId, quantity) => {
  try {
    const item = await CartModel.findOne({ userId, productId }).exec();
    if (!item) {
      console.log("Sản phẩm không tồn tại trong giỏ hàng");
      return { success: false, message: "Sản phẩm không tồn tại" };
    }

    // Cập nhật số lượng sản phẩm
    item.quantity = quantity;
    await item.save();
    return { success: true, item };
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm trong giỏ hàng:", error);
    return { success: false, message: "Đã xảy ra lỗi khi cập nhật" };
  }
};

module.exports = { add, updateItemCart, deleteItemcart, getItemCart };
