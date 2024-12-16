const mongoose = require('mongoose');
const Order = require('../model/OrderModel'); // Đường dẫn tới file model Order

const bestsellitem = async () => {
  try {
    const startDate = new Date('2024-12-01T00:00:00.000Z');
    const endDate = new Date('2024-12-31T23:59:59.999Z');

    const bestSellingProduct = await Order.aggregate([
      { 
        $match: { 
          date: { $gte: startDate, $lte: endDate } 
        } 
      },
      { 
        $unwind: "$items" // Tách mảng items thành các phần tử riêng biệt 
      },
      {
        $group: {
          _id: "$items.productId", // Nhóm theo productId của sản phẩm
          name: { $first: "$items.name" }, // Lấy tên sản phẩm từ phần tử đầu tiên
          totalSold: { $sum: "$items.quantity" } // Tính tổng số lượng bán ra
        }
      },
      { 
        $sort: { totalSold: -1 } // Sắp xếp theo số lượng bán (giảm dần)
      },
      { 
        $limit: 5 // Giới hạn kết quả chỉ lấy 5 sản phẩm bán chạy nhất
      }
    ]);

    console.log('5 sản phẩm bán chạy nhất tháng 12/2024:', bestSellingProduct);
    return bestSellingProduct;
  } catch (error) {
    console.error('Lỗi truy vấn:', error);
  }
};

//tong tien theo thang
const tongtientheothang = async (year) => {
  try {
    const tongtienThang = await Order.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(`${year}-12-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: null, // Không nhóm theo trường cụ thể, chỉ tính tổng
          TongTienThang: { $sum: "$totalAmount" },
        },
      },
    ]);

    // Trả về tổng tiền hoặc 0 nếu không có đơn hàng
    return tongtienThang.length > 0 ? tongtienThang[0].TongTienThang : 0;
  } catch (error) {
    console.error("Lỗi khi tính tổng tiền trong tháng 12:", error);
    return 0;
  }

  //tong tien theo nam
};
const tongtientheonam = async () => {
  const tongTienNam = await Order.aggregate([
    {
      $group: {
        _id: { $year: "$date" },
        TongTienNam: { $sum: "$totalAmount" },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  return tongTienNam[0];
};
const getTotals = async () => {
  try {
    // Tổng tiền theo tháng cho năm 2024
    const TongTienThang = await tongtientheothang(2024);
    console.log("Tổng tiền theo tháng:", TongtTienThang);

    // Tổng tiền theo năm
    const tongTienNam = await tongtientheonam();
    console.log("Tổng tiền theo năm:", tongTienNam);
  } catch (error) {
    console.error("Lỗi khi tính tổng tiền:", error);
  }
};

const tongdonhang = async (year) => {
  const TongDonHang = await Order.aggregate([
    {
      $match: {
        date: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$date" }, // Nhóm theo tháng
        quantity: { $sum: 1 },  // Đếm số lượng sản phẩm
      },
    },
    {
      $sort: { _id: 1 }, // Sắp xếp theo thứ tự tháng (tăng dần)
    },
  ]);
  return TongDonHang;
};

module.exports = { bestsellitem, tongtientheothang, tongtientheonam, getTotals, tongdonhang };