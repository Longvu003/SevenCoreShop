const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/NotificationController');

// Lấy danh sách thông báo
router.get('/', async (req, res, next) => {
    try {
        const notification = await NotificationController.getAllNotifications();
        return res.status(200).json({status: true, data: notification});
    } catch (error) {
        console.log('Get notification list error', error.message);
        res.status(500).json({status: false, data: error.message});
    }
});

// Tạo mới thông báo
router.post('/', async (req, res, next) => {
    try {
        const { title, description,icon } = req.body;
        const notification = await NotificationController.createNotification(title, description,icon);
        return res.status(200).json({status: true, data: notification});
    } catch (error) {
        console.log('Get notification list error', error.message);
        res.status(500).json({status: false, data: error.message});
    }
});

// Xóa thông báo theo ID
// router.delete('/:id', NotificationController.deleteNotification);

router.delete('/:id/', async (req, res, next) => {
    try {
        const id = req.params.id;
        const notification = await NotificationController.deleteNotificationById(id);
        return res.status(200).json({ status: true, data: notification });
    } catch (error) {
        console.log('Delete notification error', error.message);
        res.status(500).json({ status: false, data: error.message });
    }
});

router.put('/:id/update', async (req, res, next) => {
    try {
        const id = req.params.id;
        const { title, description, icon } = req.body;
        const notification = await NotificationController.updateNotification(id, title, description, icon);
        return res.status(200).json({ status: true, data: notification });
    } catch (error) {
        console.log('Update notification error', error.message);
        res.status(500).json({ status: false, data: error.message });
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const notification = await NotificationController.getNotificationById(id);
        return res.status(200).json({ status: true, data: notification });
    } catch (error) {
        console.log('Get notification by id error', error.message);
        res.status(500).json({ status: false, data: error.message });
    }
});

module.exports = router;