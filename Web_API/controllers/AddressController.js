const { default: mongoose } = require("mongoose");
const userModel = require("../model/UserModel");

const addAddress = async (
  userId,
  userNameAddress,
  phoneAddress,
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
    } else if (user.address.length === 0) {
      isDefault = true;
    }
    user.address.push({
      userNameAddress,
      phoneAddress,
      province,
      district,
      ward,
      addressDetail,
      isDefault,
    });
    await user.save();
    console.log(user.address)
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
  addressDetail,
  isDefault
) => {
  try {
    const item = await userModel.findById(userId);
    if (!item) {
      return null;
    }
    const indexAddress = item.address.find(
      (item) => item._id.toString() === addressId
    );

    if (!indexAddress) {
      throw new Error("Không tìm thấy địa chỉ.");
    } else {
      if (isDefault) {
        item.address.forEach((addr) => {
          if (addr.isDefault) {
            addr.isDefault = false;
          }
        });
      }
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
    return { success: false, message: error.message };
  }
};

module.exports = {
  addAddress,
  getAddressById,
  deleteAddressById,
  updateAddressById,
};
