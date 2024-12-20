const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AddressSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  nameAddress: {
    type: String,
    require: true,
  },
  address: { type: String, require: true },
  isDefault: { type: String, default: false },
});

module.exports = mongoose.model("Address", AddressSchema);
