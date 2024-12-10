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
        const orderData = req.body; // Nhận dữ liệu đơn hàng từ request body
        
        // Gọi hàm tạo đơn hàng từ controller
        const result = await OrderController.createOrder(orderData);

        // Trả về kết quả nếu thành công
        return res.status(200).json({
            status: true,
            data: result.order, // Đơn hàng vừa tạo
            payUrl: result.payUrl  // URL thanh toán MoMo
        });
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error('Create order error:', error.message);
        return res.status(500).json({
            status: false,
            message: error.message || 'Lỗi khi tạo đơn hàng. Vui lòng thử lại sau.'
        });
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
// routes/orders.js
router.put('/:id/update', async (req, res) => {
    try {
        const { id } = req.params;
        const { statusDelivery, statusPay, payUrl } = req.body;  // Nhận `payUrl` từ body

        const updatedOrder = await OrderController.updateOrder(id, { statusDelivery, statusPay, payUrl });
        
        // Trả về thông tin đơn hàng đã cập nhật, bao gồm `payUrl` nếu có
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
router.delete('/:id/delete', async (req, res) => {
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
// router.get('/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const order = await OrderController.getOrderById(id);
//         return res.status(200).json({ status: true, data: order });
//     } catch (error) {
//         return res.status(500).json({ status: false, message: error.message });
//     }
// });

router.get('/topSelling', async (req, res) => {
    try {
        const topSellingProducts = await OrderController.getTopSellingProducts();
        return res.status(200).json({
            status: true,
            data: topSellingProducts,
        });
    } catch (error) {
        console.error("Error in route handler:", error);
        return res.status(500).json({ status: false, message: error.message });
    }
});


router.get('/totalRevenue', async (req, res) => {
    try {
      // Gọi hàm tính tổng doanh thu
      const totalRevenue = await OrderController.getTotalRevenue();
  
      // Trả về kết quả cho client
      res.status(200).json({
        status: true,
        message: 'Tổng doanh thu từ các đơn hàng đã thanh toán',
        data: totalRevenue
      });
    } catch (error) {
      // Xử lý lỗi
      res.status(500).json({
        status: false,
        message: 'Lỗi khi tính tổng doanh thu',
        error: error.message
      });
    }
  });

  router.get('/getRevenueByDays', async (req, res) => {
    try {
      // Truyền `req` cho hàm controller
      const totalRevenue = await OrderController.getRevenueByDays(req);
  
      // Trả về kết quả cho client
      res.status(200).json({
        status: true,
        message: 'Tổng doanh thu từ các đơn hàng đã thanh toán theo ngày',
        data: totalRevenue,
      });
    } catch (error) {
      // Xử lý lỗi
      res.status(500).json({
        status: false,
        message: 'Lỗi khi tính tổng doanh thu theo ngày',
        error: error.message,
      });
    }
  });
  
  router.get('/total', async (req, res) => {
    try {
        const totalOrders = await OrderController.getTotalOrders(); // Gọi phương thức getTotalOrders
        return res.status(200).json({ status: true, data:totalOrders }); // Trả về kết quả
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message }); // Xử lý lỗi nếu có
    }
});

router.get('/total_unpaid', async (req, res) => {
    try {
        const totalUnpaid = await OrderController.getTotalUnpaid(); // Gọi phương thức getTotalOrders
        return res.status(200).json({ status: true, data:totalUnpaid }); // Trả về kết quả
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message }); // Xử lý lỗi nếu có
    }
});

module.exports = router;
