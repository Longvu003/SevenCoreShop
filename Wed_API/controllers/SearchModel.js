const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

// Định nghĩa schema cho người dùng (User)
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// Tạo Model từ Schema
const User = mongoose.model('User', UserSchema);

module.exports = User;
