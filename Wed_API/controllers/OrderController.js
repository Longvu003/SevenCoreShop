const crypto = require("crypto");
const https = require("https");
const OrderModel = require("../model/OrderModel");
const ProductModel = require("../model/ProductModel");

// Thông tin MoMo
const partnerCode = "MOMO";
const accessKey = "F8BBA842ECF85";
const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
const redirectUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
const ipnUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
const requestType = "payWithMethod";
const partnerName = "Test";
const storeId = "MomoTestStore";

// Tạo QR thanh toán MoMo
const createPaymentQR = ({
  userId,
  orderId,
  amount,
  orderInfo,
  paymentCode,
}) => {
  return new Promise((resolve, reject) => {
    const requestId = partnerCode + new Date().getTime();
    const extraData = "";
    const autoCapture = true;
    const lang = "vi";

    // Đảm bảo amount là chuỗi số nguyên
    const amountStr = parseInt(amount).toString();

    // Tạo chữ ký (signature) theo định dạng yêu cầu
    const rawSignature = `accessKey=${accessKey}&amount=${amountStr}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = JSON.stringify({
      partnerCode,
      partnerName,
      storeId,
      requestId,
      amount: amountStr,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      lang,
      requestType,
      autoCapture,
      extraData,
      paymentCode,
      orderGroupId: "",
      signature,
    });

    const options = {
      hostname: "test-payment.momo.vn",
      port: 443,
      path: "/v2/gateway/api/create",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
    };

    // Gửi yêu cầu đến MoMo
    const momoReq = https.request(options, (momoRes) => {
      let data = "";
      momoRes.on("data", (chunk) => {
        data += chunk;
      });
      momoRes.on("end", () => {
        try {
          const response = JSON.parse(data);
          if (response.resultCode === 0) {
            resolve({ payUrl: response.payUrl });
          } else {
            resolve({
              error: true,
              message: response.message,
              resultCode: response.resultCode,
            });
          }
        } catch (err) {
          reject(new Error("Lỗi phân tích phản hồi từ MoMo."));
        }
      });
    });

    momoReq.on("error", (error) => {
      console.error(`Problem with request: ${error.message}`);
      reject(new Error("Error creating payment request."));
    });

    momoReq.write(requestBody);
    momoReq.end();
  });
};

// Tạo đơn hàng mới
const createOrder = async (orderData) => {
  try {
    // Kiểm tra dữ liệu đầu vào
    if (!orderData.userId || !orderData.products || !orderData.paymentMethod) {
      throw new Error(
        "Thiếu thông tin cần thiết: userId, products, paymentMethod"
      );
    }

    // Tính toán tổng tiền cho từng sản phẩm và tổng đơn hàng
    let calculatedTotalAmount = 0;
    const updatedProducts = [];

    // Lặp qua tất cả sản phẩm trong đơn hàng để tính toán tổng tiền
    for (let product of orderData.products) {
      // Lấy thông tin giá sản phẩm từ cơ sở dữ liệu
      const productFromDb = await ProductModel.findById(product.productId);
      if (!productFromDb) {
        throw new Error(`Sản phẩm với ID ${product.productId} không tồn tại.`);
      }

      const totalProductPrice = product.quantity * productFromDb.price; // Tính tổng tiền cho sản phẩm
      calculatedTotalAmount += totalProductPrice; // Cộng vào tổng đơn hàng

      // Cập nhật lại thông tin của sản phẩm
      updatedProducts.push({
        productId: product.productId,
        quantity: product.quantity,
        total: totalProductPrice, // Cập nhật lại tổng tiền của sản phẩm
      });
    }

    // Tạo đơn hàng mới và lưu vào DB
    const newOrder = new OrderModel({
      userId: orderData.userId,
      products: updatedProducts,
      totalAmount: calculatedTotalAmount, // Tổng tiền đã tính toán
      status: "pending", // Mặc định là 'pending' khi tạo đơn hàng
      paymentMethod: orderData.paymentMethod,
      paymentStatus: "unpaid", // Mặc định là 'unpaid'
      deliveryStatus: "pending", // Mặc định là 'pending'
      orderDate: new Date(),
      updatedAt: new Date(),
      orderInfo: orderData.orderInfo || "", // Thông tin chi tiết đơn hàng nếu có
    });

    // Lưu đơn hàng vào cơ sở dữ liệu
    const savedOrder = await newOrder.save();

    // Tạo dữ liệu thanh toán MoMo
    const paymentData = {
      userId: orderData.userId,
      orderId: savedOrder._id.toString(), // Chuyển _id thành chuỗi
      amount: calculatedTotalAmount, // Dùng tổng tiền đã tính toán
      orderInfo: orderData.orderInfo || "", // Đảm bảo orderInfo không trống
      paymentCode: orderData.paymentCode || "momo_wallet", // Sử dụng mã thanh toán MoMo thực tế
    };

    // Gọi API MoMo để tạo QR thanh toán và nhận về `payUrl`
    const paymentResult = await createPaymentQR(paymentData);

    if (!paymentResult || paymentResult.error) {
      console.log(
        "Error creating payment QR:",
        paymentResult?.message || "Unknown error"
      );
      throw new Error("Lỗi tạo QR thanh toán MoMo.");
    }

    // Cập nhật `payUrl` vào đơn hàng đã lưu
    savedOrder.payUrl = paymentResult.payUrl;
    savedOrder.updatedAt = new Date(); // Cập nhật thời gian `updatedAt`
    await savedOrder.save(); // Cập nhật payUrl và updatedAt trong DB

    // Trả về đơn hàng cùng với `payUrl`
    return { order: savedOrder, payUrl: savedOrder.payUrl };
  } catch (error) {
    console.log("Add order error:", error.message);
    throw new Error("Không thể tạo đơn hàng, vui lòng thử lại sau.");
  }
};

// Lấy danh sách đơn hàng
const getOrders = async () => {
  try {
    const orders = await OrderModel.find()
      .populate("userId", "name email") // Hiển thị thông tin user (chỉ lấy name và email)
      .populate("products.productId", "name price") // Hiển thị thông tin sản phẩm (name và price)
      .lean(); // Convert kết quả sang dạng JS object thuần
    return orders;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    throw new Error("Failed to get orders");
  }
};

//

// Cập nhật đơn hàng theo ID
// OrderController.js
const updateOrder = async (id, updatedFields) => {
  try {
    const orderInDb = await OrderModel.findById(id);
    if (!orderInDb) {
      throw new Error("Đơn hàng không tồn tại");
    }

    // Cập nhật các trường trong đơn hàng
    Object.assign(orderInDb, updatedFields);
    await orderInDb.save();

    // Trả về đơn hàng đã cập nhật, bao gồm `payUrl`
    return orderInDb;
  } catch (error) {
    console.log("Update order error", error.message);
    throw new Error("Failed to update order");
  }
};

// Xóa đơn hàng theo ID
const deleteOrder = async (id) => {
  try {
    const orderInDb = await OrderModel.findById(id);
    if (!orderInDb) {
      throw new Error("Đơn hàng không tồn tại");
    }

    await OrderModel.deleteOne({ _id: id });
    return true;
  } catch (error) {
    console.log("Delete order error", error.message);
    throw new Error("Failed to delete order");
  }
};

// Lấy đơn hàng theo trạng thái
const getOrdersByStatus = async (status) => {
  try {
    const orders = await OrderModel.find({ statusDelivery: status }); // Sửa key từ Status thành statusDelivery
    return orders;
  } catch (error) {
    console.log("Get orders by status error", error.message);
    throw new Error("Failed to get orders by status");
  }
};

// Thống kê đơn hàng
const getOrderStatistics = async () => {
  try {
    const stats = await OrderModel.aggregate([
      { $group: { _id: "$statusPay", count: { $sum: 1 } } }, // Sử dụng statusPay thay cho Status
    ]);
    return stats;
  } catch (error) {
    console.log("Get order statistics error", error.message);
    throw new Error("Failed to get order statistics");
  }
};

// Cập nhật trạng thái thanh toán
const updatePaymentStatus = async (orderId, status) => {
  try {
    const orderInDb = await OrderModel.findById(orderId);
    if (!orderInDb) {
      throw new Error("Đơn hàng không tồn tại");
    }

    // Cập nhật trạng thái thanh toán
    orderInDb.statusPay = status;
    orderInDb.updatedAt = new Date();
    await orderInDb.save();
    return true;
  } catch (error) {
    console.log("Update payment status error", error.message);
    throw new Error("Failed to update payment status");
  }
};

// Cập nhật thông tin thanh toán (thêm paymentCode nếu cần thiết)
const updatePaymentInfo = async (orderId, paymentCode, paymentMethod) => {
  try {
    const orderInDb = await OrderModel.findById(orderId);
    if (!orderInDb) {
      throw new Error("Đơn hàng không tồn tại");
    }

    // Cập nhật paymentCode và paymentMethod
    orderInDb.paymentCode = paymentCode;
    orderInDb.paymentMethod = paymentMethod;
    orderInDb.updatedAt = new Date();
    await orderInDb.save();
    return true;
  } catch (error) {
    console.log("Update payment info error", error.message);
    throw new Error("Failed to update payment info");
  }
};

// Tính tổng số lượng đơn hàng đã thanh toán (Number of Orders - Paid)
const getTotalOrders = async () => {
  try {
    const result = await OrderModel.aggregate([
      {
        $match: { paymentStatus: "paid" },
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    // Trả về chỉ số totalOrders mà không cần bọc trong đối tượng
    return result[0]?.totalOrders || 0;
  } catch (error) {
    console.log("Error calculating total orders:", error.message);
    throw new Error("Failed to calculate total orders");
  }
};

const getTotalUnpaid = async () => {
  try {
    const result = await OrderModel.aggregate([
      {
        $match: { paymentStatus: "unpaid" },
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    // Trả về chỉ số totalOrders mà không cần bọc trong đối tượng
    return result[0]?.totalOrders || 0;
  } catch (error) {
    console.log("Error calculating total orders:", error.message);
    throw new Error("Failed to calculate total orders");
  }
};

// OrderController.js
// const getOrderById = async (id) => {
//     try {
//         const order = await OrderModel.findById(id);
//         return order ? { status: true, data: order } : { status: false, message: 'Order not found' };
//     } catch (error) {
//         console.error("Failed to fetch order:", error);
//         return { status: false, message: error.message };
//     }
// };

const getTopSellingProducts = async () => {
  try {
    console.log("Bắt đầu truy vấn sản phẩm bán chạy nhất...");

    const topSellingProducts = await OrderModel.aggregate([
      // Bước 1: Lọc chỉ các đơn hàng có paymentStatus là "paid"
      {
        $match: {
          paymentStatus: "paid", // Chỉ lấy các đơn hàng đã thanh toán
        },
      },
      // Bước 2: Tách mảng products thành từng phần tử
      {
        $unwind: "$products",
      },
      // Bước 3: Chuẩn bị dữ liệu cần dùng
      {
        $project: {
          productId: "$products.productId", // Lấy ID sản phẩm
          quantity: "$products.quantity", // Lấy số lượng
          price: "$products.total", // Tổng tiền đã tính sẵn
        },
      },
      // Bước 4: Nhóm theo sản phẩm và tính tổng số lượng và doanh thu
      {
        $group: {
          _id: "$productId", // Nhóm theo ID sản phẩm
          totalSold: { $sum: "$quantity" }, // Tổng số lượng đã bán
          totalRevenue: { $sum: "$price" }, // Tổng doanh thu
        },
      },
      // Bước 5: Sắp xếp theo tổng số lượng bán giảm dần
      {
        $sort: { totalSold: -1 },
      },
      // Bước 6: Kết hợp thông tin sản phẩm từ bảng products
      {
        $lookup: {
          from: "products", // Bảng products
          localField: "_id", // Trường tham chiếu trong OrderModel
          foreignField: "_id", // Trường tham chiếu trong bảng products
          as: "productInfo",
        },
      },
      // Bước 7: Lấy phần tử đầu tiên của productInfo (thông tin sản phẩm)
      {
        $addFields: {
          productInfo: { $arrayElemAt: ["$productInfo", 0] }, // Lấy thông tin sản phẩm đầu tiên
        },
      },
      // Bước 8: Giới hạn số lượng sản phẩm trả về
      {
        $limit: 5, // Lấy 5 sản phẩm bán chạy nhất
      },
    ]);

    console.log("Kết quả truy vấn sản phẩm bán chạy nhất:", topSellingProducts);

    if (topSellingProducts.length === 0) {
      console.log("Không có sản phẩm bán chạy nào.");
    } else {
      console.log("Đã tìm thấy các sản phẩm bán chạy.");
    }

    return topSellingProducts;
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm bán chạy nhất:", error);
    throw new Error("Lỗi khi lấy sản phẩm bán chạy nhất: " + error.message);
  }
};

const getTotalRevenue = async () => {
  try {
    console.log("Bắt đầu tính tổng doanh thu...");

    const totalRevenue = await OrderModel.aggregate([
      // Bước 1: Lọc các đơn hàng có paymentStatus là "paid"
      {
        $match: {
          paymentStatus: "paid", // Chỉ tính các đơn hàng đã thanh toán
        },
      },
      // Bước 2: Tính tổng doanh thu từ totalAmount
      {
        $group: {
          _id: null, // Không nhóm theo trường nào
          totalRevenue: { $sum: "$totalAmount" }, // Tính tổng totalAmount
        },
      },
    ]);

    // Nếu không có dữ liệu, trả về 0
    if (totalRevenue.length === 0) {
      console.log("Không có doanh thu nào.");
      return 0;
    }

    console.log(
      "Tổng doanh thu từ các đơn hàng đã thanh toán:",
      totalRevenue[0].totalRevenue
    );
    return totalRevenue[0].totalRevenue;
  } catch (error) {
    console.error("Lỗi khi tính tổng doanh thu:", error);
    throw new Error("Lỗi khi tính tổng doanh thu: " + error.message);
  }
};

const getRevenueByDays = async (req) => {
    try {
      // Lấy tham số `days` từ query
      const days = parseInt(req.query.days);
      if (!days || days <= 0) {
        throw new Error("Số ngày không hợp lệ");
      }
  
      // Tính ngày bắt đầu và hiện tại
      const now = new Date();
      const startDate = new Date(now);
      startDate.setDate(now.getDate() - days);
  
      // Query MongoDB
      const totalRevenue = await OrderModel.aggregate([
        {
          $match: {
            paymentStatus: "paid",
            createdAt: { $gte: startDate, $lte: now },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
          },
        },
      ]);
  
      // Xử lý kết quả
      return totalRevenue.length > 0 ? totalRevenue[0].totalRevenue : 0;
    } catch (error) {
      console.error("Lỗi khi tính tổng doanh thu:", error);
      throw error;
    }
  };
  
  module.exports = { getRevenueByDays };
  

// Xuất các hàm để sử dụng
module.exports = {
  getRevenueByDays,
  getTopSellingProducts,
  getTotalRevenue,
  getTotalOrders,
  getTotalUnpaid,
  getOrders,
  // getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrdersByStatus,
  getOrderStatistics,
  updatePaymentStatus,
  updatePaymentInfo,
};
