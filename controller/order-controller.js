


// const Seller = require("../models/seller");
const Order = require("../models/order");

const updateOrderStatus = async (req, res) => {
    const orderId = req.params.orderId;
    const productId = req.params.productId;
    const newStatus = req.body.status;
    try {
      const order = await Order.findOneAndUpdate(
        { _id: orderId, "products.product": productId },
        { $set: { "products.$.status": newStatus } },
        { new: true }
      );
  
      if (!order) {
        return res.status(404).json({ message: "Order or Product not found" });
      }
  
      res.status(200).json({ order });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  };
  
  

exports.updateOrderStatus = updateOrderStatus;
// exports.login = login;
