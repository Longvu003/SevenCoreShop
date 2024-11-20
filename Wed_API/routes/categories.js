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

/**
 * thêm mới danh mục
 * method: POST
 * url: http://localhost:7777/categories/add
 * body: {name, description}
 * response: trả về danh mục vừa tạo
 */
router.post("/add", async (req, res, next) => {
  try {
    const { name, description, images } = req.body;
    console.log(req.body);
    const category = await CategoryController.createCategory(
      name,
      description,
      images
    );
    return res.status(200).json({ status: true, data: category });
  } catch (error) {
    console.log("Create category error", error.message);
    res.status(500).json({ status: false, data: error.message });
  }
});

/**
 * xóa danh mục
 * method: DELETE
 * url: http://localhost:7777/categories/:id/delete
 * response: trả về danh mục vừa xóa
 */

router.post("/:id/delete", async (req, res, next) => {
  try {
    const id = req.params.id;
    const category = await CategoryController.deleteCategory(id);
    return res.status(200).json({ status: true, data: category });
  } catch (error) {
    console.log("Delete category error", error.message);
    res.status(500).json({ status: false, data: error.message });
  }
});

router.post("/:id/update", async (req, res, next) => {
  try {
    const id = req.params.id;
    const { name, description } = req.body;
    const category = await CategoryController.updateCategory(
      id,
      name,
      description
    );
    return res.status(200).json({ status: true, data: category });
  } catch (error) {
    console.log("Update category error", error.message);
    res.status(500).json({ status: false, data: error.message });
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const category = await CategoryController.getCategoryById(id);
    return res.status(200).json({ status: true, data: category });
  } catch (error) {
    console.log("Get category by id error", error.message);
    res.status(500).json({ status: false, data: error.message });
  }
});
router.get("/getAllCategory", async (req, res, next) => {
  try {
    const categories = await CategoryController.getCategoryList();
    return res.status(200).json({ data: categories });
  } catch (error) {
    console.log("Get category list error", error.message);
    res.status(500).json({ status: false, data: error.message });
  }
});

module.exports = router;
