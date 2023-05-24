const router = require("express").Router();

const orderController = require("../controller/order-controller");

//Update Order Status Api
router.put("/:orderId/:productId/updateStatus", orderController.updateOrderStatus);

module.exports = router;
