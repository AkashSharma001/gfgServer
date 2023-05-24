// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Product = require("../models/product");
const Seller = require("../models/seller");
const { fileUpload, upload, fileDelete } = require("../middleware/fileUpload");
const Order = require("../models/order");

//Product Images RELATED API

//Add Product
const addProduct = async (req, res) => {
  console.log(req.body);
  try {
    const sellerNoExist = await Seller.findOne({
      sellerPhoneNo: req.params.phoneNo,
    });
    if (!sellerNoExist) {
      res.status(404).json({ message: "Seller Not Found" });
      return;
    }

    try {
      req.file.path = await fileUpload(req, res);
    } catch (error) {
      res.status(400).json({ message: error });
      return;
    }

    const product = new Product({
      productType: req.body.productType,
      productName: req.body.productName,
      description: req.body.description,
      productPacked: req.body.productPacked,
      productExpire: req.body.productExpire,
      productPrice: req.body.productPrice,
      web3Id: req.body.web3Id,
      contractAddress: req.body.contractAddress,
      creator: sellerNoExist._id,
      productImageUrl: req.file.path,
    });

    await product.save();
    sellerNoExist.products.push(product);

    await sellerNoExist.save();

    res.status(200).json("Product Successfully Created");
  } catch (err) {
    await fileDelete(req.file.path);
    res.status(500).json({ message: err });
  }
};

