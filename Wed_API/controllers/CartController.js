const CartModel = require('../model/CartModel');
const UserModel = require('../model/UserModel');
const ProductModel = require('../model/ProductModel');

const add = async (user, products) => {
    try {
        // user: user id của người mua
        // products: mảng id của sản phẩm và số lượng mua
        const userInDB = await UserModel.findById(user);
        if (!userInDB) {
            throw new Error('User not found');
        }
        // kiểm tra products có phải là mảng hay không
        if (!Array.isArray(products)) {
            throw new Error('Products must be an array');
        }
        let productsInCart = [];
        let total = 0;
        for (let index = 0; index < products.length; index++) {
            const item = products[index];
            const product = await ProductModel.findById(item._id);
            if (!product) {
                throw new Error('Product not found');
            }
            // nếu số lượng lớn hơn số lượng tồn kho
            if (item.quantity > product.quantity) {
                throw new Error('Product out of stock');
            }
            const productItem = {
                _id: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
            };
            productsInCart.push(productItem);
            total += product.price * item.quantity;
        }
        // tạo giỏ hàng mới
        const cart = new CartModel({
            user: {_id: userInDB._id, name: userInDB.name},
            products: productsInCart,
            total,
        });
        const result = await cart.save();
        // chạy ngầm cập nhật số lượng tồn kho của sản phẩm
        setTimeout(async () => {
            for (let index = 0; index < products.length; index++) {
                const item = products[index];
                const product = await ProductModel.findById(item._id);
                product.quantity -= item.quantity;
                await product.save();
            }
        }, 0);
        return result;
    } catch (error) {
        console.log(error);
        throw new Error('Add to cart failed');
    }
}

// lấy toàn bộ đơn hàng của hệ thống, có săp xếp theo ngày giờ mua
// lấy toàn bộ đơn hàng theo trạng thái, có sắp xếp theo ngày giờ mua
// lấy toàn bộ đơn hàng của 1 người dùng, có sắp xếp theo ngày giờ mua
const getCarts = async (status, user) => {
    try {
        let query = {};
        if (status) {
            query.status = status;
        }
        if (user) {
            query.user = user;
        }
        const carts = await CartModel
            .find(query)
            .sort({ date: -1 });
        return carts;
    } catch (error) {
        console.log(error);
        throw new Error('Get carts failed');
    }
}

// cập nhật trạng thái đơn hàng
const updateCart= async (id, status) => {
    try {
        const cart = await CartModel.findById(id);
        if (!cart) {
            throw new Error('Cart not found');
        }
        if (status < cart.status || (status == AppConstant.CART_STATUS.AppConstant.
            HOAN_THANH && cart.status == AppConstant.CART_STATUS.DA_HUY)) {
            throw new Error('Can not to higher status');
        }
        cart.status = status;
        let result = await cart.save();
        // cập nhật trạng thái đơn hàng của user
        setTimeout(async () => {
            const user = await UserModel.findById(cart.user._id); 
            if (!user) {
                throw new Error('User not found');
            }
            let item = user.carts.find(item => item._id == id);
            item.status = status;
            await user.save();
        }, 0);
        return result;
    } catch (error) {
        console.log(error);
        throw new Error('Update status failed');
    }
}

module.exports = { add, getCarts, updateCart }