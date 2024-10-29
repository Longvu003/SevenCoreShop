var express = require("express");
var router = express.Router();

const CategoryController = require("../controllers/CategoryController");
// http://localhost:7777/categories

/**
 * lấy danh sách tất cả các danh mục 
>>>>>>> 8b8f49455d06ec1c65fa3ae68001c06749ed3d32
 * method: GET
 * url: http://localhost:7777/categories
 * response: trả về danh sách các danh mục
 */

router.get("/", async (req, res, next) => {
  try {
    const categories = await CategoryController.getCategoryList();
    return res.status(200).json({ status: true, data: categories });
  } catch (error) {
    console.log("Get category list error", error.message);
    res.status(500).json({ status: false, data: error.message });
  }
});
router.post("/add", async (req, res, next) => {
  try {
    const { name, description, images } = req.body; // thêm images
    const category = await CategoryController.createCategory(name, description, images);
    return res.status(200).json({ status: true, data: category });
  } catch (error) {
    console.log("Create category error", error.message);
    res.status(500).json({ status: false, data: error.message });
  }
});

module.exports = router;
