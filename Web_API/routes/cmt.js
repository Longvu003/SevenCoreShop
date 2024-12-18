const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/CmtController');

router.post('/', CommentController.addComment); 
router.get('/:productId', CommentController.getComments);  
router.put('/updateComment', CommentController.updateComment);
router.delete('/deleteComment/:commentId', CommentController.deleteComment);

module.exports = router;