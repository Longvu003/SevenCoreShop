var express = require('express');
var router = express.Router();
const OrderController = require('../controllers/OrderController');

/**
 * API Tạo đơn hàng mới
 * method: POST
 * url: http://localhost:7777/orders
 * body: {userId, amount, products, statusDelivery, statusPay, paymentMethod, paymentCode}
 * response: trả về đơn hàng vừa tạo
 */
router.post('/', async (req, res) => {
    try {
        const orderData = req.body;  // Dữ liệu đơn hàng từ request body
        const result = await OrderController.createOrder(orderData);
        
        // Trả về kết quả nếu thành công
        return res.status(200).json({
            status: true,
            data: result.order,
            payUrl: result.payUrl  // Chuyển link thanh toán MoMo cho người dùng
        });
    } catch (error) {
        // Xử lý lỗi nếu có
        return res.status(500).json({ status: false, message: error.message });
    }
});

/**
 * API Lấy danh sách tất cả các đơn hàng
 * method: GET
 * url: http://localhost:7777/orders
 * response: trả về danh sách tất cả các đơn hàng
 */
router.get('/', async (req, res) => {
    try {
        const orders = await OrderController.getOrders();
        return res.status(200).json({ status: true, data: orders });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
});

/**
 * API Lấy đơn hàng theo ID người dùng
 * method: GET
 * url: http://localhost:7777/orders/user/:userId
 * response: trả về danh sách đơn hàng theo ID người dùng
 */
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await OrderController.getOrdersByUserId(userId);
        return res.status(200).json({ status: true, data: orders });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
});

/**
 * API Cập nhật đơn hàng
 * method: PUT
 * url: http://localhost:7777/orders/:id/update
 * body: {statusDelivery, statusPay}
 * response: trả về đơn hàng sau khi cập nhật
 */
router.put('/:id/update', async (req, res) => {
    try {
        const { id } = req.params;
        const { statusDelivery, statusPay } = req.body;
        const updatedOrder = await OrderController.updateOrder(id, { statusDelivery, statusPay });
        return res.status(200).json({ status: true, data: updatedOrder });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
});

/**
 * API Xóa đơn hàng
 * method: POST
 * url: http://localhost:7777/orders/:id/delete
 * response: trả về đơn hàng đã xóa
 */
router.post('/:id/delete', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedOrder = await OrderController.deleteOrder(id);
        return res.status(200).json({ status: true, data: deletedOrder });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
});

/**
 * API Lấy danh sách đơn hàng theo trạng thái
 * method: GET
 * url: http://localhost:7777/orders/status?status=pending
 * response: trả về danh sách đơn hàng theo trạng thái
 */
router.get('/status', async (req, res) => {
    try {
        const { status } = req.query;
        const orders = await OrderController.getOrdersByStatus(status);
        return res.status(200).json({ status: true, data: orders });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
});

/**
 * API Lấy đơn hàng theo ID
 * method: GET
 * url: http://localhost:7777/orders/:id
 * response: trả về thông tin chi tiết của đơn hàng
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const order = await OrderController.getOrderById(id);
        return res.status(200).json({ status: true, data: order });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
});

module.exports = router;
