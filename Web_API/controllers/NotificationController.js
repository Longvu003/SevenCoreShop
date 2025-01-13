const NotificationModel = require('../model/NotificationModel');
const mongoose = require('mongoose');

// lấy danh sách danh mục
const getAllNotifications = async () => {
   try {
       const notification = await NotificationModel.find()// lấy tất cả danh mục trong db
       return notification;//
   } catch (error) {
       console.log('Get notification list error', error.message)
       throw new Error('Get notification list error')
   }
}

const createNotification = async (title, description, icon) => {
   try {

       const notificationInfo = {
           title,
           description,
           icon
       }
       const notification = new NotificationModel(notificationInfo)
       await notification.save()
       return notification
   } catch (error) {
       console.log('Create notification error', error.message)
       throw new Error('Create notification error')
   }
} 

// Xóa thông báo theo ID
const deleteNotificationById = async (id) => {
   try {
       // Xóa danh mục nếu không có sản phẩm liên kết
       const notification = await NotificationModel.findByIdAndDelete(id);

       // Nếu không tìm thấy danh mục để xóa
       if (!notification) {
           throw new Error('Notification not found');
       }

       return notification; // Thông báo thành công
   } catch (error) {
       console.log('Delete notification error:', error.message);
       throw new Error(error.message); // Trả về lỗi chi tiết
   }
}

// get category by id
   const getNotificationById = async (id) => {
       try {
           const notification = await NotificationModel.findById(id)
           return notification
       } catch (error) {
           console.log('Get notification by id error', error.message)
           throw new Error('Get notification by id error')
       }
   }

const updateNotification = async (id, title, description, icon) => {
   try {
       // Kiểm tra ID hợp lệ
       if (!mongoose.Types.ObjectId.isValid(id)) {
           throw new Error('Invalid notification ID');
       }

       // Tìm danh mục theo ID
       const notification = await NotificationModel.findById(id);
       if (!notification) {
           throw new Error('Notification không tồn tại');
       }

       // Cập nhật từng trường nếu có giá trị mới
       notification.title = title || notification.title;
       notification.description = description || notification.description;
       notification.icon = icon || notification.icon;
       

       // Lưu cập nhật vào database
       console.log('Updated notification:', notification); // Log để kiểm tra
       await notification.save();
       return notification;
   } catch (error) {
       console.error('Update notification error:', error.message);
       throw new Error('Update notification failed');
   }
};

   
   module.exports = { getAllNotifications, createNotification, deleteNotificationById, updateNotification, getNotificationById };

