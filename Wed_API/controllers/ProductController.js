const ProductModel = require("../model/ProductModel");
const CategoryModel = require("../model/CategoryModel");

// Lấy danh sách sản phẩm
const getProducts = async (category = '') => {
    try {
        const products = category ? 
            await ProductModel.find({ category }) : 
            await ProductModel.find();
        return products;
    } catch (error) {
        console.log('Lỗi khi lấy sản phẩm:', error.message);
        throw new Error('Không thể lấy danh sách sản phẩm');
    }
};

// Lấy danh sách sản phẩm theo danh mục
const getProductByCategory = async (category_id) => {
    try {
        const products = await ProductModel.find({ 'category.category_id': category_id });
        return products;
    } catch (error) {
        console.log('Lỗi khi lấy sản phẩm theo danh mục:', error.message);
        throw new Error('Không thể lấy sản phẩm theo danh mục');
    }
};

// Tìm kiếm sản phẩm theo từ khóa
const searchProduct = async (key) => {
    try {
        const products = await ProductModel.find({
            $or: [
                { name: { $regex: key, $options: 'i' } },
                { description: { $regex: key, $options: 'i' } }
            ]
        });
        return products;
    } catch (error) {
        console.log('Lỗi khi tìm kiếm sản phẩm:', error.message);
        throw new Error('Không thể tìm kiếm sản phẩm');
    }
};

// Lấy sản phẩm theo giá và số lượng
const getProductByPrice = async (min, max) => {
    try {
        const products = await ProductModel.find({
            price: { $gte: min, $lte: max },
            quantity: { $gt: 0 }
        });
        return products;
    } catch (error) {
        console.log('Lỗi khi lấy sản phẩm theo giá:', error.message);
        throw new Error('Không thể lấy sản phẩm theo giá');
    }
};

// Thêm mới sản phẩm
const addProduct = async (name, price, quantity, images, description, category) => {
    try {
        // Kiểm tra xem sản phẩm đã tồn tại chưa
        const existingProduct = await ProductModel.findOne({ name });
        if (existingProduct) {
            throw new Error('Sản phẩm với tên này đã tồn tại');
        }

        // Kiểm tra danh mục
        const categoryInDB = await CategoryModel.findById(category);
        if (!categoryInDB) {
            throw new Error('Danh mục không tồn tại');
        }

        const categoryObj = {
            category_id: category,
            category_name: categoryInDB.name
        };

        const product = new ProductModel({
            name, price, quantity, images, description, category: categoryObj
        });

        const newProduct = await product.save();
        return newProduct;
    } catch (error) {
        console.log('Lỗi khi thêm sản phẩm:', error.message);
        throw new Error('Không thể thêm sản phẩm');
    }
};

// Cập nhật sản phẩm
const updateProduct = async (id, name, price, quantity, images, description, category) => {
    try {
        // Kiểm tra danh mục
        if (!category) {
            throw new Error('Danh mục là bắt buộc');
        }

        const productInDb = await ProductModel.findById(id);
        if (!productInDb) {
            throw new Error("Sản phẩm không tồn tại");
        }

        // Kiểm tra tên sản phẩm đã tồn tại chưa
        const existingProduct = await ProductModel.findOne({ name });
        if (existingProduct && existingProduct._id.toString() !== id) {
            throw new Error('Sản phẩm với tên này đã tồn tại');
        }

        // Kiểm tra danh mục
        const categoryInDB = await CategoryModel.findById(category);
        if (!categoryInDB) {
            throw new Error('Danh mục không tồn tại');
        }

        const categoryObj = {
            category_id: category,
            category_name: categoryInDB.name
        };

        // Cập nhật sản phẩm
        productInDb.name = name || productInDb.name;
        productInDb.price = price || productInDb.price;
        productInDb.quantity = quantity || productInDb.quantity;
        productInDb.images = images || productInDb.images;
        productInDb.description = description || productInDb.description;
        productInDb.category = categoryObj;

        await productInDb.save();
        return true;
    } catch (error) {
        console.log('Lỗi khi cập nhật sản phẩm:', error.message);
        throw new Error('Không thể cập nhật sản phẩm');
    }
};

// Xóa sản phẩm
const deleteProduct = async (id) => {
    try {
        const productInDb = await ProductModel.findById(id);
        if (!productInDb) {
            throw new Error("Sản phẩm không tồn tại");
        }

        await ProductModel.deleteOne({ _id: id });
        return true;
    } catch (error) {
        console.log("Lỗi khi xóa sản phẩm:", error.message);
        throw new Error('Không thể xóa sản phẩm');
    }
};

// Lấy chi tiết sản phẩm theo ID
const getById = async (id) => {
    try {
        const productInDb = await ProductModel.findById(id);
        if (!productInDb) {
            throw new Error('Sản phẩm không tồn tại');
        }
        return productInDb;
    } catch (error) {
        console.log("Lỗi khi lấy chi tiết sản phẩm:", error.message);
        throw new Error('Không thể lấy chi tiết sản phẩm');
    }
};

module.exports = {
    getProducts,
    deleteProduct,
    getById,
    updateProduct,
    searchProduct,
    getProductByCategory,
    getProductByPrice,
    addProduct,
};