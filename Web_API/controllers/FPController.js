const FavoriteModel = require("../model/FPModel");
const ProductModel = require("../model/ProductModel");

// Thêm sản phẩm vào danh sách yêu thích
const addFavorite = async (req, res) => {
    const { userId, productId, nameProduct, quantity, price, images } = req.body;

    try {
        const favorite = await FavoriteModel.findOne({ userId });

        if (favorite) {
            const productIndex = favorite.favoriteItems.findIndex(
                (item) => item.productId.toString() === productId.toString()
            );

            if (productIndex === -1) {
                // Thêm sản phẩm mới
                favorite.favoriteItems.push({ productId, nameProduct, price, images });
            } else {
                // Cập nhật thông tin sản phẩm nếu đã tồn tại
                favorite.favoriteItems[productIndex] = {
                    productId,
                    nameProduct,
                    quantity,
                    price,
                    images,
                };
            }

            await favorite.save();
            return res.status(200).json({
                status: true,
                message: "Sản phẩm đã được thêm vào danh sách yêu thích",
            });
        } else {
            // Tạo danh sách yêu thích mới nếu chưa tồn tại
            const newFavorite = new FavoriteModel({
                userId,
                favoriteItems: [{ productId, nameProduct, quantity, price, images }],
            });

            await newFavorite.save();
            return res.status(201).json({
                status: true,
                message: "Danh sách yêu thích mới đã được tạo",
            });
        }
    } catch (error) {
        console.error("Lỗi khi thêm sản phẩm vào danh sách yêu thích:", error);
        return res.status(500).json({
            status: false,
            message: "Đã xảy ra lỗi khi thêm sản phẩm",
        });
    }
};

// Lấy danh sách yêu thích của người dùng
const getFavorites = async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({
            status: false,
            message: "userId là bắt buộc",
        });
    }

    try {
        // Lấy sản phẩm yêu thích và populate category_id của sản phẩm
        const favorite = await FavoriteModel.findOne({ userId })
            .populate("favoriteItems.productId") // Populating productId từ favoriteItems
            .populate("favoriteItems.productId.category.category_id");  // Populating category_id trong mỗi sản phẩm

        return res.status(200).json({
            status: true,
            data: favorite.favoriteItems,
        });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách yêu thích:", error);
        return res.status(500).json({
            status: false,
            message: "Đã xảy ra lỗi khi lấy danh sách yêu thích. Chi tiết lỗi: " + error.message,
        });
    }
};


// Xóa sản phẩm khỏi danh sách yêu thích
const removeFavorite = async (req, res) => {
    const { userId, productId } = req.query;

    // Kiểm tra xem userId có được truyền không
    if (!userId || !productId) {
        return res.status(400).json({
            status: false,
            message: "Thiếu thông tin userId hoặc productId trong yêu cầu",
        });
    }

    try {
        // Tìm danh sách yêu thích của người dùng theo userId
        const favorite = await FavoriteModel.findOne({ userId });

        // Nếu không tìm thấy danh sách yêu thích, trả về lỗi
        if (!favorite) {
            return res.status(404).json({
                status: false,
                message: "Không tìm thấy danh sách yêu thích của người dùng",
            });
        }

        // Kiểm tra xem sản phẩm có tồn tại trong danh sách yêu thích hay không
        const productIndex = favorite.favoriteItems.findIndex(
            (item) => item.productId.toString() === productId.toString()
        );

        // Nếu không tìm thấy sản phẩm trong danh sách yêu thích, trả về lỗi
        if (productIndex === -1) {
            return res.status(404).json({
                status: false,
                message: "Sản phẩm không tìm thấy trong danh sách yêu thích",
            });
        }

        // Loại bỏ sản phẩm khỏi danh sách yêu thích
        favorite.favoriteItems.splice(productIndex, 1);

        // Lưu lại danh sách yêu thích đã được cập nhật
        await favorite.save();

        // Trả về kết quả thành công
        return res.status(200).json({
            status: true,
            message: "Sản phẩm đã được xóa khỏi danh sách yêu thích",
        });
    } catch (error) {
        console.error("Lỗi khi xóa sản phẩm khỏi danh sách yêu thích:", error);
        return res.status(500).json({
            status: false,
            message: "Đã xảy ra lỗi khi xóa sản phẩm",
        });
    }
};




// Làm sạch danh sách yêu thích
const clearFavorites = async (req, res) => {
    const { userId } = req.body;

    try {
        const favorite = await FavoriteModel.findOne({ userId });

        if (favorite) {
            favorite.favoriteItems = [];
            await favorite.save();
            return res.status(200).json({
                status: true,
                message: "Danh sách yêu thích đã được làm sạch",
            });
        }

        return res.status(404).json({
            status: false,
            message: "Không tìm thấy danh sách yêu thích của người dùng",
        });
    } catch (error) {
        console.error("Lỗi khi làm sạch danh sách yêu thích:", error);
        return res.status(500).json({
            status: false,
            message: "Đã xảy ra lỗi khi làm sạch danh sách",
        });
    }
};

module.exports = {
    addFavorite,
    getFavorites,
    removeFavorite,
    clearFavorites,
};
