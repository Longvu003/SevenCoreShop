var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

require("./controllers/UserModel");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const productsRouter = require("./routes/products");
const categoriesRouter = require("./routes/categories");
const cartsRouter = require("./routes/carts");
const Order = require("./routes/Order");
const commentRoutes = require("./routes/cmt.js");

var app = express();

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  cors({
    origin: ["http://localhost:7777", "http://localhost:3000"], // Thêm domain của web app vào
    methods: ["GET", "POST", "PUT", "DELETE"], // Các phương thức HTTP được phép
    credentials: true, // Cho phép truyền cookie nếu cần
  })
);
// Cấu hình CORS
// app.use(
//   cors({
//     origin: ["http://192.168.1.3", "http://localhost:3000"], // Địa chỉ của frontend, có thể thay đổi theo ứng dụng của bạn
//     methods: ["GET", "POST", "PUT", "DELETE"], // Các phương thức được phép sử dụng
//     credentials: true, // Cho phép truyền cookie nếu cần thiết
//   })
// );

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

app.use("/api/comments", commentRoutes);
// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // Render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
