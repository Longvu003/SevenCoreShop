const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    otpExpiry: {
        type: Date,
        required: true,
    },
    
}, {
    timestamps: true 
});

module.exports = mongoose.model('OtpModel', otpSchema);
