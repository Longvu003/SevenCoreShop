const exress = require("express");
const router = exress.Router();
const AddressController = require("../controllers/AddressController");
const UserModel = require("../model/UserModel");

router.post("/addAddress", async (req, res) => {
  const {
    userId,
    userNameAddress,
    phoneAddress,
    province,
    district,
    // nameAddress,
    ward,
    addressDetail,
    isDefault,
  } = req.body;

  try {
    const item = await AddressController.addAddress(
      userId,
      userNameAddress,
      phoneAddress,
      province,
      district,
      ward,
      // nameAddress,
      addressDetail,
      isDefault
    );

    if (item) {
      return res.status(200).json({ message: "Tạo thành công", data: item });
    } else {
      return res.status(500).json({ message: "Có lỗi khi tạo " });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/getAddressbyid", async (req, res) => {
  const { userId, addressId } = req.query;

  try {
    const result = await AddressController.getAddressById(userId, addressId);

    if (!result) {
      res.status(404).json({ message: "Có lỗi khi lấy" });
    } else {
      res.status(200).json({ message: "Lấy thành công", data: result });
    }
  } catch (error) {
    console.log(error);
  }
});

router.put("/updateAddressbyId", async (req, res) => {
  const {
    userId,
    userNameAddress,
    phoneAddress,
    addressId,
    province,
    district,
    ward,
    addressDetail,
    isDefault,
  } = req.body;
  try {
    const item = await AddressController.updateAddressById(
      userId,
      userNameAddress,
      phoneAddress,
      addressId,
      province,
      district,
      ward,
      // nameAddress,
      addressDetail,
      isDefault
    );
    if (!item) {
      res.status(404).json({ message: "Có lỗi khi lấy địa chỉ" });
    } else {
      res.status(200).json({ message: "Lấy thành công", data: item });
    }
  } catch (error) {
    // res.status(400).json({
    //   success: false,
    //   message: error.message,
    // });
    console.log("Lỗi lấy địa chỉ", error);
  }
});

router.delete("/deleteAddressById", async (req, res) => {
  const { userId, id } = req.query;

  try {
    const item = await AddressController.deleteAddressById(userId, id);
    if (item) {
      res.status(200).json({ message: "Xóa thành công", data: item });
    } else {
      res.status(404);
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
