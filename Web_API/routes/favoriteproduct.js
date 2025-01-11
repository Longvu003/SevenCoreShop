const express = require("express");
const router = express.Router();
const {
  addFavorite,
  getFavorites,
  removeFavorite,
  clearFavorites,
} = require("../controllers/FPController");

// Thêm sản phẩm vào danh sách yêu thích
router.post("/addFavorite", addFavorite);

// Lấy danh sách yêu thích của người dùng
router.get("/getFavorites", getFavorites);

// Xóa sản phẩm khỏi danh sách yêu thích
router.delete("/removeFavorite", removeFavorite);

// Làm sạch danh sách yêu thích
router.post("/clearFavorites", clearFavorites);

module.exports = router;
