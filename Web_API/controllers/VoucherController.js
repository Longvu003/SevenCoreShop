const VoucherModel = require('../model/VoucherModel');
const mongoose = require('mongoose');

const validateVoucher = async (req, res) => {
  const { voucherCode, orderTotal } = req.body;

  try {
    const voucher = await VoucherModel.findOne({ code: voucherCode });

    if (!voucher) {
      return res
        .status(404)
        .json({ success: false, message: "Voucher không tồn tại" });
    }

    const currentDate = new Date();
    if (voucher.status !== "active" || currentDate > voucher.expiryDate) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Voucher hết hạn hoặc không khả dụng",
        });
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

// const createVoucher = async (req, res) => {
//   const { code, discountValue, expiryDate, titleVoucher } = req.body;

//   try {
//     if (!code || !discountValue || !expiryDate || !titleVoucher) {
//       return res.status(400).json({
//           status: false,
//           message: 'Code, discountValue, titleVoucher, and expiryDate are required',
//       });
//   }
//     const existingVoucher = await Voucher.findOne({ code });

//     if (existingVoucher) {
//       return res.status(400).json({ success: false, message: "Voucher đã tồn tại" });
//     }

//     const newVoucher = new Voucher({
//       code,
//       discountValue,
//       minOrderValue,
//       expiryDate,
//       titleVoucher,
//       status: "active",
//     });

//     await newVoucher.save();
//     res.status(201).json({ success: true, message: "Tạo voucher thành công", voucher: newVoucher });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Lỗi hệ thống" });
//   }
// };

const createVoucher = async (code, discountValue, quantity, expiryDate, titleVoucher) => {
  try {
    const voucherInfo = {
      code,
      discountValue,
      quantity,
      expiryDate,
      titleVoucher,
    };

    const voucher = new VoucherModel(voucherInfo);
    await voucher.save();
    return voucher;
  } catch (error) {
    console.log("Create voucher error", error.message);
    throw new Error("Create voucher error");
  }
};

const getVouchers = async () => {
  try {
    const vouchers = await VoucherModel.find(); // lấy tất cả danh mục trong db
    return vouchers; //
  } catch (error) {
    console.log("Get vouchers list error", error.message);
    throw new Error("Get vouchers list error");
  }
};

// Xóa thông báo theo ID
const deleteVoucherById = async (id) => {
   try {
       // Xóa danh mục nếu không có sản phẩm liên kết
       const voucher = await VoucherModel.findByIdAndDelete(id);

       // Nếu không tìm thấy danh mục để xóa
       if (!voucher) {
           throw new Error('Voucher not found');
       }

       return voucher; // Thông báo thành công
   } catch (error) {
       console.log('Delete voucher error:', error.message);
       throw new Error(error.message); // Trả về lỗi chi tiết
   }
}

// get category by id
   const getVoucherById = async (id) => {
       try {
           const voucher = await VoucherModel.findById(id)
           return voucher
       } catch (error) {
           console.log('Get voucher by id error', error.message)
           throw new Error('Get voucher by id error')
       }
   }

const updateVoucher = async (id, code, discountValue, quantity, expiryDate, titleVoucher) => {
   try {
       // Kiểm tra ID hợp lệ
       if (!mongoose.Types.ObjectId.isValid(id)) {
           throw new Error('Invalid voucher ID');
       }

       // Tìm danh mục theo ID
       const voucher = await VoucherModel.findById(id);
       if (!voucher) {
           throw new Error('Voucher không tồn tại');
       }

       // Cập nhật từng trường nếu có giá trị mới
       voucher.code = code || voucher.code;
       voucher.titleVoucher = titleVoucher || voucher.titleVoucher;
       voucher.quantity = quantity || voucher.quantity;
       voucher.discountValue = discountValue || voucher.discountValue;
       voucher.expiryDate = expiryDate || voucher.expiryDate;
       

       // Lưu cập nhật vào database
       console.log('Updated voucher:', voucher); // Log để kiểm tra
       await voucher.save();
       return voucher;
   } catch (error) {
       console.error('Update voucher error:', error.message);
       throw new Error('Update voucher failed');
   }
};

const useVoucher = async (id) => {
  try {
    // Tìm voucher theo mã voucher
    const voucher = await VoucherModel.findById(id);
    if (!voucher) {
      throw new Error('Voucher không tồn tại');
    }

    // Kiểm tra xem voucher có còn số lượng không
    if (voucher.quantity <= 0) {
      throw new Error('Voucher đã hết số lượng');
    }

    // Cập nhật trạng thái voucher và giảm số lượng
    voucher.quantity -= 1; // Giảm số lượng
    if (voucher.quantity === 0) {
      voucher.status = 'inactive'; // Đánh dấu voucher đã hết
    }

    // Lưu cập nhật vào cơ sở dữ liệu
    await voucher.save();

    console.log('Voucher đã được sử dụng thành công');
    return voucher;
  } catch (error) {
    console.error('Lỗi khi sử dụng voucher:', error.message);
    throw new Error('Lỗi khi sử dụng voucher');
  }
};
module.exports = { useVoucher ,validateVoucher, getVouchers, createVoucher, deleteVoucherById, getVoucherById, updateVoucher };
