const AddressModel = require("../model/AddressModel");
const addAddress = async (userId, nameAddress, address, isDefault) => {
  const item = new AddressModel({ userId, nameAddress, address, isDefault });
  await item.save();
  return item;
};
module.exports = { addAddress };
