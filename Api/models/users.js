const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Users = new Schema({
    username: { type: String, unique: true, maxLength: 255 }, // UserName
    password: { type: String, maxLength: 255 }, // Password
    phoneNumber: { type: String, maxLength: 15 }, // PhoneNumber
    email: { type: String, unique: true, maxLength: 255 }, // Email
    birthday: { type: Date }, // Brthday
    id_role: { type: Schema.Types.ObjectId, ref: 'role' }, // FK to ID_Role
    roleName: { type: String }
});

module.exports = mongoose.model('user', Users);
