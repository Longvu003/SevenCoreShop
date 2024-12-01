var express = require('express');
var router = express.Router();
// http://localhost:7777/sizes
const SizeController = require('../controllers/SizeController')
/**
 * method: GET
 * url: http://localhost:7777/sizes
 * response: trả về danh sách tất cả size
 */
router.get('/', async (req, res, next) => {
    try {
        const sizes = await SizeController.getSizeList()
        return res.status(200).json({status: true, data: sizes});
    } catch (error) {
        console.log('Get size list error', error.message) 
        res.status(500).json({status: false, data: error.message})
    }
}
);
/**
 * method: POST
 * url: http://localhost:7777/sizes/add
 * body: {name}
 * response: trả về size vừa tạo
 */
router.post('/add', async (req, res, next) => {
    try {
        const {name} = req.body
        console.log(req.body);
        const size = await SizeController.createSize(name)
        return res.status(200).json({status: true, data: size});
    } catch (error) {
        console.log('Create size error', error.message)
        res.status(500).json({status: false, data: error.message})
    }
}
);
/**
 * method: DELETE
 * url: http://localhost:7777/sizes/:id/delete
 * response: trả về size vừa xóa
 */
router.post('/:id/delete', async (req, res, next) => {
    try {
        const id = req.params.id;
        const size = await SizeController.deleteSize(id);
        return res.status(200).json({ status: true, data: size });
    } catch (error) {
        console.log('Delete size error', error.message);
        res.status(500).json({ status: false, data: error.message });
    }
}
);
/**
 * method: PUT
 * url: http://localhost:7777/sizes/:id/update
 * body: {name}
 * response: trả về size vừa update
 */
router.post('/:id/update', async (req, res, next) => {
    try {
        const id = req.params.id;
        const {name} = req.body
        const size = await SizeController.updateSize(id, name);
        return res.status(200).json({ status: true, data: size });
    } catch (error) {
        console.log('Update size error', error.message);
        res.status(500).json({ status: false, data: error.message });
    }
}
);
/**
 * method: GET
 * url: http://localhost:7777/sizes/:id
 * response: trả về size theo id
 */
router.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id
        const size = await SizeController.getSizeById(id)
        return res.status(200).json({status: true, data: size});
    } catch (error) {
        console.log('Get size by id error', error.message)
        res.status(500).json({status: false, data: error.message})
    }
}
);
module.exports = router;
