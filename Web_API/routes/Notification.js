const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/NotificationController');

// Lấy danh sách thông báo
router.get('/', NotificationController.getAllNotifications);

// Tạo mới thông báo
router.post('/', NotificationController.createNotification);

// Xóa thông báo theo ID
router.delete('/:id', NotificationController.deleteNotification);

module.exports = router;
