// const mongoose = require("mongoose");
// const ProductModel = require("../model/ProductModel");
// const CategoryModel = require("../model/CategoryModel");

// // code của huy đổi lại bị trùng tên
// // // Lấy danh sách sản phẩm (có thể lọc theo danh mục)
// // const getProducts = async (category = "") => {
// //   try {
// //     let products;
// //     if (category) {
// //       products = await ProductModel.find({
// //         category: mongoose.Types.ObjectId(category),
// //       });
// //     } else {
// //       products = await ProductModel.find();
// //     }
// //     return products;
// //   } catch (error) {
// //     console.log("Lỗi", error);
// //     throw new Error("Error while getting products");
// //   }
// // };

// // lấy danh sách sản phẩm
// const getProducts = async (category = "") => {
//   try {
//     if (category) {
//       const products = await ProductModel.find({ category });
//       return products;
//     } else {
//       const products = await ProductModel.find();
//       return products;
//     }
//   } catch (error) {
//     console.log("Lỗi", error);
//   }
// };

// //lấy danh sách sản phẩm theo danh mục
// const getProductByCategory = async (category_id) => {
//   try {
//     const products = await ProductModel.find({
//       "category.category_id": category_id,
//     });
//     return products;
//   } catch (error) {
//     console.log("Get product by category error", error.message);
//     throw new Error("Get product by category error");
//   }
// };

// const getAllProducts = async () => {
//   try {
//     const products = await ProductModel.find();
//     return products;
//   } catch (error) {
//     console.log("Lỗi", error);
//     throw new Error("Error while getting all products");
//   }
// };

// // Tìm kiếm sản phẩm theo từ khóa
// const searchProduct = async (key) => {
//   try {
//     const products = await ProductModel.find({
//       $or: [
//         { name: { $regex: key, $options: "i" } },
//         { description: { $regex: key, $options: "i" } },
//       ],
//     });
//     return products;
//   } catch (error) {
//     console.log("Search product error", error.message);
//     throw new Error("Search product error");
//   }
// };

// // Lấy danh sách sản phẩm theo danh mục
// const getProductsByCategory = async (req, res) => {
//   try {
//     const category = req.params.id;
//     const products = await ProductModel.find({ category });
//     return res.status(200).json({
//       status: true,
//       message: "Products fetched successfully.",
//       data: products,
//     });
//   } catch (error) {
//     console.log("Error fetching products:", error);
//     return res.status(500).json({
//       status: false,
//       message: "Server error. Cannot fetch products.",
//     });
//   }
// };

// // Lấy danh sách sản phẩm theo khoảng giá và số lượng lớn hơn 0
// const getProductByPrice = async (min, max) => {
//   try {
//     const products = await ProductModel.find({
//       price: { $gte: min, $lte: max },
//       quantity: { $gt: 0 },
//     });
//     return products;
//   } catch (error) {
//     console.log("Get product by price error", error.message);
//     throw new Error("Get product by price error");
//   }
// };

// // Thêm mới sản phẩm
// const addProduct = async (
//   name,
//   price,
//   quantity,
//   images,
//   description,
//   category,
//   color,
//   size,
//   status,
//   inventory,
//   userEmail // Thêm tham số userEmail
// ) => {
//   try {
//     const categoryInDB = await CategoryModel.findById(
//       new mongoose.Types.ObjectId(category)
//     );
//     if (!categoryInDB) {
//       throw new Error("Category không tồn tại");
//     }

//     const product = new ProductModel({
//       name,
//       price,
//       quantity,
//       images,
//       description,
//       category: new mongoose.Types.ObjectId(category),
//       color,
//       size,
//       status,
//       inventory, // Lưu category dưới dạng ObjectId
//       userEmail, // Thêm userEmail vào product
//       viewedAt: new Date(), // Thêm viewedAt
//     });
//     const newProduct = new ProductModel(product);
//     // lưu vào db
//     const result = await newProduct.save();
//     // setTimeout(() => {
//     //     console.log('result: ', result);
//     //     //thêm 1 sp vào danh sách poducts của category
//     // }, 0);
//     return result;
//   } catch (error) {
//     console.log("Add product error", error.message);
//     throw new Error("Add product error");
//   }
// };

