const OrderModel = require("../model/OrderModel");
const mongoose = require("mongoose");
const CartModel = require("../model/CartModel");
const UserModel = require("../model/UserModel");
const ProductModel = require("../model/ProductModel");
const moment = require("moment-timezone");
const Transaction = require("../model/TransactionModel");
const Order = require("../model/OrderModel");

//update statuspay
const updateStatusPay = async (req, res) => {
  const { orderId, statuspay } = req.body;

  if (!mongoose.isValidObjectId(orderId)) {
    return res.status(400).json({ message: "Order ID không hợp lệ" });
  }

  try {
    const order = await OrderModel.findByIdAndUpdate(
      orderId,
      { statuspay },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái thanh toán:", error);
    res.status(500).json({
      message: "Không thể cập nhật trạng thái thanh toán",
      error: error.message,
    });
  }
};

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
    // console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
    res.status(500).json({
      message: "Không thể cập nhật trạng thái đơn hàng",
      error: error.message,
    });
  }
};
const checkAndUpdateAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find();

    if (orders.length === 0) {
      return res.status(400).json({ message: "Không tìm thấy đơn hàng" });
    }
    const orderCodes = orders.map((order) => order.orderCode);

    const transactions = await Transaction.find();
    if (transactions.length === 0) {
      return res.status(400).json({ message: "Không tìm thấy giao dịch" });
    }

    for (let transaction of transactions) {
      for (let orderCode of orderCodes) {
        if (
          transaction.description.includes(orderCode) &&
          transaction.creditAmount ===
            orders.find((order) => order.orderCode === orderCode)?.totalAmount
        ) {
          const order = await OrderModel.findOne({ orderCode: orderCode });
          if (order) {
            order.statuspay = "Đã thanh toán";
            await order.save();
          }
        }
      }
    }
    return res
      .status(200)
      .json({ message: "Kiểm tra và cập nhật đơn hàng thành công" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const generateorderCode = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let orderCode = "";
  for (let i = 0; i < 10; i++) {
    orderCode += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return orderCode;
};

const isorderCodeUnique = async (orderCode) => {
  const existingOrder = await OrderModel.findOne({ orderCode });
  return !existingOrder;
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

    let orderCode;
    do {
      orderCode = generateorderCode();
    } while (!(await isorderCodeUnique(orderCode)));

    // Tạo đơn hàng mới
    const newOrder = new OrderModel({
      userId,
      items: populatedItems,
      totalAmount,
      address,
      paymentMethod,
      status: "Đang xử lý",
      date: moment().tz("Asia/Ho_Chi_Minh").toDate(),
      orderCode,
    });

    await newOrder.save();
    res.status(201).json({ message: "Đặt hàng thành công", code:orderCode });
  } catch (error) {
    console.error("Lỗi khi thanh toán:", error);
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
  const itemOrder = await OrderModel.find({ userId });
  return itemOrder;
};

const searchOrder = async (req, res) => {
  const { query, userId } = req.body;
  try {
    const searchRegex = new RegExp(query, "i");
    const conditions = {
      userId,
      $or: [{ "items.name": searchRegex }, { status: searchRegex }],
    };
    const results = await Order.find(conditions);

    res.json(results);
  } catch (error) {
    console.log("Lỗi tìm đơn hàng:", error);
    res.status(500).send("Lỗi trong lúc tìm đơn hàng");
  }
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
//check statuspay
const checkstatuspay = async (req, res) => {
  try {
    const { orderCode } = req.body;
    console.log(orderCode);
    const order = await OrderModel.findOne({ orderCode });

    if (!order) {
      return res.status(400).json({ message: "Không tìm thấy đơn hàng" });
    }

  
    console.log(order.statuspay);
    if (order.statuspay==="Đã thanh toán") {
      return res.status(200).json({ message: "Đã thanh toán" });
    } else {
      return res.status(200).json({ message: "Chưa thanh toán" });
    }
  } catch (error) {
    console.error("Lỗi khi kiểm tra trạng thái thanh toán:", error);
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Xuất các hàm để sử dụng
module.exports = {
  updateStatusPay,
  getOrder,
  checkout,
  getOrderUser,
  getOrderUserById,
  updateOrderStatus,
  checkAndUpdateAllOrders,
  searchOrder,
  checkstatuspay,
};
