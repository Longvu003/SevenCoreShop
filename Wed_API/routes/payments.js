// const express = require('express');
// const router = express.Router();
// const PaymentController = require('../controllers/paymentController');

// /**
//  * API Tạo thanh toán mới
//  * method: POST
//  * url: http://localhost:7777/payments
//  * body: {userId, orderId, amount, status, createdAt, paymentMethod, orderInfo, paymentCode}
//  * response: trả về thông tin thanh toán vừa tạo
//  */
// router.post('/', async (req, res) => {
//     try {
//         const { userId, orderId, amount, orderInfo, paymentCode } = req.body;

//         if (!userId || !orderId || !amount || !orderInfo || !paymentCode) {
//             return res.status(400).json({ status: false, message: 'Thiếu thông tin yêu cầu.' });
//         }

//         const paymentResult = await PaymentController.createPaymentQR({ userId, orderId, amount, orderInfo, paymentCode });

//         if (paymentResult.error) {
//             return res.status(400).json({ status: false, message: paymentResult.message });
//         }

//         return res.status(200).json({ status: true, data: paymentResult });
//     } catch (error) {
//         return res.status(500).json({ status: false, message: 'Có lỗi xảy ra. Vui lòng thử lại.' });
//     }
// });


// module.exports = router;
