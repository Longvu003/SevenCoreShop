const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Roles = new Schema({
    roleName: { type: String, required: true, unique: true}, // UserName
});

module.exports = mongoose.model('role', Roles);
