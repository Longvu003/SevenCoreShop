//huy
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    images: { type: Array, default: [] }
});
module.exports = mongoose.model.category || mongoose.model('category', CategorySchema); 
