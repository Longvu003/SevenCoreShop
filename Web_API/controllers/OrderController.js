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
            order.statuspay = "Completed";
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
    console.log(address);
    // Kiểm tra dữ liệu đầu vào
    if (!userId || !items || !totalAmount || !address || !paymentMethod) {
      console.log("UserId:", userId);
      console.log("Items:", items);
      console.log("Total Amount:", totalAmount);
      console.log("Address:", address);
      console.log("Payment Method:", paymentMethod);

      return res.status(400).json({
        message: "Dữ liệu không hợp lệ hoặc thiếu",
        receivedData: req.body, // Trả về dữ liệu đã nhận
      });
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
    res.status(201).json({ message: "Đặt hàng thành công", code: orderCode });
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
    const order = await OrderModel.findOne({ orderCode });

    if (!order) {
      return res.status(400).json({ message: "Không tìm thấy đơn hàng" });
    }

    console.log(order.statuspay);
    if (order.statuspay === "Completed") {
      return res.status(200).json({ message: "Đã thanh toán" });
    } else {
      return res.status(200).json({ message: "Chưa thanh toán" });
    }
  } catch (error) {
    console.error("Lỗi khi kiểm tra trạng thái thanh toán:", error);
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

//danh sách bán chạy
// Lấy danh sách sản phẩm bán chạy nhất
const getBestSellingProducts = async (req, res) => {
  try {
    // Aggregation pipeline để tính tổng số lượng bán cho từng sản phẩm
    const topSellingProducts = await Order.aggregate([
      { $unwind: "$items" }, // Phân rã mảng `items`
      {
        $group: {
          _id: "$items.productId", // Nhóm theo `productId`
          name: { $first: "$items.name" }, // Lấy tên sản phẩm
          price: { $first: "$items.price" }, // Lấy giá sản phẩm
          image: { $first: "$items.image" }, // Lấy hình ảnh sản phẩm
          totalQuantity: { $sum: "$items.quantity" }, // Tính tổng số lượng bán
        },
      },
      { $sort: { totalQuantity: -1 } }, // Sắp xếp giảm dần theo số lượng bán
      { $limit: 5 }, // Giới hạn số lượng sản phẩm trả về
    ]);

    // Trả về dữ liệu thành công
    res.status(200).json({
      success: true,
      data: topSellingProducts,
    });
  } catch (error) {
    console.error("Error fetching top-selling products:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách sản phẩm bán chạy",
    });
  }
};

//Lấy danh sách phổ biến
const getPopularProducts = async (req, res) => {
  try {
    // Aggregation pipeline để tính tổng số lượng bán cho từng sản phẩm
    const popularProducts = await Order.aggregate([
      { $unwind: "$items" }, // Phân rã mảng `items`
      {
        $group: {
          _id: "$items.productId", // Nhóm theo `productId`
          name: { $first: "$items.name" }, // Lấy tên sản phẩm
          price: { $first: "$items.price" }, // Lấy giá sản phẩm
          image: { $first: "$items.image" }, // Lấy hình ảnh sản phẩm
          totalQuantity: { $sum: "$items.quantity" }, // Tính tổng số lượng bán
        },
      },
      { $sort: { totalQuantity: -1 } }, // Sắp xếp giảm dần theo số lượng bán
      { $limit: 10 }, // Giới hạn số lượng sản phẩm trả về là 10
    ]);

    // Trả về dữ liệu thành công
    res.status(200).json({
      success: true,
      data: popularProducts,
    });
  } catch (error) {
    console.error("Error fetching popular products:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách sản phẩm phổ biến",
    });
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
  getBestSellingProducts,
  getPopularProducts,
  checkstatuspay,
};
