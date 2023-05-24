const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  productType: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  productImageUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  productPacked: {
    type: String,
    required: true,
  },
  productExpire: {
    type: String,
    required: true,
  },
  productPrice: {
    type: String,
    required: true,
  },
  web3Id: {
    type: String ,
    required: true,
  },
  contractAddress: {
    type: String ,
    required: true,
  },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "Seller" },
  productPurchased: [
    {
      buyer: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
      },
      quantity: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Product", productSchema);
