const { default: mongoose } = require("mongoose");
const AddressModel = require("../model/AddressModel");
const addAddress = async (userId, nameAddress, address, isDefault) => {
  const item = new AddressModel({ userId, nameAddress, address, isDefault });
  await item.save();
  return item;
};
const getAddressById = async (userId) => {
  const item = await AddressModel.find({ userId });
  return item;
};

const deleteAddressById = async (userId, id) => {
  const item = await AddressModel.deleteOne({ userId, id });
  return item;
};

const updateAddressById = async (userId, id, nameAddress, address) => {
  try {
    const ObjectIdId = id;
    const item = await AddressModel.findOne({
      userId,
      _id: ObjectIdId,
    });
    if (item) {
      item.nameAddress = nameAddress;
      item.address = address;
      await item.save();
      return item;
    } else {
      console.log("Có lỗi khi update");
      return null;
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addAddress,
  getAddressById,
  deleteAddressById,
  updateAddressById,
};
