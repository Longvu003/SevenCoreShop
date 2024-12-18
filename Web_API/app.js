<<<<<<< HEAD:Wed_API/app.js
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
require("./model/UserModel");
//okokok
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const productsRouter = require("./routes/products");
const categoriesRouter = require("./routes/categories");
const cartsRouter = require("./routes/carts");
const Order = require("./routes/Order");
const PayOnline = require("./routes/PayOnline");
const Transaction = require("./routes/crontransaction");
const resetPass = require("./routes/repass");
const commentRoutes = require("./routes/cmt");
const bestsellitem = require("./routes/bestsellitem.js");
//okokok
const multer = require("multer");
const Ad = require("./model/AdModel");
// Cấu hình multer để lưu ảnh
const upload = require("./cloudpng/upload");
const adsRouter = require("./routes/ads")(upload);
const dotenv = require("dotenv");
dotenv.config();

var app = express();
=======
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
>>>>>>> e1d2a5e2f902e09d730113492608d135e8fb4d6b:Web_API/app.js

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
<<<<<<< HEAD:Wed_API/app.js
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:7777"], // Thêm domain của web app vào
    methods: ["GET", "POST", "PUT", "DELETE"], // Các phương thức HTTP được phép
    credentials: true, // Cho phép truyền cookie nếu cần
  })
);

// Kết nối database mongodb
mongoose
  .connect("mongodb://localhost:27017/TonsTai")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));
// Định nghĩa các router
// http://localhost:7777/
app.use("/", indexRouter);
// http://localhost:7777/users
app.use("/users", usersRouter);
// http://localhost:7777/products
app.use("/products", productsRouter);
// http://localhost:7777/categories
app.use("/categories", categoriesRouter);
// http://localhost:7777/carts
app.use("/carts", cartsRouter);
// // http://localhost:7777/api/carts
// app.use('/carts/checkout', cartsRouter);
app.use("/Orders", Order);
app.use("/resetpass", resetPass);
app.use("/api/comments", commentRoutes);
app.use("/cron", Transaction);
// http://localhost:7777/payonline
app.use("/payonline", PayOnline);
// http://localhost:7777/cron
app.use("/ads", adsRouter); // Đăng ký router quảng cáo
app.use("/images", express.static("images")); // Đăng ký router ảnh
app.use("/bestsell", bestsellitem);
// catch 404 and forward to error handler
// app.use((req, res, next) => {
//   next(createError(404));
// });

// Error handler
app.use(function (err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // Render the error page
=======
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
>>>>>>> e1d2a5e2f902e09d730113492608d135e8fb4d6b:Web_API/app.js
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
