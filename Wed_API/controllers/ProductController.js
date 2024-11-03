const ProductModel = require("../model/ProductModel")
const CategoryModel = require("../model/CategoryModel")


// lấy danh sách sản phẩm
const getProducts = async (category = '') => {
    try {
        if (category) {
            const products = await ProductModel.find({category});
            return products;
        } else {
            const products = await ProductModel.find();
            return products
        }
            
    } catch (error) {
        console.log('Lỗi', error);
    }
}


//lấy danh sách sản phẩm theo danh mục
const getProductByCategory = async (category_id) => {
    try {
        const products = await ProductModel.find({
            'category.category_id': category_id
        })
        return products;
    } catch (error) {
        console.log('Get product by category error', error.message)
        throw new Error('Get product by category error')
    }
}

const getAllProducts = async () => {
    try {
        const products = await ProductModel.find();
        return products;
        log(products);
    } catch (error) {
        console.log('Lỗi', error);
    }
}

// tìm kiếm sản phẩm theo từ khóa
const searchProduct = async (key) => {
    try {
        const products = await ProductModel.find({
            $or: [
                { name: { $regex: key, $options: 'i' } },
                { description: { $regex: key, $options: 'i' } }
            ]
        })
        return products;
    } catch (error) {
        console.log('Search product error', error.message)
        throw new Error('Search product error')
    }
}




//lấy danh sách sản phẩm có giá trong khoảng min, max
// và có số lượng lớn hơn 0
const getProductByPrice = async (min, max) => {
    try {
        const products = await ProductModel.find({
            price: { $gte: min, $lte: max },
            quantity: { $gt: 0 }
        })
        return products;
    } catch (error) {
        console.log('Get product by price error', error.message)
        throw new Error('Get product by price error')
    }
}


// thêm mới sản phẩm
const addProduct = async (name, price, quantity, images, description, category) => {
    try {
        console.log('category: ', category)
        // lấy category theo id
        const categoryInDB = await CategoryModel.findById(category);
        if (!categoryInDB) {
            throw new Error('Category không tồn tại')
        }
        
        
        // tạo object category
        category = {
            category_id: categoryInDB._id,
            category_name: categoryInDB.name
        }

        // chưa bắt lỗi 
        const product = {
            name, price, quantity, images, description, category
        }
        const newProduct = new ProductModel(product);
        // lưu vào db
        const result = await newProduct.save();
        // setTimeout(() => {
        //     console.log('result: ', result);
        //     //thêm 1 sp vào danh sách poducts của category
        // }, 0);
        return result;
    } catch (error) {
        console.log('Add product error', error.message)
        throw new Error('Add product error')
    }
}

// cập nhật sản phẩm 
const updateProduct = async (id, name, price, quantity, images, description, category) => {
    try {
        // tìm sp theo id
        const productInDb = await ProductModel.findById(id);
        if (!productInDb) {
            throw new Error("Sản phẩm không tồn tại");
        }

        if(!category){
            throw new Error('Category không tồn tại')
        }
        // lấy category theo id
        const categoryInDB = await CategoryModel.findById(category['category_name']);
        if (!categoryInDB) {
            throw new Error('Category không tồn tại')
        }

        // tạo object category
        category = {
            category_id: categoryInDB._id,
            category_name: categoryInDB.name
        }

        // cập nhật sản phẩm 
        productInDb.name = name || productInDb.name;
        productInDb.price = price || productInDb.price;
        productInDb.quantity = quantity || productInDb.quantity;
        productInDb.images = images || productInDb.images
        productInDb.description = description || productInDb.description;
        productInDb.updateAt = Date.now();

        await productInDb.save();
        return true;
    } catch (error) {
        console.log('Update product error', error.message)
        throw new Error('Update product error',error.message)
    }
}


// xóa sp
const deleteProduct = async (id) => {
    try {
        // tìm sản phẩm theo id
        const productInDb = await ProductModel.findById(id);
        // delete  sản phẩm
        await ProductModel.deleteOne({ _id: id });
        return true;
    } catch (error) {
        console.log("delete product error", error.message)
        throw new Error('Server error! Can not delete product')
    }
}


// lấy chi tiết sản phẩm theo id
const getById = async (id) => {
    try {
        // tìm sản phẩm theo id
        const productInDb = await ProductModel.findOne({ _id: id });
        if (!productInDb) {
            throw new Error('Sản phẩm không tồn tại');
        }
        // trả ra sản phẩm 
        return productInDb;
    } catch (error) {
        console.log("Get detail of product error", error.message)
        throw new Error('Server error! Can not find product')
    }
}



module.exports = {
    getProducts,
    deleteProduct,
    getById,
    updateProduct,
    searchProduct,
    getProductByCategory,
    getProductByPrice,
    addProduct,
    getAllProducts
}

