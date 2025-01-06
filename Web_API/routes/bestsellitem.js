const mongoose = require("mongoose");
var express = require("express");

var router = express.Router();

const BestSellItemController = require("../controllers/BestsellitemController");

router.get("/thongke", async (req, res) => {
  try {
    const TongTienNam = await BestSellItemController.tongtientheonam();
    const currentYear = new Date().getFullYear();
    const TongTienThang = await BestSellItemController.tongtientheothang(
      currentYear
    );
    const bestSellingProduct = await BestSellItemController.bestsellitem();
    const TongDonHang = await BestSellItemController.tongdonhang(currentYear);
    return res.status(200).json({
      message: "Nhập Dữ Liệu Thành Công",
      bestSellingProduct: bestSellingProduct,
      ...TongTienNam,
      TongTienThang,
      TongDonHang: TongDonHang,
    });
  } catch (error) {
    console.error("Lỗi trong route /thongke:", error.stack);
    return res.status(500).json({ status: false, data: error.message });
  }
});

module.exports = router;
