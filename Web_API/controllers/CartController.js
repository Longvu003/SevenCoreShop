const mongoose = require("mongoose");
const CartModel = require("../model/CartModel");
const UserModel = require("../model/UserModel");
const ProductModel = require("../model/ProductModel");
// Hàm thêm sản phẩm vào giỏ hàng
const add = async (
  userId,
  productId,
  nameProduct,
  quantity,
  price,
  images
  // statusProduct
) => {
  try {
    const item = await CartModel.findOne({
      userId: userId,
    });
    if (item) {
      const itemIndex = item.cartItems.findIndex(
        (item) => item.productId.toString() === productId.toString()
      );
      if (itemIndex !== -1) {
        item.cartItems[itemIndex].quantity += quantity;
        await item.save();
      } else {
        item.cartItems.push({
          productId,
          nameProduct,
          quantity,
          price,
          images,
          // statusProduct,
        });
        await item.save();
      }
    } else {
      // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
      const newItem = new CartModel({
        userId,
        cartItems: [{ productId, nameProduct, quantity, price, images }],
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

    const itemDeleted = await CartModel.findOneAndDelete({
      userId,
      "cartItems.productId": productId,
    });

    return itemDeleted;
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
    return false;
  }
};

// Hàm lấy sản phẩm trong giỏ hàng
const getItemCart = async (userId) => {
  try {
    const items = await CartModel.find({ userId });
    return items;
  } catch (error) {
    console.log("Lỗi khi lấy sản phẩm trong giỏ hàng:", error);
  }
};

// Hàm cập nhật sản phẩm trong giỏ hàng
// const updateItemCart = async (userId, productId, quantity) => {
//   try {
//     const item = await CartModel.findOne({ userId, productId }).exec();

//     if (!item) {
//       console.log("Sản phẩm không tồn tại trong giỏ hàng");
//       return { success: false, message: "Sản phẩm không tồn tại" };
//     }
//     item.quantity = quantity;
//     await item.save();
//     return { success: true, item };
//   } catch (error) {
//     console.error("Lỗi khi cập nhật sản phẩm trong giỏ hàng:", error);
//     return { success: false, message: "Đã xảy ra lỗi khi cập nhật" };
//   }
// };

// Cập nhật hoặc xóa sản phẩm trong giỏ hàng
const updateCartItem = async (req, res) => {
  try {
    // Tìm giỏ hàng của người dùng
    const cart = await CartModel.findOne({ userId });
    await cart.save();
    return cart;
  } catch (error) {
    console.error("Lỗi khi cập nhật giỏ hàng:", error);
  }
};
const deleteCartPayment = async () => {
  const item = await CartModel.findOne({ userId });
  await item.save();
  return item;
};
const resetCart = async (req, res) => {
  const { userId } = req.body;
  const objectId = new mongoose.Types.ObjectId(userId);
  try {
    const cart = await CartModel.findOne({ userId: objectId });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "No items in the cart" });
    }

    cart.cartItems = [];
    await cart.save();

    return res
      .status(200)
      .json({ success: true, message: "Làm sạch giỏ hàng" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return res
      .status(500)
      .json({ success: false, message: "Có lỗi khi làm sạch giỏ hàng" });
  }
};

module.exports = {
  add,
  updateCartItem,
  deleteItemcart,
  getItemCart,
  deleteCartPayment,
  resetCart,
};
