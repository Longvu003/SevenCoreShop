var express = require("express");
var router = express.Router();
// http://localhost:7777/products

// const CategoryController = require("../controllers/CategoryController");
const ProductController = require("../controllers/ProductController");

/**
 * API cập nhật trạng thái available của sản phẩm
 * method: post
 * url: http://localhost:7777/products/:id/availability
 * body: { available }
 * response: trả về sản phẩm vừa cập nhật
 */
router.post('/:id/availability', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { available } = req.body;
        console.log(id, available)    
        const product = await ProductController.updateProductAvailability(id, available);
        return res.status(200).json({ status: true, data: product });
    } catch (error) {
        return res.status(500).json({ status: false, data: error.message });
    }
});


router.get("/", async (req, res, next) => {
  const category_id = req.query._id;

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
 * response: trả về sản phẩm vừa cập nhật
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
// kết quả: danh sách sản phẩm có tên hoặc mô tả chứa từ khóa tìm kiếm\

// Tài

// router.get("/tim-kiem", async (req, res, next) => {
//   try {
//     const { key } = req.query;
//     const products = await ProductController.searchProduct(key);
//     return res.status(200).json({ status: true, data: products });
//   } catch (error) {
//     return res.status(500).json({ status: false, data: error.message });
//   }
// });

// router.post('/:id/update', async (req, res, next) => {
//     try {
//         const { id } = req.params
//         const { name, price, quantity, images, description, category } = req.body;
//         console.log(req.body)
//         // console.log(category)
//         const product = await ProductController.updateProduct(id, name, price, quantity, images, description, category.category_id);
//         return res.status(200).json({ status: true, data: product });
//     } catch (error) {
//         return res.status(500).json({ status: false, data: error.message });
//     }
// })




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


/**
 * API xóa sản phẩm
 * method: POST
 * url: http://localhost:7777/products/:id/delete
 * response: kết quả xóa sản phẩm
 */
router.post("/:id/delete", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await ProductController.deleteProduct(id);
    return res.status(200).json({ status: true, data: deletedProduct });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
});

/**
 * API lấy chi tiết sản phẩm theo id
 * method: GET
 * url: http://localhost:7777/products/:id
 * response: thông tin sản phẩm theo id
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductController.getById(id);
    return res.status(200).json({ status: true, data: product });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
});

/**
 * API lấy top 10 sản phẩm theo số lượng bán nhiều nhất
 * method: GET
 * url: http://localhost:7777/products/top/top-10
 * response: danh sách 10 sản phẩm có số lượng nhiều nhất
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
router.put("/update/id", async (req, res) => {
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
router.get(
  "/getProductBycategory/:id",
  ProductController.getProductsByCategory
);

module.exports = router;
