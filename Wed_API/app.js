const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer'); // thêm multer ở đây
const Ad = require('./model/AdModel'); // import model nếu cần

// Cấu hình multer để lưu ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');
const cartsRouter = require('./routes/carts');
const orderRouter = require('./routes/orders');
const adsRouter = require('./routes/ads')(upload); // Chỉ khai báo một lần
// const paymentRoutes = require('./routes/payments'); // Import router thanh toán


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors()); // cho phép các API khác gọi vào

// kết nối database mongodb
mongoose.connect('mongodb://localhost:27017/TonsTai')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

// Đăng ký router
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
app.use('/carts', cartsRouter);
app.use('/ads', adsRouter); // Đăng ký router quảng cáo
app.use('/orders', orderRouter);
// app.use('/payments', paymentRoutes); // Đăng ký router thanh toán

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
