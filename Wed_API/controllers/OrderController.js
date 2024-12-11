const mongoose = require("mongoose");
const CartModel = require("../model/CartModel");
const UserModel = require("../model/UserModel");
const ProductModel = require("../model/ProductModel");
const OrderModel = require("../model/OrderModel");

const checkout = async (req, res) => {
  try {
    const { userId, items, totalAmount, address, paymentMethod } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!userId || !items || !totalAmount || !address || !paymentMethod) {
      return res.status(400).json({ message: "Thiếu dữ liệu" });
    }

    // Kiểm tra và thêm ảnh cho từng sản phẩm
    const populatedItems = await Promise.all(
      items.map(async (item) => {
        const product = await ProductModel.findById(item.productId);
        if (!product) {
          throw new Error(`Không tìm thấy sản phẩm với ID: ${item.productId}`);
        }
        return {
          ...item,
        };
      })
    );

    // Tạo đơn hàng mới
    const newOrder = new OrderModel({
      userId,
      items: populatedItems, // Gán danh sách sản phẩm đã thêm trường ảnh
      totalAmount,
      address,
      paymentMethod,
      status: "Đang xác nhận",
      date: new Date(),
    });

    await newOrder.save();
    const cart = await CartModel.findOne({ userId });
    // if (cart) {
    //   await CartModel.deleteOne({ userId });
    // }
    res.status(201).json({ message: "Đặt hàng thành công", order: newOrder });
  } catch (error) {
    console.error("Lỗi khi thanh toán:", error);
    res
      .status(500)
      .json({ message: "Lỗi khi xử lý thanh toán", error: error.message });
  }
};

// Lấy danh sách tất cả đơn hàng
// const getOrderUser = async (req, res) => {
//   try {
//     const orders = await OrderModel.find({});
//     res.status(200).json(orders);
//   } catch (error) {
//     console.error("Lỗi khi lấy danh sách đơn hàng:", error);
//     res.status(500).json({ message: "Không thể lấy danh sách đơn hàng", error: error.message });
//   }
// };

// Lấy đơn hàng theo ID người dùng
// const getOrderUserById = async (req, res) => {
//   const { userId } = req.query;

//   if (!mongoose.isValidObjectId(userId)) {
//     return res.status(400).json({ message: "User ID không hợp lệ" });
//   }

//   try {
//     const orders = await OrderModel.find({ userId: mongoose.Types.ObjectId(userId) });
//     if (orders.length > 0) {
//       res.status(200).json(orders);
//     } else {
//       res.status(404).json({ message: "Không tìm thấy đơn hàng cho người dùng này." });
//     }
//   } catch (error) {
//     console.error("Lỗi khi lấy đơn hàng theo user ID:", error);
//     res.status(500).json({ message: "Không thể lấy đơn hàng", error: error.message });
//   }
// };

const getOrderUser = async () => {
  const itemOrder = await OrderModel.find({});
  return itemOrder;
};
const getOrderUserById = async (userId) => {
  const itemOrder = await OrderModel.find({ userId });

  return itemOrder;
};

const searchOrder = async (req, res) => {
  const { query } = req.body;
  try {
    const searchRegex = new RegExp(query, "i");
    const conditions = {
      $or: [{ "items.name": searchRegex }, { status: searchRegex }],
    };
    const results = await OrderModel.find(conditions);
    res.json(results);
  } catch (error) {
    console.log("Lỗi tìm đơn hàng:", error);
    res.status(500).send("Lỗi trong lúc tìm  đơn hàng");
  }
};

module.exports = { checkout, getOrderUser, getOrderUserById, searchOrder };
