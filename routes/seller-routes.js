const router = require("express").Router();

const sellerController = require("../controller/seller-controller");
// const checkAuth = require("../middleware/check-auth");

router.get("/", sellerController.getAllSeller);
router.get("/:phoneNo", sellerController.getSeller);
//Auth API
router.post("/auth", sellerController.auth);
//update Profile
router.put("/:phoneNo/updateProfile", sellerController.updateSellerProfile);
//Seller Purchased Details API
router.get("/:phoneNo/purchase", sellerController.getPurchase);
//All Orders API
router.get("/:phoneNo/orders", sellerController.getAllOrder);


module.exports = router;