// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const Joi = require("joi");

// const { ref, uploadBytes, deleteObject } = require("firebase/storage");

// const { fileDelete, avatarImageUpload } = require("../middleware/file-manage");
const User = require("../models/user");
const Order = require("../models/order");

const registerSchema = Joi.object({
  phoneNo: Joi.string()
    .regex(/^\d{10}$/)
    .required(),
});
const loginSchema = Joi.object({
  phoneNo: Joi.string()
    .regex(/^\d{10}$/)
    .required(),
});

//SignUp User
const auth = async (req, res) => {
  //CHECK IF Phone No ALREADY EXISTS
  console.log(req.body);
  const phoneExist = await User.findOne({ phoneNo: req.body.phoneNo });
  if (phoneExist) {
    // res.status(400).json({ message: "Phone No Already Exists" });

    try {
      const { error } = await loginSchema.validateAsync(req.body);
      if (error) {
        res.status(400).json({ message: error });
        return;
      } else {
        const user = await User.findOne({ phoneNo: req.body.phoneNo });
        console.log("user login");
        res.status(200).json({
          message: user,
        });
        return;
      }
    } catch (err) {
      res.status(500).json({ message: err });

      return;
    }
  }

  const user = new User({
    phoneNo: req.body.phoneNo,
  });

  try {
    //VALIDATION OF USER INPUTS
    const { error } = await registerSchema.validateAsync(req.body);
    if (error) {
      res.status(500).json({ message: error });
    } else {
      //THE USER IS ADDED
      await user.save();
      //CREATE TOKEN
      //   const token = jwt.sign(
      //     { _id: user._id, email: user.email },
      //     process.env.JWT_KEY,
      //     {
      //       expiresIn: "1h",
      //     }
      //   );
      console.log("user signup");
      res.status(200).json({
        message: user,
      });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

//SIGNIN USER

const login = async (req, res) => {
  //CHECKING IF EMAIL EXISTS
  const user = await User.findOne({ phoneNo: req.body.phoneNo });
  if (!user) {
    res.status(400).json({ message: 'Phone No doesn"t exist' });
    return;
  }

  try {
    const { error } = await loginSchema.validateAsync(req.body);

    if (error) {
      res.status(400).json({ message: error });
      return;
    } else {
      //CREATE TOKEN
      //   const token = jwt.sign(
      //     { _id: user._id, email: user.email },
      //     process.env.JWT_KEY,
      //     {
      //       expiresIn: "1h",
      //     }
      //   );
      res.status(200).json({
        message: "User Logged In ",
      });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

//Get User Added Product
const getAllUser = async (req, res) => {
  let allUsers;

  try {
    // const results = await Product.findById();
    allUsers = await User.find();
    res.status(200).json({
      Users: allUsers,
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const getUser = async (req, res) => {

  try {
    // const results = await Product.findById();
    // user = await User.findById(req.params.userId);
    const user = await User.findOne({ phoneNo: req.params.phoneNo });

    res.status(200).json({
      User: user,
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const updateUserProfile = async (req, res) => {

  try {
    const user = await User.findOneAndUpdate({ phoneNo: req.params.phoneNo },{
      ...req.body
    });
    if(!user){
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json({
      message: "Profile Updated",
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};


const getAllOrder = async (req, res) => {
  try {
    const userPhoneNoExist = await User.findOne({
      phoneNo: req.params.phoneNo,
    });
    if (userPhoneNoExist) {
      const userWithOrder = await Order.findOne({
        userId: userPhoneNoExist._id,
      }).populate("products.product");
      console.log(userWithOrder);
      if (!userWithOrder || userWithOrder.length == 0) {
        return res.status(400).json({
          message: "Empty Order",
        });
      }
      
      return res.status(200).json({
        orders: userWithOrder 
      });
    }
    res.status(404).json({
      message: "User Not Found",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
};

exports.getAllUser = getAllUser;
exports.getUser = getUser;
exports.auth = auth;
exports.getAllOrder = getAllOrder;
exports.updateUserProfile = updateUserProfile;
