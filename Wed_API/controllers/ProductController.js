const mongoose = require("mongoose");
const ProductModel = require("../model/ProductModel");
const CategoryModel = require("../model/CategoryModel");

// Lấy danh sách sản phẩm (có thể lọc theo danh mục)
const getProducts = async (category = "") => {
  try {
    let products;
    if (category) {
      products = await ProductModel.find({
        category: mongoose.Types.ObjectId(category),
      });
    } else {
      products = await ProductModel.find();
    }
    return products;
  } catch (error) {
    console.log("Lỗi", error);
    throw new Error("Error while getting products");
  }
};

// Lấy tất cả sản phẩm
const getAllProducts = async () => {
  try {
    const products = await ProductModel.find();
    return products;
  } catch (error) {
    console.log("Lỗi", error);
    throw new Error("Error while getting all products");
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
    console.log("Search product error", error.message);
    throw new Error("Search product error");
  }
};

// // Lấy danh sách sản phẩm theo danh mục
// const getProductsByCategory = async (req, res) => {
//  try {
//   const category = req.query
//   const products = await ProductModel.find({ category });

//   return res.status(200).json({
//     status: true,
//     message: "Products fetched successfully.",
//     data: products
//   }); 
  
//  } catch (error) {
//   console.log("Error fetching products:", error);
//     return res.status(500).json({
//       status: false,
//       message: "Server error. Cannot fetch products."
//     });
//  }
// };

const getProductsByCategory = async (req, res) => {
  try {
      const { categoryId } = req.params;

      // Kiểm tra xem categoryId có phải là ObjectId hợp lệ không
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
          return res.status(400).json({ error: 'Invalid category ID' });
      }

      // Chạy truy vấn với categoryId, mongoose sẽ tự động chuyển nó thành ObjectId
      const products = await Product.find({ category: categoryId });

      if (!products || products.length === 0) {
          return res.status(404).json({ message: 'No products found for this category' });
      }

      return res.status(200).json(products);
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
  }
};



















// Lấy danh sách sản phẩm theo khoảng giá và số lượng lớn hơn 0
const getProductByPrice = async (min, max) => {
  try {
    const products = await ProductModel.find({
      price: { $gte: min, $lte: max },
      quantity: { $gt: 0 },
    });
    return products;
  } catch (error) {
    console.log("Get product by price error", error.message);
    throw new Error("Get product by price error");
  }
};

// Thêm mới sản phẩm
const addProduct = async (
  name,
  price,
  quantity,
  images,
  description,
  category,
  color,
  size,
  status,
  inventory,
  userEmail // Thêm tham số userEmail
) => {
  try {
    const categoryInDB = await CategoryModel.findById(
      new mongoose.Types.ObjectId(category)
    );
    if (!categoryInDB) {
      throw new Error("Category không tồn tại");
    }

    const product = new ProductModel({
      name,
      price,
      quantity,
      images,
      description,
      category: new mongoose.Types.ObjectId(category),
      color,
      size,
      status,
      inventory, // Lưu category dưới dạng ObjectId
      userEmail, // Thêm userEmail vào product
      viewedAt: new Date(), // Thêm viewedAt
    });

    const result = await product.save();
    return result;
  } catch (error) {
    console.log("Add product error", error.message);
    throw new Error("Add product error");
  }
};

// Cập nhật sản phẩm
const updateProduct = async (
  _id,
  name,
  price,
  quantity,
  images,
  description,
  category
) => {
  try {
    const productInDb = await ProductModel.findById(
      mongoose.Types.ObjectId(_id)
    );
    if (!productInDb) {
      throw new Error("Sản phẩm không tồn tại");
    }

    const categoryInDB = await CategoryModel.findById(
      mongoose.Types.ObjectId(category)
    );
    if (!categoryInDB) {
      throw new Error("Category không tồn tại");
    }

    productInDb.name = name || productInDb.name;
    productInDb.price = price || productInDb.price;
    productInDb.quantity = quantity || productInDb.quantity;
    productInDb.images = images || productInDb.images;
    productInDb.description = description || productInDb.description;
    productInDb.category = mongoose.Types.ObjectId(category); // Cập nhật lại category như ObjectId
    productInDb.updatedAt = Date.now();

    await productInDb.save();
    return productInDb;
  } catch (error) {
    console.log("Update product error", error.message);
    throw new Error("Update product error");
  }
};

// Xóa sản phẩm
const deleteProduct = async (id) => {
  try {
    const productInDb = await ProductModel.findById(
      mongoose.Types.ObjectId(id)
    );
    if (!productInDb) {
      throw new Error("Sản phẩm không tồn tại");
    }

    await ProductModel.deleteOne({ _id: mongoose.Types.ObjectId(id) });
    return true;
  } catch (error) {
    console.log("Delete product error", error.message);
    throw new Error("Server error! Can not delete product");
  }
};

// Lấy chi tiết sản phẩm theo id
const getById = async (id) => {
  try {
    // Sử dụng cú pháp `new mongoose.Types.ObjectId(id)`
    const productInDb = await ProductModel.findById(
      new mongoose.Types.ObjectId(id)
    );
    if (!productInDb) {
      throw new Error("Sản phẩm không tồn tại");
    }
    return productInDb;
  } catch (error) {
    console.log("Get product by id error", error.message);
    throw new Error("Server error! Can not find product");
  }
};

// Thống kê sản phẩm có số lượng lớn nhất
const getTopProduct = async () => {
  try {
    const products = await ProductModel.find({}, "name price quantity")
      .sort({ quantity: -1 })
      .limit(10);
    return products;
  } catch (error) {
    console.log("Get top product error", error.message);
    throw new Error("Get top product error");
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
  getTopProduct,
};
