const CategoryModel = require("./CategoryModel");

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

module.exports = { getCategoryList, createCategory };
