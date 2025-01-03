const Notification = require('../model/NotificationModel');

// Lấy tất cả thông báo
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách thông báo', error });
  }
};

// Tạo mới thông báo
exports.createNotification = async (req, res) => {
  try {
    const { title, description, icon } = req.body;
    const notification = new Notification({ title, description, icon });
    await notification.save();
    res.status(201).json({ message: 'Thông báo được tạo thành công', notification });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo thông báo', error });
  }
};

// Xóa thông báo theo ID
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndDelete(id);
    res.status(200).json({ message: 'Thông báo đã được xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa thông báo', error });
  }
};