// // cập nhật sản phẩm
// const updateProduct = async (
//   _id,
//   name,
//   price,
//   quantity,
//   images,
//   description,
//   category
// ) => {
//   try {
//     const productInDb = await ProductModel.findById(
//       mongoose.Types.ObjectId(_id)
//     );
//     if (!productInDb) {
//       throw new Error("Sản phẩm không tồn tại");
//     }
//     const categoryInDB = await CategoryModel.findById(
//       mongoose.Types.ObjectId(category)
//     );
//     if (!categoryInDB) {
//       throw new Error("Category không tồn tại");
//     }
//     // tạo object category
//     category = {
//       category_id: categoryInDB._id,
//       category_name: categoryInDB.name,
//     };
//     // cập nhật sản phẩm
//     productInDb.name = name || productInDb.name;
//     productInDb.price = price || productInDb.price;
//     productInDb.quantity = quantity || productInDb.quantity;
//     productInDb.images = images || productInDb.images;
//     productInDb.description = description || productInDb.description;
//     productInDb.updateAt = Date.now();

//     await productInDb.save();
//     return true;
//   } catch (error) {
//     console.log("Update product error", error.message);
//     throw new Error("Update product error", error.message);
//   }
// };

// // Xóa sản phẩm
// const deleteProduct = async (id) => {
//   try {
//     const productInDb = await ProductModel.findById(
//       mongoose.Types.ObjectId(id)
//     );
//     if (!productInDb) {
//       throw new Error("Sản phẩm không tồn tại");
//     }
//     await ProductModel.deleteOne({ _id: mongoose.Types.ObjectId(id) });
//     return true;
//   } catch (error) {
//     console.log("Delete product error", error.message);
//     throw new Error("Server error! Can not delete product");
//   }
// };

// // Lấy chi tiết sản phẩm theo id
// const getById = async (id) => {
//   try {
//     // Sử dụng cú pháp `new mongoose.Types.ObjectId(id)`
//     const productInDb = await ProductModel.findById(
//       new mongoose.Types.ObjectId(id)
//     );
//     if (!productInDb) {
//       throw new Error("Sản phẩm không tồn tại");
//     }
//     return productInDb;
//   } catch (error) {
//     console.log("Get product by id error", error.message);
//     throw new Error("Server error! Can not find product");
//   }
// };

// const updateProductAvailability = async (id, available) => {
//   try {
//     // Find the product by ID
//     const product = await ProductModel.findById(id);
//     if (!product) {
//       throw new Error("Product not found");
//     }

//     // Update the availability status
//     product.available = available;

//     // Save the changes
//     await product.save();

//     // Return the updated product
//     return product;
//   } catch (error) {
//     console.log("Update product availability error", error.message);
//     throw new Error("Server error! Cannot update product availability");
//   }
// };

// // Thống kê sản phẩm có số lượng lớn nhất
// const getTopProduct = async () => {
//   try {
//     const products = await ProductModel.find({}, "name price quantity")
//       .sort({ quantity: -1 })
//       .limit(10);
//     return products;
//   } catch (error) {
//     console.log("Get top product error", error.message);
//     throw new Error("Get top product error");
//   }
// };

// module.exports = {
//   getProducts,
//   getAllProducts,
//   searchProduct,
//   getProductsByCategory,
//   getProductByPrice,
//   addProduct,
//   updateProduct,
//   deleteProduct,
//   getById,
//   getTopProduct,
//   updateProductAvailability,
// };

const ProductModel = require("../model/ProductModel");
const CategoryModel = require("../model/CategoryModel");

