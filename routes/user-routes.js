const router = require("express").Router();

const usersController = require("../controller/user-controller");
// const checkAuth = require("../middleware/check-auth");

router.get("/", usersController.getAllUser);
router.get("/:phoneNo", usersController.getUser);
//update Profile
router.put("/:phoneNo/updateProfile", usersController.updateUserProfile);
//Auth API
router.post("/auth", usersController.auth);
//Order Details API
router.get("/:phoneNo/orders", usersController.getAllOrder);


module.exports = router;