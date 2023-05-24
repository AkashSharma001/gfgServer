const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name:{
    type: String,
  },
  phoneNo: {
    type: String,
    required: true,
  },
  cart: [
    {
      product: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Product",
      },
      quantity: { type: String, required: true },
    },
  ],
  purchased: [
    {
      product: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Product",
      },
      quantity: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
