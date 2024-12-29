const { default: mongoose } = require("mongoose");
const AddressModel = require("../model/AddressModel");
const userModel = require("../model/UserModel");
const ObjectId = mongoose.Types.ObjectId;

const addAddress = async (
  userId,
  userNameAddress,
  phoneAddress,
  // nameAddress,
  province,
  district,
  ward,
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
      province,
      district,
      // nameAddress,
      ward,
      addressDetail,
      isDefault: user.address.length === 0 ? true : false,
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
  province,
  district,
  ward,
  // nameAddress,

  addressDetail,
  isDefault
) => {
  try {
    if (isDefault) {
      const user = await userModel.findOne({
        _id: userId,
      });
      if (!user) {
        console.log("Không tìm thấy người dùng");
        return null;
      }
      const defaultAddress = user.address.find(
        (addr) => addr.isDefault && addr._id.toString() !== addressId
      );

      if (defaultAddress) {
        throw new Error("Đã có địa chỉ mặc định khác tồn tại.");
      }
    }

    const item = await userModel.findById(userId);
    if (!item) {
      console.log("Không tìm thấy người dùng");
      return null;
    }
    const indexAddress = item.address.find(
      (item) => item._id.toString() === addressId
    );

    if (!indexAddress) {
      console.log("Không tìm thấy địa chỉ");
      return null;
    } else {
      // indexAddress.nameAddress = nameAddress;

      indexAddress.ward = ward;
      indexAddress.province = province;
      indexAddress.district = district;
      indexAddress.addressDetail = addressDetail;
      indexAddress.userNameAddress = userNameAddress;
      indexAddress.phoneAddress = phoneAddress;
      indexAddress.isDefault = isDefault;
      await item.save();
    }

    return indexAddress;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addAddress,
  getAddressById,
  deleteAddressById,
  updateAddressById,
};
