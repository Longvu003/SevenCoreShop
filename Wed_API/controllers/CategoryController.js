 
 const CategoryModel = require('./CategoryModel');

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

 module.exports = {getCategoryList} 