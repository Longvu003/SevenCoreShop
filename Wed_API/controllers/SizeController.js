const SizeModel = require('../models/SizeModel');

const getSizeList = async () => {
    try {
        const size = await SizeModel.find()
        return size;
    } catch (error) {
        console.log('Get size list error', error.message)
        throw new Error('Get size list error')
    }
}
const createSize = async (name) => {
    try {
        const sizeInfo = {
            name
        }
        const size = new SizeModel(sizeInfo)
        await size.save()
        return size
    } catch (error) {
        console.log('Create size error', error.message)
        throw new Error('Create size error')
    }
}
const deleteSize = async (id) => {
    try {
        const size = await SizeModel.findByIdAndDelete(id)
        return size
    } catch (error) {
        console.log('Delete size error', error.message)
        throw new Error('Delete size error')
    }
}
const updateSize = async (id, name) => {
    try {
        const size = await SizeModel.findById(id)
        if (!size) {
            throw new Error('Size không tồn tại')
        }
        size.name = name
        await size.save()
        return size
    }
    catch (error) {
        console.log('Update size error', error.message)
        throw new Error('Update size error')
    }
}
const getSizeById = async (id) => {
    try {
        const size = await SizeModel.findById(id)
        return size
    }
    catch (error) {
        console.log('Get size by id error', error.message)
        throw new Error('Get size by id error')
    }
}
module.exports = { getSizeList, createSize, deleteSize, updateSize, getSizeById }