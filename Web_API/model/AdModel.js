const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdSchema = new Schema({
  title: { type: String, required: true },
  tag: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Ad', AdSchema);
