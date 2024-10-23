 
 const CategoryModel = require('../model/CategoryModel');

 // lấy danh sách danh mục

 const getCategoryList = async () => {
    try {
        const category = await CategoryModel.find()// lấy tất cả danh mục trong db
        return category;//
    } catch (error) {
        console.log('Get category list error', error.message)
        throw new Error('Get category list error')
    }
 }
 const createCategory = async (name,description) => {
    try {

        const categoryInfo = {
            name,description
        }
        const category = new CategoryModel(categoryInfo)
        await category.save()
        return category
    } catch (error) {
        console.log('Create category error', error.message)
        throw new Error('Create category error')
    }
 } 
 
 // delete category
    const eleteCategory = async (id) => {
        try {
            const category = await CategoryModel.findByIdAndDelete(id)
            return category
        } catch (error) {
            console.log('Delete category error', error.message)
            throw new Error('Delete category error')
        }
    }
// update category
    const updateCategory = async (id, name, description) => {
        try {
            const category = await CategoryModel.findById(id)
            if (!category) {
                throw new Error('Category không tồn tại')
            }
            category.name = name
            category.description = description
            await category.save()
            return category
        } catch (error) {
            console.log('Update category error', error.message)
            throw new Error('Update category error')
        }
    }

    // get category by id
    const getCategoryById = async (id) => {
        try {
            const category = await CategoryModel.findById(id)
            return category
        } catch (error) {
            console.log('Get category by id error', error.message)
            throw new Error('Get category by id error')
        }
    }
    module.exports = {getCategoryList,createCategory,deleteCategory,updateCategory, getCategoryById}

