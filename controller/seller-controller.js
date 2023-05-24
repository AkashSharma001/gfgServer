
const Joi = require("joi");

const Seller = require("../models/seller");
const Product = require("../models/product");
const Order = require("../models/order");

const registerSchema = Joi.object({
  sellerPhoneNo: Joi.string()
    .regex(/^\d{10}$/)
    .required(),
});
const loginSchema = Joi.object({
  sellerPhoneNo: Joi.string()
    .regex(/^\d{10}$/)
    .required(),
});

//SignUp User
const auth = async (req, res) => {
  //CHECK IF Phone No ALREADY EXISTS
  console.log(req.body);
  const sellerPhoneNoExist = await Seller.findOne({
    sellerPhoneNo: req.body.sellerPhoneNo,
  });
  if (sellerPhoneNoExist) {
    // res.status(400).json({ message: "Phone No Already Exists" });

    try {
      const { error } = await loginSchema.validateAsync(req.body);
      if (error) {
        res.status(400).json({ message: error });
        return;
      } else {
        const seller = await Seller.findOne({
          sellerPhoneNo: req.body.sellerPhoneNo,
        });
        console.log("seller login");
        res.status(200).json({
          message: seller,
        });

        return;
      }
    } catch (err) {
      res.status(500).json({ message: err });

      return;
    }
  }

  const seller = new Seller({
    sellerPhoneNo: req.body.sellerPhoneNo,
    products: [],
  });

  try {
    //VALIDATION OF USER INPUTS
    const { error } = await registerSchema.validateAsync(req.body);

    if (error) {
      res.status(500).json({ message: error });
    } else {
      //THE USER IS ADDED
      await seller.save();
      console.log("seller Created");
      res.status(200).json({
        message: seller,
      });
    }
  } catch (err) {
    console.log("58");
    res.status(500).json({ message: err });
  }
};

const getAllSeller = async (req, res) => {
  let allSeller;

  try {
    // const results = await Product.findById();
    allSeller = await Seller.find();
    res.status(200).json({
      Seller: allSeller,
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const getSeller = async (req, res) => {
  try {
    const seller = await Seller.findOne({ sellerPhoneNo: req.params.phoneNo });

    res.status(200).json({
      Seller: seller,
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};


const updateSellerProfile = async (req, res) => {

  try {
    const seller = await Seller.findOneAndUpdate({ sellerPhoneNo: req.params.phoneNo },{
      ...req.body
    });
    if(!seller){
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json({
      message: "Seller Profile Updated",
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err });
  }
};


const getPurchase = async (req, res) => {
  let sellerWithProducts;

  try {
    // const results = await Product.findById();
    sellerWithProducts = await Seller.findOne({
      sellerPhoneNo: req.params.phoneNo,
    }).populate("products");
    console.log(sellerWithProducts);
    const products = sellerWithProducts.products;

    const productsWithTotalOrders = await Promise.all(
      products.map(async (product) => {
        const totalOrders = await Product.aggregate([
          {
            $match: {
              _id: product._id,
            },
          },
          {
            $project: {
              totalOrders: { $size: "$productPurchased" },
            },
          },
        ]);

        return {
          ...product.toObject(),
          productPurchased: totalOrders[0].totalOrders,
        };
      })
    );

    res.status(200).json({
      products: productsWithTotalOrders,
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const getAllOrder = async (req, res) => {
  try {
    const sellerPhoneNoExist = await Seller.findOne({
      sellerPhoneNo: req.params.phoneNo,
    });
    if (sellerPhoneNoExist) {
      const sellerWithOrder = await Order.findOne({
        "products.sellerId": sellerPhoneNoExist._id,
      }).populate("products.product");
      console.log(sellerWithOrder);
      if (!sellerWithOrder || sellerWithOrder.length == 0) {
        return res.status(400).json({
          message: "Empty Order",
        });
      }
      const sellerOrderProducts = sellerWithOrder.products.filter(
        (product) =>
          product.sellerId.toString() === sellerPhoneNoExist._id.toString()
      );

      return res.status(200).json({
        product: sellerOrderProducts,
        _id: sellerWithOrder._id,
        userId: sellerWithOrder.userId,
        userAddress: sellerWithOrder.userAddress,
        userName: sellerWithOrder.userName,
        userPhoneNo: sellerWithOrder.userPhoneNo,
        contractAddress: sellerWithOrder.contractAddress,
        web3Id: sellerWithOrder.web3Id,
        paymentAmount: sellerWithOrder.paymentAmount,
        date: sellerWithOrder.date,
      });
    }
    res.status(404).json({
      message: "Seller Not Found",
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getAllSeller = getAllSeller;
exports.getSeller = getSeller;
exports.updateSellerProfile = updateSellerProfile;
exports.auth = auth;
exports.getPurchase = getPurchase;
exports.getAllOrder = getAllOrder;
