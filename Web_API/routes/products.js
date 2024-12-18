var express = require('express');
var router = express.Router();
const ProductController = require('../controllers/ProductController');

/**
 * API lấy danh sách tất cả sản phẩm
 * method: GET
 * url: http://localhost:7777/products?limit=10&page=1
 * response: trả về danh sách sản phẩm
 */
router.get('/', async (req, res) => {
    try {
        const { category_id, limit = 10, page = 1 } = req.query;
        const products = await ProductController.getProducts(category_id, limit, page);
        return res.status(200).json({ status: true, data: products });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
});

/**
 * API lấy tất cả sản phẩm
 * method: GET
 * url: http://localhost:7777/products/all
 * response: trả về tất cả sản phẩm
 */
router.get('/all', async (req, res) => {
    try {
        const products = await ProductController.getAllProducts();
        return res.status(200).json({ status: true, data: products });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
});

/**
 * API tạo sản phẩm mới
 * method: POST
 * url: http://localhost:7777/products
 * body: {name, price, quantity, images, description, category}
 * response: trả về sản phẩm vừa tạo
 */
router.post('/', async (req, res) => {
    try {
        const { name, price, quantity, images, description, category } = req.body;
        const product = await ProductController.addProduct(name, price, quantity, images, description, category);
        return res.status(201).json({ status: true, data: product });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
});

/**
 * API cập nhật sản phẩm
 * method: POST
 * url: http://localhost:7777/products/:id/update
 * body: name, price, quantity, images, description, category
 * response: trả về sản phẩm vừa cập nhật
 */
router.post('/:id/update', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, quantity, images, description, category } = req.body;
        if (!category || !category.category_id) {
            return res.status(400).json({ status: false, message: "Category ID is required" });
        }

        const updatedProduct = await ProductController.updateProduct(id, name, price, quantity, images, description, category.category_id);
        return res.status(200).json({ status: true, data: updatedProduct });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
});

/**
 * API tìm kiếm sản phẩm theo từ khóa
 * method: GET
 * url: http://localhost:7777/products/tim-kiem?key=Product 1
 * response: danh sách sản phẩm có tên hoặc mô tả chứa từ khóa
 */
router.get('/tim-kiem', async (req, res) => {
    try {
        const { key } = req.query;
        const products = await ProductController.searchProduct(key);
        return res.status(200).json({ status: true, data: products });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
});

/**
 * API lấy sản phẩm theo category_id
 * method: GET
 * url: http://localhost:7777/products/category?id=1
 * response: danh sách sản phẩm theo danh mục
 */
router.get('/category', async (req, res) => {
    try {
        const { id } = req.query;
        const products = await ProductController.getProductByCategory(id);
        return res.status(200).json({ status: true, data: products });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
});

/**
 * API lọc sản phẩm theo giá
 * method: GET
 * url: http://localhost:7777/products/loc-theo-gia?min=1&max=10
 * response: danh sách sản phẩm trong khoảng giá
 */
router.get('/loc-theo-gia', async (req, res) => {
    try {
        const { min, max } = req.query;
        const products = await ProductController.getProductByPrice(min, max);
        return res.status(200).json({ status: true, data: products });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
});

/**
 * API xóa sản phẩm
 * method: POST
 * url: http://localhost:7777/products/:id/delete
 * response: kết quả xóa sản phẩm
 */
router.post('/:id/delete', async (req, res) => {
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
router.get('/:id', async (req, res) => {
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
router.get('/top/top-10', async (req, res) => {
    try {
        const products = await ProductController.getTopProduct();
        return res.status(200).json({ status: true, data: products });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
});

module.exports = router;