// lấy danh sách sản phẩm
const getProducts = async (category = "") => {
  try {
    if (category) {
      const products = await ProductModel.find({ category });
      return products;
    } else {
      const products = await ProductModel.find();
      return products;
    }
  } catch (error) {
    console.log("Lỗi", error);
  }
};

//lấy danh sách sản phẩm theo danh mục
const getProductByCategory = async (category_id) => {
  try {
    const products = await ProductModel.find({
      "category.category_id": category_id,
    });
    return products;
  } catch (error) {
    console.log("Get product by category error", error.message);
    throw new Error("Get product by category error");
  }
};

const getAllProducts = async () => {
  try {
    const products = await ProductModel.find();
    return products;
    log(products);
  } catch (error) {
    console.log("Lỗi", error);
  }
};

// tìm kiếm sản phẩm theo từ khóa
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

//lấy danh sách sản phẩm có giá trong khoảng min, max
// và có số lượng lớn hơn 0
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

// thêm mới sản phẩm
const addProduct = async (
  name,
  price,
  quantity,
  images,
  description,
  category
) => {
  try {
    // Check if a product with the same name already exists
    const existingProduct = await ProductModel.findOne({ name });
    if (existingProduct) {
      throw new Error("Product with the same name already exists");
    }

    // Get category by ID
    const categoryInDB = await CategoryModel.findById(category);
    if (!categoryInDB) {
      throw new Error("Category không tồn tại");
    }

    // Create category object
    const categoryObj = {
      category_id: category,
      category_name: categoryInDB.name,
    };

    // Create product object
    const product = {
      name,
      price,
      quantity,
      images,
      description,
      category: categoryObj,
    };
    const newProduct = new ProductModel(product);

    // Save to database
    const result = await newProduct.save();
    return result;
  } catch (error) {
    console.log("Add product error", error.message);
    throw new Error("Add product error");
  }
};

// cập nhật sản phẩm
const updateProduct = async (
  id,
  name,
  price,
  quantity,
  images,
  description,
  category
) => {
  try {
    // Find product by ID
    const productInDb = await ProductModel.findById(id);
    if (!productInDb) {
      throw new Error("Sản phẩm không tồn tại");
    }

    // Check if a product with the same name already exists
    const existingProduct = await ProductModel.findOne({ name });
    if (existingProduct && existingProduct._id.toString() !== id) {
      throw new Error("Product with the same name already exists");
    }

    // Get category by ID
    const categoryInDB = await CategoryModel.findById(category);
    if (!categoryInDB) {
      throw new Error("Category không tồn tại");
    }

    // Create category object
    const categoryObj = {
      category_id: categoryInDB._id,
      category_name: categoryInDB.name,
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
    console.log("Update product error", error.message);
    throw new Error("Update product error");
  }
};

// xóa sp
const deleteProduct = async (id) => {
  try {
    // tìm sản phẩm theo id
    const productInDb = await ProductModel.findById(id);
    // delete  sản phẩm
    await ProductModel.deleteOne({ _id: id });
    return true;
  } catch (error) {
    console.log("delete product error", error.message);
    throw new Error("Server error! Can not delete product");
  }
};

// lấy chi tiết sản phẩm theo id
const getById = async (id) => {
  try {
    // tìm sản phẩm theo id
    const productInDb = await ProductModel.findOne({ _id: id });
    if (!productInDb) {
      throw new Error("Sản phẩm không tồn tại");
    }
    // trả ra sản phẩm
    return productInDb;
  } catch (error) {
    console.log("Get detail of product error", error.message);
    throw new Error("Server error! Can not find product");
  }
};

const updateProductAvailability = async (id, available) => {
  try {
    // Find the product by ID
    const product = await ProductModel.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }

    // Update the availability status
    product.available = available;

    // Save the changes
    await product.save();

    // Return the updated product
    return product;
  } catch (error) {
    console.log("Update product availability error", error.message);
    throw new Error("Server error! Cannot update product availability");
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
  getAllProducts,
  updateProductAvailability,
};
