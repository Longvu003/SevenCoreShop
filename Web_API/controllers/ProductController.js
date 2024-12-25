const ProductModel = require("../model/ProductModel");
const CategoryModel = require("../model/CategoryModel");

// Lấy danh sách sản phẩm
// const getProducts = async (category = '') => {
//     try {
//         const products = category ?
//             await ProductModel.find({ category }) :
//             await ProductModel.find();
//         return products;
//     } catch (error) {
//         console.log('Lỗi khi lấy sản phẩm:', error.message);
//         throw new Error('Không thể lấy danh sách sản phẩm');
//     }
// };

// Lấy danh sách sản phẩm theo danh mục
// lấy danh sách sản phẩm
const getProducts = async (categoryId = "") => {
  try {
    let query = {};

    if (categoryId) {
      // Truy vấn theo nested field category.category_id
      query["category.category_id"] = categoryId;
    }
    const products = await ProductModel.find(query);

    return products;
  } catch (error) {
    console.log("Lỗi", error);
    throw error;
  }
};

// Tìm kiếm sản phẩm theo từ khóa
const searchProduct = async (key) => {
  try {
    const products = await ProductModel.find({
      $or: [
        { name: { $regex: key, $options: "i" } },
        { description: { $regex: key, $options: "i" } },
      ],
    });
    return products;
  } catch (error) {
    console.log("Lỗi khi tìm kiếm sản phẩm:", error.message);
    throw new Error("Không thể tìm kiếm sản phẩm");
  }
};

// Lấy sản phẩm theo giá và số lượng
const getProductByPrice = async (min, max) => {
  try {
    const products = await ProductModel.find({
      price: { $gte: min, $lte: max },
      quantity: { $gt: 0 },
    });
    return products;
  } catch (error) {
    console.log("Lỗi khi lấy sản phẩm theo giá:", error.message);
    throw new Error("Không thể lấy sản phẩm theo giá");
  }
};

// thêm mới sản phẩm
const addProduct = async (name, price, quantity, images, description, category) => {
  try {
      // Check if a product with the same name already exists
      const existingProduct = await ProductModel.findOne({ name });
      if (existingProduct) {
          throw new Error('Product with the same name already exists');
      }

      // Get category by ID
      const categoryInDB = await CategoryModel.findById(category);
      if (!categoryInDB) {
          throw new Error('Category không tồn tại');
      }

      // Create category object
      const categoryObj = {
          category_id: category,
          category_name: categoryInDB.name
      };

      // Create product object
      const product = {
          name, price, quantity, images, description, category: categoryObj
      };
      const newProduct = new ProductModel(product);

      // Save to database
      const result = await newProduct.save();
      return result;
  } catch (error) {
      console.log('Add product error', error.message);
      throw new Error('Add product error');
  }
};

// cập nhật sản phẩm 
const updateProduct = async (id, name, price, quantity, images, description, category) => {
  try {
      // Find product by ID
      const productInDb = await ProductModel.findById(id);
      if (!productInDb) {
          throw new Error("Sản phẩm không tồn tại");
      }

      // Check if a product with the same name already exists
      const existingProduct = await ProductModel.findOne({ name });
      if (existingProduct && existingProduct._id.toString() !== id) {
          throw new Error('Product with the same name already exists');
      }

      // Get category by ID
      const categoryInDB = await CategoryModel.findById(category);
      if (!categoryInDB) {
          throw new Error('Category không tồn tại');
      }

      // Create category object
      const categoryObj = {
          category_id: categoryInDB._id,
          category_name: categoryInDB.name
      };

      // Update product fields
      productInDb.name = name || productInDb.name;
      productInDb.price = price || productInDb.price;
      productInDb.quantity = quantity || productInDb.quantity;
      productInDb.images = images || productInDb.images;
      productInDb.description = description || productInDb.description;
      productInDb.category = categoryObj;
      productInDb.updateAt = Date.now();

      // Save updated product to database
      await productInDb.save();
      return true;
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
      throw new Error("Sản phẩm không tồn tại");
    }

    await ProductModel.deleteOne({ _id: id });
    return true;
  } catch (error) {
    console.log("Lỗi khi xóa sản phẩm:", error.message);
    throw new Error("Không thể xóa sản phẩm");
  }
};

// Lấy chi tiết sản phẩm theo ID
const getById = async (id) => {
  try {
    const productInDb = await ProductModel.findById(id);
    if (!productInDb) {
      throw new Error("Sản phẩm không tồn tại");
    }
    return productInDb;
  } catch (error) {
    console.log("Lỗi khi lấy chi tiết sản phẩm:", error.message);
    throw new Error("Không thể lấy chi tiết sản phẩm");
  }
};

const updateProductAvailability = async (id, available) => {
  try {
      // Find the product by ID
      const product = await ProductModel.findById(id);
      if (!product) {
          throw new Error('Product not found');
      }

      // Update the availability status
      product.available = available;

      // Save the changes
      await product.save();

      // Return the updated product
      return product;
  } catch (error) {
      console.log("Update product availability error", error.message);
      throw new Error('Server error! Cannot update product availability');
  }
};

module.exports = {
  getProducts,
  deleteProduct,
  getById,
  updateProduct,
  searchProduct,
  //   getProductByCategory,
  getProductByPrice,
  addProduct,
  updateProductAvailability
};
