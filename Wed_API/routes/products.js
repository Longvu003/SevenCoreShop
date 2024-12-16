var express = require('express');
var router = express.Router();
// http://localhost:7777/products

const ProductController = require('../controllers/ProductController')

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


router.get('/', async (req, res, next) => {
    const { category_id } = req.query
    console.log(category_id)
    try {
        const checkListProducts = await ProductController.getProducts(category_id);
        return res.status(200).json({ status: true, data: checkListProducts });
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
router.post('/', async (req, res, next) => {
    try {
        const { name, price, quantity, images, description, category } = req.body;
        const product = await ProductController.addProduct(name, price, quantity, images, description, category);
        return res.status(200).json({ status: true, data: product })
    } catch (error) {
        return res.status(500).json({ status: false, data: error.message })
    }
});

/**
 * API cập nhật sản phẩn 
 * method: post
 * url: http://localhost:7777/products/:id/update
 * body: name, price, quantity, images, description, category
 * response: trå về sån phåm vừa cập nhật
 */
router.post('/:id/update', async (req, res, next) => {
    try {
        const { id } = req.params
        const { name, price, quantity, images, description, category } = req.body;
        console.log(req.body)
        // console.log(category)
        const product = await ProductController.updateProduct(id, name, price, quantity, images, description, category.category_id);
        return res.status(200).json({ status: true, data: product });
    } catch (error) {
        return res.status(500).json({ status: false, data: error.message });
    }
})




//API lấy danh sách sản phẩm theo category_id
// method: get
// url: http://localhost:7777/products/danh-muc?id=1
// kết quả: danh sách sản phẩm theo danh mục
router.get('/category', async (req, res, next) => {
    try {
        const { id } = req.query;
        const products = await ProductController.getProductByCategory(id);
        return res.status(200).json({ status: true, data: products })
    } catch (error) {
        return res.status(500).json({ status: false, data: error.message })
    }
});



/**
 * API Xóa SP
 * method: post
 * url: http://localhost:7777/products/:id/delete
 * response: trå về sån phåm vừa cập nhật
 */
router.post('/:id/delete', async (req, res, next) => {
    try {
        const { id } = req.params;
        const products = await ProductController.deleteProduct(id);
        return res.status(200).json({ status: true, data: products })//
    } catch (error) {
        return res.status(500).json({ status: false, data: error.message })
    }
});



/**
 * API Lấy sp theo id
 * method: get
 * url: http://localhost:7777/products/:id
 * response: trå về sån phåm vừa cập nhật
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);
        const products = await ProductController.getById(id);
        return res.status(200).json({ status: true, data: products })
    } catch (error) {
        return res.status(500).json({ status: false, data: error.message })
    }
});


module.exports = router;
