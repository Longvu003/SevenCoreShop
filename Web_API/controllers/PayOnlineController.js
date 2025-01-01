const PayOnlineModel = require("../model/PayOnlineModel");

// Get all pay online entries
const getPayOnlineList = async () => {
  try {
    const payOnlineList = await PayOnlineModel.find();
    return payOnlineList;
  } catch (error) {
    console.log("Get pay online list error", error.message);
    throw new Error("Get pay online list error");
  }
};

// Create a new pay online entry
const createPayOnline = async (bank, acc_holder, acc_number, images) => {
  try {
    const payOnline = new PayOnlineModel({
      bank,
      acc_holder,
      acc_number,
      images,
    });
    await payOnline.save();
    return payOnline;
  } catch (error) {
    console.log("Create pay online error", error.message);
    throw new Error("Create pay online error");
  }
};

// Update a pay online entry
const updatePayOnline = async (id, bank, acc_holder, acc_number, images) => {
  try {
    const payOnline = await PayOnlineModel.findById(id);
    if (!payOnline) {
      throw new Error("Pay online entry not found");
    }
    payOnline.bank = bank || payOnline.bank;
    payOnline.acc_holder = acc_holder || payOnline.acc_holder;
    payOnline.acc_number = acc_number || payOnline.acc_number;
    payOnline.images = images || payOnline.images;
    await payOnline.save();
    return payOnline;
  } catch (error) {
    console.log("Update pay online error", error.message);
    throw new Error("Update pay online error");
  }
};

// Delete a pay online entry
const deletePayOnline = async (id) => {
  try {
    const payOnline = await PayOnlineModel.findByIdAndDelete(id);
    if (!payOnline) {
      throw new Error("Pay online entry not found");
    }
    return payOnline;
  } catch (error) {
    console.log("Delete pay online error", error.message);
    throw new Error("Delete pay online error");
  }
};

// Get pay online entry by ID
const getPayOnlineById = async (id) => {
  try {
    const payOnline = await PayOnlineModel.findById(id);

    return payOnline;
  } catch (error) {
    console.log("Get pay online by id error", error.message);
    throw new Error("Get pay online by id error");
  }
};

module.exports = {
  getPayOnlineList,
  createPayOnline,
  updatePayOnline,
  deletePayOnline,
  getPayOnlineById,
};
