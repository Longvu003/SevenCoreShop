const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Định nghĩa Schema cho danh mục
const NotificationSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String, // Emoji hoặc ký hiệu đại diện cho icon
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Notification', NotificationSchema);
