const router = require("express").Router();

const productController = require("../controller/product-controller");
const { upload } = require("../middleware/fileUpload");

//Get All Product   API
router.get("/", productController.getAllProducts);

//Get All Product added by a seller API
router.get("/:phoneNo", productController.getProducts);

//Create Product API
router.post("/:phoneNo/createProduct", upload.single("productImageUrl"),productController.addProduct);

//Update Product API
// router.put("/:phoneNo/:productId", productController.updateProduct);

//GET Buy Product API
router.get("/:phoneNo/buyProduct", productController.getBuyProduct);
//Buy Product API
router.put("/:phoneNo/buyProduct", productController.buyProduct);

//Cart Product API
router.put("/:phoneNo/:productId/cart", productController.cartProduct);

//User Cart Product API
router.get("/:phoneNo/cart", productController.getAllCartProduct);


//Save Product API
//outer.put("/:userId/:ProductName", ProductsController.saveProduct);

//Access Version Control Api
// router.get("/:userId/:ProductName/:versionId", ProductsController.getVersion);

// router.use(checkAuth);


//Get Single Product  API
router.get("/:phoneNo/:productId", productController.getSingleProduct);



//Update User API
// router.get("/:userId/:ProductName/:version", usersController.updateUser);

module.exports = router;
