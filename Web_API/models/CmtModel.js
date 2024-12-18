const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  userEmail: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Comment', CommentSchema);
