var express = require("express");
var router = express.Router();

const CategoryController = require("../controllers/CategoryController");
// http://localhost:7777/categories

/**
 * lấy danh sách tất cả các danh mục
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
    const { name, description } = req.body;
    console.log(req.body);
    const category = await CategoryController.createCategory(name, description);
    return res.status(200).json({ status: true, data: category });
  } catch (error) {
    console.log("Create category error", error.message);
    res.status(500).json({ status: false, data: error.message });
  }
});

// Cập nhật danh mục
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const updatedCategory = await CategoryController.updateCategory(id, name, description);
    res.status(200).json({status: true, data: updatedCategory});
  } catch (error) {
    res.status(500).json({status: false, message: error.message });
  }
});

// Xóa danh mục
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCategory = await CategoryController.deleteCategory(id);
    res.status(200).json({status: true , message: "Category deleted successfully", deletedCategory });
  } catch (error) {
    res.status(500).json({status: false, message: error.message });
  }
});

// Lấy danh mục theo ID
router.get("/:id", async (req, res) => {
  const { id } = req.params; // Lấy ID từ URL params
  try {
    const category = await CategoryController.getCategoryById(id);
    res.status(200).json({ status: true, data: category });
  } catch (error) {
    res.status(404).json({ status: false, message: error.message }); // Trả về lỗi nếu không tìm thấy
  }
});


module.exports = router;
