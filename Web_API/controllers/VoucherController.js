const Voucher = require("../model/Voucher");

const validateVoucher = async (req, res) => {
    const { voucherCode, orderTotal } = req.body;
  
    try {
      const voucher = await Voucher.findOne({ code: voucherCode });
  
      if (!voucher) {
        return res.status(404).json({ success: false, message: "Voucher không tồn tại" });
      }
  
      const currentDate = new Date();
      if (voucher.status !== "active" || currentDate > voucher.expiryDate) {
        return res.status(400).json({ success: false, message: "Voucher hết hạn hoặc không khả dụng" });
      }
  
      if (orderTotal < voucher.minOrderValue) {
        return res.status(400).json({
          success: false,
          message: `Đơn hàng phải đạt tối thiểu ${voucher.minOrderValue} để áp dụng voucher`,
        });
      }
  
      const finalTotal = orderTotal - voucher.discountValue;
      return res.status(200).json({
        success: true,
        discountValue: voucher.discountValue,
        finalTotal: finalTotal > 0 ? finalTotal : 0,
        titleVoucher: voucher.titleVoucher,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  };

  const createVoucher = async (req, res) => {
    const { code, discountValue, minOrderValue, expiryDate, titleVoucher } = req.body;
  
    try {
      const existingVoucher = await Voucher.findOne({ code });
  
      if (existingVoucher) {
        return res.status(400).json({ success: false, message: "Voucher đã tồn tại" });
      }
  
      const newVoucher = new Voucher({
        code,
        discountValue,
        minOrderValue,
        expiryDate,
        titleVoucher,
        status: "active",
      });
  
      await newVoucher.save();
      res.status(201).json({ success: true, message: "Tạo voucher thành công", voucher: newVoucher });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  };

  const getVouchers = async (req, res) => {
    try {
      const vouchers = await Voucher.find();
      res.status(200).json({ success: true, vouchers });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
  };
  
  

module.exports = { validateVoucher, getVouchers, createVoucher };
