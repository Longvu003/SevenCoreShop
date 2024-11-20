var express = require("express");
var router = express.Router();
// http://localhost:7777/products

// const CategoryController = require("../controllers/CategoryController");
const ProductController = require("../controllers/ProductController");

/**
 * method: GET
 * url: http://localhost:7777/products?limit=10&page=1
 * response: trả về danh sách tất cả sản phẩm
 */

// router.get('/', async (req, res) => {
//     try {
//         const { limit, page } = req.query;
//         const products = await ProductController.getProducts(limit, page);
//         return res.status(200).json({ status: true, data: products })
//     } catch (error) {
//         return res.status(500).json({ status: false, data: error.message })
//     }
// });

router.get("/", async (req, res, next) => {
  const { category_id } = req.query;
  console.log(category_id);
  try {
    const checkListProducts = await ProductController.getProducts(category_id);
    return res.status(200).json({ status: true, checkListProducts });
  } catch (error) {
    return res.status(500).json({ status: false, data: error.message });
  }
});

router.get("/all", async (req, res, next) => {
  try {
    const products = await ProductController.getAllProducts();
    return res.status(200).json({ status: true, data: products });
  } catch (error) {
    return res.status(500).json({ status: false, data: error.message });
  }
});

/**
 * method: post
 * url: http://localhost:7777/products
 * body: {name, price, quantity, images, decription, category}
 * response: trả về sản phẩm vừa tạo
 */
router.post("/", async (req, res, next) => {
  try {
    const { name, price, quantity, images, description, category } = req.body;
    const product = await ProductController.addProduct(
      name,
      price,
      quantity,
      images,
      description,
      category
    );
    return res.status(200).json({ status: true, data: product });
  } catch (error) {
    return res.status(500).json({ status: false, data: error.message });
  }
});

/**
 * API cập nhật sản phẩn
 * method: post
 * url: http://localhost:7777/products/:id/update
 * body: name, price, quantity, images, description, category
 * response: trå về sån phåm vừa cập nhật
 */
router.post("/:id/update", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price, quantity, images, description, category } = req.body;
    console.log(req.body);
    const product = await ProductController.updateProduct(
      id,
      name,
      price,
      quantity,
      images,
      description,
      category
    );
    return res.status(200).json({ status: true, data: product });
  } catch (error) {
    return res.status(500).json({ status: false, data: error.message });
  }
});

//API tìm kiếm sản phẩm theo từ khóa
// method: get
// url: http://localhost:7777/products/tim-kiem?key=Product 1
// kết quả: danh sách sản phẩm có tên hoặc mô tả chứa từ khóa tìm kiếm
router.get("/tim-kiem", async (req, res, next) => {
  try {
    const { key } = req.query;
    const products = await ProductController.searchProduct(key);
    return res.status(200).json({ status: true, data: products });
  } catch (error) {
    return res.status(500).json({ status: false, data: error.message });
  }
});

router.get("/tim-kiem", async (req, res) => {
  try {
    const { key } = req.query;
    if (!key) {
      return res
        .status(400)
        .json({ status: false, message: "Keyword is required" });
    }

    const products = await ProductController.searchProduct(key);
    return res.status(200).json({ status: true, data: products });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
});

//API lấy danh sách sản phẩm theo category_id
// method: get
// url: http://localhost:7777/products/danh-muc?id=1
// kết quả: danh sách sản phẩm theo danh mục
router.get("/danh-muc", async (req, res, next) => {
  try {
    const { id } = req.query;
    const products = await ProductController.getProductByCategory(id);
    return res.status(200).json({ status: true, data: products });
  } catch (error) {
    return res.status(500).json({ status: false, data: error.message });
  }
});

//API lấy danh sách sản phẩm có giá trong khoảng min, max
// và có số lượng lớn hơn 0
// method: get
// url: http://localhost:7777/products/loc-theo-gia?min=1&max=10
// kết quả: danh sách sản phẩm theo như yêu cầu, có sắp xếp tăng dần theo số lượng
router.get("/loc-theo-gia", async (req, res, next) => {
  try {
    const { min, max } = req.query;
    const products = await ProductController.getProductByPrice(min, max);
    return res.status(200).json({ status: true, data: products });
  } catch (error) {
    return res.status(500).json({ status: false, data: error.message });
  }
});

/**
 * API Xóa SP
 * method: post
 * url: http://localhost:7777/products/:id/delete
 * response: trå về sån phåm vừa cập nhật
 */
router.post("/:id/delete", async (req, res, next) => {
  try {
    const { id } = req.params;
    const products = await ProductController.deleteProduct(id);
    return res.status(200).json({ status: true, data: products }); //
  } catch (error) {
    return res.status(500).json({ status: false, data: error.message });
  }
});

/**
 * API Lấy sp theo id
 * method: get
 * url: http://localhost:7777/products/:id
 * response: trå về sån phåm vừa cập nhật
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const products = await ProductController.getById(id);
    return res.status(200).json({ status: true, data: products });
  } catch (error) {
    return res.status(500).json({ status: false, data: error.message });
  }
});

/**
 * method: GET
 * url: http://localhost:7777/products/top/top-10
 * response: trả về danh sách 10 sản phẩm có số lượng nhiều nhất
 */
router.get("/top/top-10", async (req, res) => {
  try {
    const products = await ProductController.getTopProduct();
    return res.status(200).json({ status: true, data: products });
  } catch (error) {
    return res.status(500).json({ status: false, data: error.message });
  }
});

//huy: Routes for adding and updating products

// Add a new product
// method: POST
// url: http://localhost:7777/products/add
// body: {name, price, quantity, images, description, category, color, size, status, inventory}
// response: Returns the newly created product
router.post("/add", async (req, res) => {
  try {
    const {
      name,
      price,
      quantity,
      images,
      description,
      category,
      color,
      size,
      status,
      inventory,
    } = req.body;
    const product = await ProductController.addProduct(
      name,
      price,
      quantity,
      images,
      description,
      category,
      color,
      size,
      status,
      inventory
    );
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update an existing product
// method: PUT
// url: http://localhost:7777/products/update/:id
// body: {name, price, quantity, images, description, category, color, size, status, inventory}
// response: Returns the updated product
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      price,
      quantity,
      images,
      description,
      category,
      color,
      size,
      status,
      inventory,
    } = req.body;
    const updatedProduct = await ProductController.updateProduct(
      id,
      name,
      price,
      quantity,
      images,
      description,
      category,
      color,
      size,
      status,
      inventory
    );
    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// API product khi nhan vao category ra 1 list ID
router.get("/category/:categoryId", ProductController.getProductsByCategory);
module.exports = router;
