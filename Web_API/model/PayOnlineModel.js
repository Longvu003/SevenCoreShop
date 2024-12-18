const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const PayOnlineSchema = new Schema({
  bank: { type: String, required: true },
  acc_holder: { type: String, default: "" },
  acc_number: { type: String, default: "" },
  images: { type: Array, default: [] },
});
module.exports =
  mongoose.model.category || mongoose.model("PayOnline", PayOnlineSchema);
