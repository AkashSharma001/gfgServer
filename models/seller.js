const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sellerSchema = new Schema({
  sellerPhoneNo: {
    type: String,
    required: true,
  },
  sellerName: {
    type: String,
  },
  products: [{ type: mongoose.Types.ObjectId, required: true, ref: "Product" }],
});

module.exports = mongoose.model("Seller", sellerSchema);
