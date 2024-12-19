const exress = require("express");
const router = exress.Router();
const AddressController = require("../controllers/AddressController");

router.post("/addAddress", async (req, res) => {
  const { userId, nameAddress, address, isDefault } = req.body;
  try {
    const item = await AddressController.addAddress(
      userId,
      nameAddress,
      address,
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

module.exports = router;