//Get Seller Added Product
const getProducts = async (req, res) => {
  let sellerWithProducts;

  try {
    // const results = await Product.findById();
    sellerWithProducts = await Seller.findOne({
      sellerPhoneNo: req.params.phoneNo,
    }).populate("products");
    res.status(200).json({
      product: sellerWithProducts.products,
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const getSingleProduct = async (req, res) => {
  let sellerWithProducts;

  try {
    sellerWithProducts = await Product.findOne({
      _id: req.params.productId,
    })
    console.log(
      sellerWithProducts.products.find(
        (product) => product._id == req.params.productId
      )
    );
    res.status(200).json({
      product: sellerWithProducts
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const updateProduct = async (req, res) => {
  let product;
  product = await Product.findById(req.params.productId);
  if (!product) {
    res.status(400).json({ message: "Product Not Found" });
    return;
  }
  if (product.creator.toString() !== req.params.userId) {
    res.status(401).json({ message: "You are not allowed to edit" });
    return;
  }

  product, (productType = req.body.productType);
  product.productName = req.body.productName;
  product.description = req.body.description;
  product.productPacked = req.body.productPacked;
  product.productExpire = req.body.productExpire;
  product.productPrice = req.body.productPrice;

  try {
    await product.save();
  } catch (err) {
    res.status(500).json({ message: err });
    return;
  }

  res.status(200).json({ product: product });
};

const buyProduct = async (req, res) => {
  try {
    const user = await User.findOne({
      phoneNo: req.params.phoneNo,
    }).populate("cart.product");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    // console.log(user);

    const orderProducts = user.cart
      .filter((cartItem) => cartItem.quantity > 0)
      .map((cartItem) => ({
        product: cartItem.product._id,
        quantity: cartItem.quantity,
        status: "process",
        sellerId: cartItem.product.creator,
      }));

    const purchasedOrderProducts = {
      products: orderProducts,
      userId: user._id,
      userAddress: req.body.userAddress,
      userName: req.body.userName,
      userPhoneNo: req.body.userPhoneNo,
      contractAddress: req.body.contractAddress,
      web3Id: req.body.web3Id,
      paymentAmount: req.body.paymentAmount,
      date: new Date(),
    };
    const orders = await Order.create(purchasedOrderProducts);

    const purchasedProducts = user.cart.map((cartItem) => ({
      product: cartItem.product._id,
      quantity: cartItem.quantity,
    }));

    const productIds = purchasedProducts.map((product) => product.product);
    const products = await Product.find({ _id: { $in: productIds } });

    products.forEach((product) => {
      const purchasedProduct = purchasedProducts.find(
        (purchasedProduct) =>
          purchasedProduct.product.toString() === product._id.toString()
      );

      if (purchasedProduct) {
        product.productPurchased.push({
          buyer: user._id,
          quantity: purchasedProduct.quantity,
        });
      }
    });
    user.purchased.push(...purchasedProducts);

    user.cart = [];
    await Promise.all([
      user.save(),
      ...products.map((product) => product.save()),
    ]);

    await user.save();

    res.status(200).json({ message: "Purchase successful" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
};

const cartProduct = async (req, res) => {
  let product;
  product = await Product.findById(req.params.productId);
  const userExist = await User.findOne({ phoneNo: req.params.phoneNo });

  if (!product) {
    res.status(400).json({ message: "Product Not Found" });
    return;
  }
  if (!userExist) {
    res.status(400).json({ message: "User Not Found" });
    return;
  }

  try {
    const index = userExist.cart.findIndex(
      (item) => item.product.toString() === req.params.productId
    );
    console.log(index);
    if (index >= 0) {
      // If the product is already in the cart, update the quantity
      userExist.cart[index].quantity = req.body.quantity;
    } else {
      // If the product is not in the cart, add the product and quantity
      userExist.cart.push({
        product: product._id,
        quantity: req.body.quantity,
      });
    }

    // Save the updated user object
    await userExist.save();

    res.status(200).json({
      message: "Product added to cart successfully",
      cart: userExist.cart,
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

//Get Seller Added Product
const getAllProducts = async (req, res) => {
  let allProducts;

  try {
    // const results = await Product.findById();
    allProducts = await Product.find();
    res.status(200).json({
      product: allProducts,
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const getAllCartProduct = async (req, res) => {
  const userExist = await User.findOne({
    phoneNo: req.params.phoneNo,
  }).populate("cart.product");
  if (!userExist) {
    res.status(400).json({ message: "User Not Found" });
    return;
  }
  try {
    if (userExist.cart.length === 0) {
      res.status(404).json({ message: "Cart is empty" });
    } else {
      const productsInCart = userExist.cart
        .map((item) => {
          const product = item.product;

          if (product && item.quantity > 0) {
            return {
              _id: product.id,
              productType: product.productType,
              productName: product.productName,
              productExpire: product.productExpire,
              productImageUrl: product.productImageUrl,
              price: product.productPrice,
              quantity: item.quantity,
              web3Id: product.web3Id,
              contractAddress: product.contractAddress,
            };
          }
        })
        .filter(Boolean);

      res.status(200).json(productsInCart);
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "User's cart is empty" });
  }
};
const getBuyProduct = async (req, res) => {
  const userExist = await User.findOne({
    phoneNo: req.params.phoneNo,
  }).populate("purchased.product");

  if (!userExist) {
    res.status(400).json({ message: "User Not Found" });
    return;
  }
  try {
    if (userExist.purchased.length === 0) {
      res.status(404).json({ message: "Purchased is empty" });
    } else {
      const purchasedProducts = userExist.purchased.map((item) => ({
        _id: item.product._id,
        productType: item.product.productType,
        productName: item.product.productName,
        productExpire: item.product.productExpire,
        productImageUrl: item.product.productImageUrl,
        price: item.product.productPrice,
        quantity: item.quantity,
        web3Id: item.product.web3Id,
        contractAddress: item.product.contractAddress,
      }));
      res.status(200).json(purchasedProducts);
    }
  } catch (err) {
    res.status(404).json({ message: "User's cart is empty" });
  }
};

exports.addProduct = addProduct;
exports.getProducts = getProducts;
exports.getSingleProduct = getSingleProduct;
exports.getAllProducts = getAllProducts;
exports.updateProduct = updateProduct;
exports.buyProduct = buyProduct;
exports.getBuyProduct = getBuyProduct;
exports.cartProduct = cartProduct;
exports.getAllCartProduct = getAllCartProduct;
