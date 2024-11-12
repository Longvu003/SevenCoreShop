const crypto = require('crypto');
const https = require('https');
const OrderModel = require("../model/OrderModel");

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
const createPaymentQR = ({ userId, orderId, amount, orderInfo, paymentCode }) => {
    return new Promise((resolve, reject) => {
        const requestId = partnerCode + new Date().getTime();
        const extraData = '';  
        const autoCapture = true;
        const lang = 'vi';

        // Đảm bảo amount là chuỗi số nguyên
        const amountStr = parseInt(amount).toString();

        // Tạo chữ ký (signature) theo định dạng yêu cầu
        const rawSignature = `accessKey=${accessKey}&amount=${amountStr}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
        const signature = crypto.createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');

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
            orderGroupId: '',
            signature
        });

        const options = {
            hostname: 'test-payment.momo.vn',
            port: 443,
            path: '/v2/gateway/api/create',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody)
            }
        };

        // Gửi yêu cầu đến MoMo
        const momoReq = https.request(options, momoRes => {
            let data = '';
            momoRes.on('data', (chunk) => {
                data += chunk;
            });
            momoRes.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    if (response.resultCode === 0) {
                        resolve({ payUrl: response.payUrl });
                    } else {
                        resolve({ error: true, message: response.message, resultCode: response.resultCode });
                    }
                } catch (err) {
                    reject(new Error('Lỗi phân tích phản hồi từ MoMo.'));
                }
            });
        });

        momoReq.on('error', (error) => {
            console.error(`Problem with request: ${error.message}`);
            reject(new Error('Error creating payment request.'));
        });

        momoReq.write(requestBody);
        momoReq.end();
    });
};

// Tạo đơn hàng mới
const createOrder = async (orderData) => {
    try {
        const newOrder = new OrderModel({
            id_user: orderData.id_user,
            amount: orderData.amount,
            products: orderData.products,
            statusDelivery: orderData.statusDelivery,
            statusPay: orderData.statusPay,
            paymentMethod: orderData.paymentMethod,
            paymentCode: orderData.paymentCode,
            orderInfo: orderData.orderInfo || '',  // Sử dụng orderInfo nếu có, nếu không để là chuỗi rỗng
        });

        // Lưu đơn hàng vào cơ sở dữ liệu
        const result = await newOrder.save();

        // Tạo dữ liệu thanh toán MoMo
        const paymentData = {
            userId: orderData.id_user,
            orderId: result._id.toString(), // Đảm bảo _id là chuỗi
            amount: orderData.amount,
            orderInfo: orderData.orderInfo,
            paymentCode: orderData.paymentCode || 'momo_wallet'  // Hoặc sử dụng mã thanh toán thực tế
        };

        // Gọi API MoMo để tạo QR thanh toán
        const paymentResult = await createPaymentQR(paymentData);

        if (paymentResult.error) {
            console.log('Error creating payment QR:', paymentResult.message);
            throw new Error('Lỗi tạo QR thanh toán MoMo.');
        }

        // Trả về kết quả với URL thanh toán MoMo
        return { order: result, payUrl: paymentResult.payUrl };
    } catch (error) {
        console.log('Add order error:', error.message);
        throw new Error('Không thể tạo đơn hàng, vui lòng thử lại sau.');
    }
};



// Lấy danh sách đơn hàng
const getOrders = async () => {
    try {
        const orders = await OrderModel.find();
        return orders;
    } catch (error) {
        console.log('Lỗi', error);
        throw new Error('Failed to get orders');
    }
};

// Lấy đơn hàng theo ID
const getOrderById = async (id) => {
    try {
        const order = await OrderModel.findById(id);
        if (!order) {
            throw new Error('Đơn hàng không tồn tại');
        }
        return order;
    } catch (error) {
        console.log('Get order by id error', error.message);
        throw new Error('Failed to get order by ID');
    }
};


// Cập nhật đơn hàng theo ID
const updateOrder = async (id, updatedFields) => {
    try {
        const orderInDb = await OrderModel.findById(id);
        if (!orderInDb) {
            throw new Error('Đơn hàng không tồn tại');
        }

        // Cập nhật các trường trong đơn hàng
        Object.assign(orderInDb, updatedFields);
        await orderInDb.save();
        return true;
    } catch (error) {
        console.log('Update order error', error.message);
        throw new Error('Failed to update order');
    }
};

// Xóa đơn hàng theo ID
const deleteOrder = async (id) => {
    try {
        const orderInDb = await OrderModel.findById(id);
        if (!orderInDb) {
            throw new Error('Đơn hàng không tồn tại');
        }

        await OrderModel.deleteOne({ _id: id });
        return true;
    } catch (error) {
        console.log('Delete order error', error.message);
        throw new Error('Failed to delete order');
    }
};

// Lấy đơn hàng theo trạng thái
const getOrdersByStatus = async (status) => {
    try {
        const orders = await OrderModel.find({ statusDelivery: status }); // Sửa key từ Status thành statusDelivery
        return orders;
    } catch (error) {
        console.log('Get orders by status error', error.message);
        throw new Error('Failed to get orders by status');
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
        console.log('Get order statistics error', error.message);
        throw new Error('Failed to get order statistics');
    }
};

// Cập nhật trạng thái thanh toán
const updatePaymentStatus = async (orderId, status) => {
    try {
        const orderInDb = await OrderModel.findById(orderId);
        if (!orderInDb) {
            throw new Error('Đơn hàng không tồn tại');
        }

        // Cập nhật trạng thái thanh toán
        orderInDb.statusPay = status;
        orderInDb.updatedAt = new Date();
        await orderInDb.save();
        return true;
    } catch (error) {
        console.log('Update payment status error', error.message);
        throw new Error('Failed to update payment status');
    }
};

// Cập nhật thông tin thanh toán (thêm paymentCode nếu cần thiết)
const updatePaymentInfo = async (orderId, paymentCode, paymentMethod) => {
    try {
        const orderInDb = await OrderModel.findById(orderId);
        if (!orderInDb) {
            throw new Error('Đơn hàng không tồn tại');
        }

        // Cập nhật paymentCode và paymentMethod
        orderInDb.paymentCode = paymentCode;
        orderInDb.paymentMethod = paymentMethod;
        orderInDb.updatedAt = new Date();
        await orderInDb.save();
        return true;
    } catch (error) {
        console.log('Update payment info error', error.message);
        throw new Error('Failed to update payment info');
    }
};

module.exports = {
    getOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    getOrdersByStatus,
    getOrderStatistics,
    updatePaymentStatus,
    updatePaymentInfo,
};
