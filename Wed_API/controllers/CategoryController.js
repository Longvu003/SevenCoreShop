const CategoryModel = require("../model/CategoryModel");

// lấy danh sách danh mục

const getCategoryList = async () => {
  try {
    const category = await CategoryModel.find(); // lấy tất cả danh mục trong db
    return category; //
  } catch (error) {
    console.log("Get category list error", error.message);
    throw new Error("Get category list error");
  }
};
const createCategory = async (name, description) => {
  try {
    const categoryInfo = {
      name,
      description,
    };
    const category = new CategoryModel(categoryInfo);
    await category.save();
    return category;
  } catch (error) {
    console.log("Create category error", error.message);
    throw new Error("Create category error");
  }
};

// Cập nhật danh mục
const updateCategory = async (id, name, description) => {
  try {
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id, // ID của danh mục cần cập nhật
      { name, description }, // Dữ liệu mới
      { new: true } // Trả về bản ghi mới sau khi cập nhật
    );
    if (!updatedCategory) {
      throw new Error("Category not found");
    }
    return updatedCategory;
  } catch (error) {
    console.log("Update category error", error.message);
    throw new Error("Update category error");
  }
};

// Xóa danh mục
const deleteCategory = async (id) => {
  try {
    const deletedCategory = await CategoryModel.findByIdAndDelete(id); // Xóa danh mục theo ID
    if (!deletedCategory) {
      throw new Error("Category not found");
    }
    return deletedCategory;
  } catch (error) {
    console.log("Delete category error", error.message);
    throw new Error("Delete category error");
  }
};

// Lấy danh mục theo ID
const getCategoryById = async (id) => {
  try {
    const category = await CategoryModel.findById(id); // Tìm danh mục theo ID
    if (!category) {
      throw new Error("Category not found"); // Nếu không tìm thấy, ném lỗi
    }
    return category;
  } catch (error) {
    console.log("Get category by ID error", error.message);
    throw new Error("Get category by ID error");
  }
};

module.exports = { 
  getCategoryList, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  getCategoryById // Export hàm mới
};

