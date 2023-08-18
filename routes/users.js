const express = require("express");

const {
  loginController,
  registerController,

  addProductsController,
  applySellerController,
  switchVendorToUser,
  switchUserToVendor,
  updateUserProfile,
} = require("../controllers/user");

const { protect } = require("../middlewares/authMiddleware");

const multer = require("multer");
const moment = require("moment");
// img storage path
const imgconfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "../uploads");
  },
  filename: (req, file, callback) => {
    callback(null, `imgae-${Date.now()}. ${file.originalname}`);
  },
});

// img filter
const isImage = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(new Error("only images is allowd"));
  }
};

const upload = multer({
  storage: imgconfig,
  fileFilter: isImage,
});

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.put("/switch-to-vendor/:userId", switchUserToVendor);
router.put("/complete-profile", protect, updateUserProfile);
// Switch vendor to user
router.put("/switch-to-user/:userId", switchVendorToUser);
router.post("/addProducts", protect, addProductsController);
router.post("/apply-seller", protect, applySellerController);

module.exports = router;
