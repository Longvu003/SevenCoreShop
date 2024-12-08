const mongoose = require("mongoose");
const CartModel = require("../model/CartModel");
const UserModel = require("../model/UserModel");
const ProductModel = require("../model/ProductModel");
const OrderModel = require("../model/OrderModel");

const updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;

  if (!mongoose.isValidObjectId(orderId)) {
    return res.status(400).json({ message: "Order ID không hợp lệ" });
  }

  try {
    const order = await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true } // Trả về giá trị đã được cập nhật
    );
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
    res.status(500).json({
      message: "Không thể cập nhật trạng thái đơn hàng",
      error: error.message,
    });
  }
};

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
      status: "Pending",
      date: new Date(),
    });
    console.log(newOrder);

    await newOrder.save();

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

// get all order try catch
const getOrder = async () => {
  try {
    const orders = await OrderModel.find({});
    return orders;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    throw new Error("Không thể lấy danh sách đơn hàng");
  }
};



module.exports = {getOrder, checkout, getOrderUser, getOrderUserById, updateOrderStatus };
