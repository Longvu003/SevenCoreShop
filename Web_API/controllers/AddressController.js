const { default: mongoose } = require("mongoose");
const AddressModel = require("../model/AddressModel");
const userModel = require("../model/UserModel");
const addAddress = async (
  userId,

  userNameAddress,
  phoneAddress,
  nameAddress,
  addressDetail,
  isDefault
) => {
  try {
    const user = await userModel.findById(userId);

    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }
    if (isDefault) {
      user.address.forEach((item) => (item.isDefault = false));
    }
    user.address.push({
      userNameAddress,
      phoneAddress,
      nameAddress,
      addressDetail,
      isDefault,
    });

    await user.save();
    return user;
  } catch (error) {
    console.error("Error adding address:", error.message);
  }
};

const getAddressById = async (userId, addressId) => {
  const user = await userModel.findOne({ _id: userId });

  if (!user) {
    return null;
  }

  const address = user.address.find(
    (item) => item._id.toString() === addressId
  );

  if (!address) {
    return null;
  }

  return address;
};
const deleteAddressById = async (userId, id) => {
  const user = await userModel.findById(userId);

  if (!user) {
    console.log("Không tìm thấy tài liệu phù hợp để xóa");
    return null;
  }
  const indexAddress = user.address.findIndex(
    (item) => item._id.toString() === id
  );
  if (indexAddress === -1) {
    console.log("Không tìm thấy địa chỉ");
    return false;
  }
  user.address.splice(indexAddress, 1);
  await user.save();

  return user;
};

const updateAddressById = async (
  userId,
  userNameAddress,
  phoneAddress,
  addressId,
  nameAddress,
  addressDetail,
  isDefault
) => {
  try {
    const item = await userModel.findById(userId);
    if (!item) {
      console.log("Không tìm thấy user");
      return null;
    }

    const indexAddress = item.address.find(
      (item) => item._id.toString() === addressId
    );

    if (!indexAddress) {
      console.log("Không tìm thấy địa chỉ");
      return null;
    } else {
      indexAddress.nameAddress = nameAddress;
      indexAddress.addressDetail = addressDetail;
      indexAddress.userNameAddress = userNameAddress;
      indexAddress.phoneAddress = phoneAddress;
      indexAddress.isDefault = isDefault;
      await item.save();
    }

    return indexAddress;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = {
  addAddress,
  getAddressById,
  deleteAddressById,
  updateAddressById,
};
