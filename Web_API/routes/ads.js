const express = require('express');
const router = express.Router();
const adController = require('../controllers/AdController');

module.exports = (upload) => {

  
  // Tạo quảng cáo mới và upload ảnh
  router.post('/', upload.single('image'), adController.createAd);

  // Xóa quảng cáo theo ID
  router.delete('/:id', adController.deleteAd);

  // Lấy danh sách quảng cáo
  router.get('/', adController.getAd);

  // Cập nhật quảng cáo theo ID
  router.post('/:id', upload.single("image"), adController.updateAdById);

  return router; // Trả về router
};

