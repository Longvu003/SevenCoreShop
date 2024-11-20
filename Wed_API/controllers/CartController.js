const mongoose = require("mongoose");
const CartModel = require("../model/CartModel");
const UserModel = require("../model/UserModel");
const ProductModel = require("../model/ProductModel");
const OrderModel = require("../model/OrderModel");

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

const checkout = async (req, res) => {
  const { userId, items, paymentMethod } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!userId || userId.length !== 24) {
    return res.status(400).json({ message: "User ID không hợp lệ" });
    console.log("User ID:", userId);
  }

  // Tìm người dùng trong cơ sở dữ liệu
  const user = await UserModel.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "Người dùng không tồn tại" });
  }

  if (paymentMethod !== "COD") {
    return res
      .status(400)
      .json({ message: "Phương thức thanh toán không hợp lệ" });
  }

  try {
    // Kiểm tra xem userId có hợp lệ không
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "User ID không hợp lệ" });
    }

    let totalAmount = 0;
    for (const item of items) {
      // Kiểm tra sản phẩm
      if (!item.productId || !item.quantity) {
        return res
          .status(400)
          .json({ message: "Sản phẩm không hợp lệ trong giỏ hàng." });
      }

      const product = await ProductModel.findById(item.productId);
      if (!product) {
        return res
          .status(404)
          .json({ message: "Sản phẩm không tồn tại: " + item.productId });
      }
      totalAmount += product.price * item.quantity;
    }

    // Tạo đơn hàng mới
    const order = new OrderModel({
      userId,
      items,
      totalAmount,
      paymentMethod,
      status: "Pending",
    });
    await order.save();

    console.log(order);
    // Lưu lịch sử đơn hàng vào tài khoản người dùng
    await UserModel.findByIdAndUpdate(userId, {
      $push: { orderHistory: order._id },
    });

    // Xóa giỏ hàng sau khi thanh toán
    await CartModel.findOneAndUpdate({ userId }, { $set: { items: [] } });

    res.status(200).json({
      message: "Thanh toán thành công! Đơn hàng của bạn đã được tạo.",
      order: order, // Trả về toàn bộ dữ liệu đơn hàng
    });
  } catch (error) {
    console.error("Lỗi khi xử lý thanh toán:", error);
    res
      .status(500)
      .json({ message: "Lỗi khi xử lý thanh toán", error: error.message });
  }
};

module.exports = { add, updateItemCart, deleteItemcart, getItemCart, checkout };
