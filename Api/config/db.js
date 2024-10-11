const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

const local = "mongodb://127.0.0.1:27017/SEVENCORE"; // URL kết nối đến MongoDB

const connect = async () => {
  try {
    await mongoose.connect(local, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.log('MongoDB connection failed');
    console.error(error);
  }
};

module.exports = { connect };
