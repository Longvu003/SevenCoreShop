const mongoose = require("mongoose");
const CartModel = require("../model/CartModel");
const UserModel = require("../model/UserModel");
const ProductModel = require("../model/ProductModel");
const OrderModel = require("../model/OrderModel");

const checkout = async (req, res) => {
  const { userId, items, paymentMethod } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!userId || userId.length !== 24) {
    return res.status(400).json({ message: "User ID không hợp lệ" });
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
    console.log(order.items);
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

const getOrderUser = async () => {
  const itemOrder = await OrderModel.find({});
  return itemOrder;
};
const getOrderUserById = async (userId) => {
  const itemOrder = await OrderModel.find({
    userId: mongoose.Types.ObjectId(userId),
  });
  return itemOrder;
};

module.exports = { checkout, getOrderUser, getOrderUserById };
