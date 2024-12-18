// API để lấy tất cả bình luận cho sản phẩm
const Comment = require('../models/CmtModel');

exports.getComments = async (req, res) => {

    try {
      const { productId } = req.params;
      if (!productId) {
        return res.status(400).send('Không tìm thấy productId.');
      }
  
      const comments = await Comment.find({ productId });
      res.json(comments);
    } catch (error) {
      console.error('Lỗi khi lấy bình luận:', error);
      res.status(500).send('Lỗi server');
    }
  };
  

exports.addComment = async (req, res) => {
  try {
    const { commentText, productId, userEmail } = req.body;
    const newComment = new Comment({
      text: commentText,
      productId,
      userEmail,
      date: new Date(),
    });

    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    console.error('Lỗi khi thêm bình luận:', error);
    res.status(500).send('Có lỗi xảy ra khi thêm bình luận');
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { commentId, newText } = req.body; // 'newText' thay vì 'updatedText'
    if (!commentId || !newText) {
      return res.status(400).send('Thiếu commentId hoặc nội dung bình luận');
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { text: newText, date: new Date() },
      { new: true }
    );

    // Nếu không tìm thấy bình luận
    if (!updatedComment) {
      return res.status(404).send('Bình luận không tồn tại');
    }

    res.status(200).json(updatedComment); // Trả về bình luận đã được cập nhật
  } catch (error) {
    console.error('Lỗi khi cập nhật bình luận:', error);
    res.status(500).send('Có lỗi xảy ra khi cập nhật bình luận');
  }
};


exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    await Comment.findByIdAndDelete(commentId);
    res.status(200).send('Xóa bình luận thành công');
  } catch (error) {
    console.error('Lỗi khi xóa bình luận:', error);
    res.status(500).send('Có lỗi xảy ra khi xóa bình luận');
  }
};

