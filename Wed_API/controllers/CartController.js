const mongoose = require("mongoose");
const CartModel = require("../model/CartModel");
const UserModel = require("../model/UserModel");
const ProductModel = require("../model/ProductModel");
const OrderModel = require("../model/OrderModel");
// const OrderModel = require("./OrderModel");

// Hàm thêm sản phẩm vào giỏ hàng
const add = async (userId, productId, nameProduct, quantity, price, images) => {
  try {
    const item = await CartModel.findOne({ userId, productId });
    if (item) {
      // Nếu sản phẩm đã tồn tại trong giỏ hàng, tăng số lượng
      await CartModel.updateOne(
        { userId, productId },
        { $inc: { quantity: quantity } } // Tăng số lượng
      );
    } else {
      // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
      const newItem = new CartModel({
        userId,
        productId,
        nameProduct,
        quantity,
        price,
        images,
      });

      await newItem.save();
    }
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error.stack);
  }
};

// Hàm xóa sản phẩm khỏi giỏ hàng
const deleteItemcart = async (userId, productId) => {
  try {
    // console.log("Tìm sản phẩm với userId:", userId, "và productId:", productId); // Log để kiểm tra thông tin

    const itemDeleted = await CartModel.findOne({ userId, productId });

    if (!itemDeleted) {
      console.log("Không tìm thấy sản phẩm trong giỏ hàng");
      return {
        success: false,
        message: "Sản phẩm không tồn tại trong giỏ hàng",
      };
    }

    return { success: true, itemDeleted };
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
    return { success: false, message: "Đã xảy ra lỗi khi xóa sản phẩm" };
  }
};

// Hàm lấy sản phẩm trong giỏ hàng
const getItemCart = async (userId) => {
  try {
    const items = await CartModel.find({ userId });
    // console.log("All cart items:", items);
    return items;
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm trong giỏ hàng:", error);
  }
};

// Hàm cập nhật sản phẩm trong giỏ hàng
const updateItemCart = async (userId, productId, quantity) => {
  try {
    const item = await CartModel.findOne({ userId, productId }).exec();

    if (!item) {
      console.log("Sản phẩm không tồn tại trong giỏ hàng");
      return { success: false, message: "Sản phẩm không tồn tại" };
    }

    item.quantity = quantity;
    await item.save();
    return { success: true, item };
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm trong giỏ hàng:", error);
    return { success: false, message: "Đã xảy ra lỗi khi cập nhật" };
  }
};

// const updateItemCart = async (userId, productId, quantity) => {
//   try {
//     const item = await CartModel.findOne({ userId, "cartItems.productId": productId });

//     if (!item) {
//       console.log("Sản phẩm không tồn tại trong giỏ hàng");
//       return { success: false, message: "Sản phẩm không tồn tại" };
//     }

//     // Tìm sản phẩm trong giỏ hàng
//     const productIndex = item.cartItems.findIndex(
//       (p) => p.productId.toString() === productId.toString()
//     );

//     if (productIndex === -1) {
//       console.log("Sản phẩm không tồn tại trong danh sách giỏ hàng");
//       return { success: false, message: "Sản phẩm không tồn tại" };
//     }

//     // Kiểm tra số lượng
//     if (quantity <= 0) {
//       // Xóa sản phẩm
//       item.cartItems.splice(productIndex, 1);
//       if (item.cartItems.length === 0) {
//         // Nếu giỏ hàng rỗng, xóa luôn document
//         await CartModel.findByIdAndDelete(item._id);
//         console.log("Giỏ hàng đã bị xóa do không còn sản phẩm");
//       } else {
//         await item.save();
//       }
//       return { success: true, message: "Sản phẩm đã được xóa khỏi giỏ hàng" };
//     } else {
//       // Cập nhật số lượng
//       item.cartItems[productIndex].quantity = quantity;
//       await item.save();
//       return { success: true, item };
//     }
//   } catch (error) {
//     console.error("Lỗi khi cập nhật sản phẩm trong giỏ hàng:", error);
//     return { success: false, message: "Đã xảy ra lỗi khi cập nhật" };
//   }
// };

module.exports = { add, updateItemCart, deleteItemcart, getItemCart };
