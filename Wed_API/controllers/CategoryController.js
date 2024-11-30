const CategoryModel = require("../model/CategoryModel");
const ProductModel = require("../model/ProductModel"); // Add this line to import the ProductModel
const mongoose = require("mongoose");

const deleteCategory = async (id) => {
  try {
    // // Kiểm tra xem có sản phẩm nào liên kết với danh mục này không
    const products = await ProductModel.find({ "category.category_id": id });

    // Nếu có sản phẩm liên kết, không cho phép xóa
    if (products.length > 0) {
      throw new Error("Cannot delete category with associated products");
    }

    // Xóa danh mục nếu không có sản phẩm liên kết
    const category = await CategoryModel.findByIdAndDelete(id);

    // Nếu không tìm thấy danh mục để xóa
    if (!category) {
      throw new Error("Category not found");
    }

    return category; // Thông báo thành công
  } catch (error) {
    console.log("Delete category error:", error.message);
    throw new Error(error.message); // Trả về lỗi chi tiết
  }
};

const getCategoryList = async () => {
  try {
    const category = await CategoryModel.find(); // lấy tất cả danh mục trong db
    return category; //
  } catch (error) {
    console.log("Get category list error", error.message);
    throw new Error("Get category list error");
  }
};
const createCategory = async (name, description, images) => {
  try {
    const categoryInfo = {
      name,
      description,
      images,
    };
    const category = new CategoryModel(categoryInfo);
    await category.save();
    return category;
  } catch (error) {
    console.log("Create category error", error.message);
    throw new Error("Create category error");
  }
};

// update category
const updateCategory = async (id, name, description, images) => {
  try {
    const category = await CategoryModel.findById(id);
    if (!category) {
      throw new Error("Category không tồn tại");
    }
    category.name = name || category.name;
    category.description = description || category.description;
    category.images = images || category.images;
    await category.save();
    return category;
  } catch (error) {
    console.log("Update category error", error.message);
    throw new Error("Update category error");
  }
};

// get category by id
const getCategoryById = async (id) => {
  try {
    const category = await CategoryModel.findById(id);
    return category;
  } catch (error) {
    console.log("Get category by id error", error.message);
    throw new Error("Get category by id error");
  }
};
// check duplicate category
const checkDuplicateCategory = async (name) => {
  try {
    const category = await CategoryModel.findOne({ name });
    return category !== null;
  } catch (error) {
    console.log("Check duplicate category error", error.message);
    throw new Error("Check duplicate category error");
  }
};

module.exports = {
  getCategoryList,
  createCategory,
  deleteCategory,
  updateCategory,
  getCategoryById,
  checkDuplicateCategory,
};
