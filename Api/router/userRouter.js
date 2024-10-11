const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController");
const jwt = require("jsonwebtoken");
const userModel = require("../Model/userModel");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const SECRET_KEY = "LongVu";

router.post("/login", async (req, res) => {
  const { phone, password } = req.body;
  try {
    const user = await userModel.findOne({ phone });
    if (!user) {
      return res.status(400).json({ message: "User không tồn tại!" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "sai password" });
    }
    // const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });

    res.json({
      user: {
        id: user._id.toString(),
        nameUser: user.nameUser,
        address: user.address,
        phone: user.phone,
        payment: user.payment,
      },
    });
  } catch (error) {
    console.error("Lỗi", error);
  }
});

router.get("/getid", async (req, res) => {
  const { id } = req.query;
  try {
    const userApi = await userModel.findById({ _id: id });
    if (!userApi) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json({
        message: "Lấy thành công",
        userApi: {
          id: userApi._id,
          nameUser: userApi.nameUser,
          address: userApi.address,
          phone: userApi.phone,
          payment: userApi.payment,
        },
      });
    }
  } catch (error) {
    console.log("Lỗi nè: ", error);
  }
});

router.post("/addUser", async (req, res) => {
  const { nameUser, password, address, phone, payment } = req.body;
  console.log(req.body);
  try {
    const user = await userController.addUser(
      nameUser,
      password,
      address,
      phone,
      payment
    );
    if (user) {
      res.status(200).json({ message: "Tạo thành công", status: 200 });
    } else {
      res.json({ message: "Tạo thất bại" });
    }
  } catch (error) {
    console.log(error);
  }
});
router.put("/editUser", async (req, res) => {
  const { id, ...update } = req.body;
  try {
    const userEdit = userController.editUser(id, update);
    if (userEdit) {
      res.status(200).json({ message: "Sửa thành công" });
    } else {
      res.json({ message: "Có lỗi khi update" });
    }
  } catch (error) {
    console.log(error);
  }
});
router.delete("/deleteUser", async (req, res) => {
  const { id } = req.body;

  try {
    const user = userController.deleteUser(id);
    if (!user) {
      res.json({ message: "Có lỗi khi xóa" });
    } else {
      res.status(200).json({ message: "Xóa thành công" });
    }
  } catch (error) {
    console.log(error);
  }
});
router.get("/getAllUser", async (req, res) => {
  try {
    const user = await userController.getAllUser();
    if (user) {
      res.status(200).json({ message: "Lấy thành công", user });
    } else {
      res.status(404).json({ message: "Có lỗi khi lấy" });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
