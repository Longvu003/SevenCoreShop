const ProductModel = require('./ProductModel');
const CategoryModel = require('./CategoryModel');



// Lấy danh sách sản phẩm (có thể lọc theo danh mục)
const getProducts = async (category = '') => {
    try {
        let products;
        if (category) {
            products = await ProductModel.find({ category });
        } else {
            products = await ProductModel.find();
        }
        return products;
    } catch (error) {
        console.log('Lỗi', error);
        throw new Error('Error while getting products');
    }
};

// Lấy tất cả sản phẩm
const getAllProducts = async () => {
    try {
        const products = await ProductModel.find();
        return products;
    } catch (error) {
        console.log('Lỗi', error);
        throw new Error('Error while getting all products');
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
        console.log('Search product error', error.message);
        throw new Error('Search product error');
    }
};


// Lấy danh sách sản phẩm theo danh mục
const getProductsByCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        
        // Tìm kiếm các sản phẩm dựa trên categoryId
        const products = await ProductModel.find({ category: categoryId }).populate('category');

        // Kiểm tra nếu không có sản phẩm nào
        if (products.length === 0) {
            return res.status(404).json({ message: 'Không có sản phẩm nào cho category này.', data: [] });
        }

        // Trả về kết quả trong một đối tượng JSON có thuộc tính data
        res.status(200).json({ data: products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi hệ thống.' });
    }
};


// Lấy danh sách sản phẩm theo khoảng giá và số lượng lớn hơn 0
const getProductByPrice = async (min, max) => {
    try {
        const products = await ProductModel.find({
            price: { $gte: min, $lte: max },
            quantity: { $gt: 0 }
        });
        return products;
    } catch (error) {
        console.log('Get product by price error', error.message);
        throw new Error('Get product by price error');
    }
};

// Thêm mới sản phẩm
const addProduct = async (name, price, quantity, images, description, category ,color,size,status,inventory) => {
    try {
        const categoryInDB = await CategoryModel.findById(category);
        if (!categoryInDB) {
            throw new Error('Category không tồn tại');
        }

        const product = new ProductModel({
            name,
            price,
            quantity,
            images,
            description,
            category,
            color,
            size,
            status,
            inventory  // Lưu category dưới dạng ObjectId
        });

        const result = await product.save();
        return result;
    } catch (error) {
        console.log('Add product error', error.message);
        throw new Error('Add product error');
    }
};

// Cập nhật sản phẩm
const updateProduct = async (id, name, price, quantity, images, description, category) => {
    try {
        const productInDb = await ProductModel.findById(id);
        if (!productInDb) {
            throw new Error('Sản phẩm không tồn tại');
        }

        const categoryInDB = await CategoryModel.findById(category);
        if (!categoryInDB) {
            throw new Error('Category không tồn tại');
        }

        productInDb.name = name || productInDb.name;
        productInDb.price = price || productInDb.price;
        productInDb.quantity = quantity || productInDb.quantity;
        productInDb.images = images || productInDb.images;
        productInDb.description = description || productInDb.description;
        productInDb.category = category;  // Cập nhật lại category như ObjectId
        productInDb.updatedAt = Date.now();

        await productInDb.save();
        return productInDb;
    } catch (error) {
        console.log('Update product error', error.message);
        throw new Error('Update product error');
    }
};

// Xóa sản phẩm
const deleteProduct = async (id) => {
    try {
        const productInDb = await ProductModel.findById(id);
        if (!productInDb) {
            throw new Error('Sản phẩm không tồn tại');
        }

        await ProductModel.deleteOne({ _id: id });
        return true;
    } catch (error) {
        console.log('Delete product error', error.message);
        throw new Error('Server error! Can not delete product');
    }
};

// Lấy chi tiết sản phẩm theo id
const getById = async (id) => {
    try {
        const productInDb = await ProductModel.findById(id);
        if (!productInDb) {
            throw new Error('Sản phẩm không tồn tại');
        }
        return productInDb;
    } catch (error) {
        console.log('Get product by id error', error.message);
        throw new Error('Server error! Can not find product');
    }
};

// Thống kê sản phẩm có số lượng lớn nhất
const getTopProduct = async () => {
    try {
        const products = await ProductModel
            .find({}, 'name price quantity')
            .sort({ quantity: -1 })
            .limit(10);
        return products;
    } catch (error) {
        console.log('Get top product error', error.message);
        throw new Error('Get top product error');
    }
};

module.exports = {
    getProducts,
    getAllProducts,
    searchProduct,
    getProductsByCategory,
    getProductByPrice,
    addProduct,
    updateProduct,
    deleteProduct,
    getById,
    getTopProduct
};
