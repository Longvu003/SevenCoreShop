var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

//okokok - Import các route
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');
const cartsRouter = require('./routes/carts');
const searchRouter = require('./routes/search');
//okokok

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors()); // Cho phép các API khác gọi vào

// Kết nối tới MongoDB
mongoose.connect('mongodb://localhost:27017/TonsTai')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

// Định nghĩa các route
// http://localhost:7777/
app.use('/', indexRouter);
// http://localhost:7777/users
app.use('/users', usersRouter);
// http://localhost:7777/products
app.use('/products', productsRouter);
// http://localhost:7777/categories
app.use('/categories', categoriesRouter);
// http://localhost:7777/carts
app.use('/carts', cartsRouter);

app.use('/search', searchRouter);

// Bắt lỗi 404 và chuyển tiếp đến error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // Chỉ hiển thị lỗi trong môi trường phát triển
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render trang lỗi
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
