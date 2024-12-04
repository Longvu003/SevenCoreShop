var express = require('express');
var router = express.Router();

const CartController = require('../controllers/CartController');
const CategoryController = require('../controllers/CategoryController')


/**
 * thêm giỏ hàng mới
 * method: post
 * body: {user, product}
 * url: http://localhost:7777/carts
 * return: {_id,user,product,total,status,date}
 */
router.post('/', async(req, res, next) =>{
    try {
        const {user, products} = req.body;
        const result  = await CartController.add(user, products);
        return res.status(200).json({status: true, data: result});
    } catch (error) {
        return res.status(500).json({status: false, data: error.message});
    }
});




/**
 * lấy toàn bộ đơn hàng của hệ thống, có sắp xếp theop ngày giờ mua
 * method: get
 * url: http://localhost:7777/carts?status=1&user=1
 * return:[{}]
 */

router.get('/', async (req,res) =>{
    try {
        const {user, product} =  req.query;
        const result = await CartController.getCarts({status:true, data: result});
        return res.status(200).json({status: true, data: result});
    } catch (error) {
        return res.status(500).json({status: false, data: error.message});
    }
})

module.exports = router;
