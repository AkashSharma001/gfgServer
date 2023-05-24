const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  products: [
    {
      product: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Product",
      },
      quantity: { type: String, required: true },
      status: { type: String, required: true },
      sellerId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Seller",
      },
    },
  ],
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Seller",
  },
  userAddress: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userPhoneNo: {
    type: String,
    required: true,
  },
  contractAddress: {
    type: String,
    required: true,
  },
  web3Id: {
    type: String,
    required: true,
  },
  paymentAmount: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
