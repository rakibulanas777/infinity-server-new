const bcrypt = require("bcrypt");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Products = require("../models/Products");

const registerController = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(200).send({
        message: "User Already Exist",
        success: false,
      });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    req.body.password = hashPassword;

    const confrimHashPassword = await bcrypt.hash(
      req.body.passwordConfrim,
      salt
    );

    req.body.passwordConfrim = confrimHashPassword;

    if (req.body.password === req.body.passwordConfrim) {
      const newUser = new User(req.body);
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      return res.status(201).send({
        message: "Register Successfully",
        data: {
          user: newUser,
          token,
        },
        success: true,
      });
    } else {
      return res
        .status(200)
        .send({ message: "Password does not match", success: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register controller ${error.message}`,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).select(
      "+password"
    );
    if (!user) {
      return res.status(200).send({
        message: "User not found",
        success: false,
      });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    const signuser = await User.findOne({ email: req.body.email });
    if (!isMatch) {
      return res.status(200).send({
        message: "Invalid email and password",
        success: false,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).send({
      message: "Login Successfully",
      data: {
        user: signuser,
        token,
      },
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register controller ${error.message}`,
    });
  }
};
const switchUserToVendor = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by ID
    const user = await User.findById(userId);
    const token = jwt.sign({ id: req.body.userId }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's role to 'vendor'
    user.role = "vendor";
    await user.save();

    res.status(200).json({
      message: "You are now switch as a vendor",
      success: true,
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const switchVendorToUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const vendor = await User.findById(userId);
    const token = jwt.sign({ id: req.body.userId }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Update the vendor's role to 'user'
    vendor.role = "user";
    await vendor.save();

    res.status(200).json({
      message: "You are now switched as a user",
      success: true,
      data: {
        user: vendor,
        token,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const applySellerController = async (req, res) => {
  try {
    const newSeller = await User.findOne({ _id: req.body.userId });
    const token = jwt.sign({ id: req.body.userId }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    await User.findByIdAndUpdate(newSeller._id, { isSeller: req.body.checked });
    if (req.body.checked === true) {
      return res.status(201).send({
        message: `switch as a buyer`,
        success: true,
        data: {
          user: newSeller,
          token,
        },
      });
    } else {
      return res.status(201).send({
        message: `switch as a seller`,
        success: true,
        data: {
          user: newSeller,
          token,
        },
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Error while switching seller`,
    });
  }
};
const addProductsController = async (req, res) => {
  try {
    const newProduct = new Products(req.body);
    const saveProduct = await newProduct.save();
    return res
      .status(200)
      .send({ message: "Product added successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Error while switching seller`,
    });
  }
};

const authController = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    if (!user) {
      return res.status(200).send({
        message: "User not found",
        success: false,
      });
    } else {
      console.log(user);
      return res.status(200).send({
        message: "Register Successfully",
        data: {
          user,
        },
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Auth error`,
    });
  }
};

const getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  if (req.query.email) {
    const search = req.query.email;
    const matched = users.filter((user) => user.email.includes(search));
    res.status(200).json(matched);
  } else {
    res.status(200).json(users);
  }
  next();
});

const protect = catchAsync(async (req, res, next) => {
  let token;

  token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return next(
      new AppError("You are not logged in ! Please log in to get access", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }
  req.user = currentUser;
  next();
});

module.exports = {
  getUsers,
  applySellerController,
  addProductsController,
  loginController,
  authController,
  registerController,
  protect,
  switchUserToVendor,
  switchVendorToUser,
};
