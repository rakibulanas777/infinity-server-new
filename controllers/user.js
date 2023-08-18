const bcrypt = require("bcrypt");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");

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
    console.log(req.body);
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

// Update user profile
const updateUserProfile = async (req, res) => {
  const { name, address, bankAccount, userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.address = address || user.address;
    user.bankAccount = bankAccount || user.bankAccount;

    await user.save();

    res
      .status(200)
      .json({ message: "User profile updated successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  applySellerController,
  addProductsController,
  loginController,

  updateUserProfile,
  registerController,

  switchUserToVendor,
  switchVendorToUser,
};
