const express = require("express");
const multer = require("multer");
const {
  getUsers,
  loginController,
  registerController,
  authController,
  addProductsController,
  applySellerController,
  switchVendorToUser,
  switchUserToVendor,
  updateUserProfile,
} = require("../controllers/user");

const { protect } = require("../middlewares/authMiddleware");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destinationDir = "public/users";
    if (!fs.existsSync(destinationDir)) {
      fs.mkdirSync(destinationDir, { recursive: true });
    }
    cb(null, destinationDir);
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, `image-${Date.now()}.${ext}`); // Set the file name for uploaded images
  },
});

const upload = multer({ storage });

const router = express.Router();

router.post("/register", registerController);
router.get("/", protect, getUsers);
router.post("/login", loginController);
router.put("/switch-to-vendor/:userId", switchUserToVendor);
router.put("/complete-profile", protect, updateUserProfile);
// Switch vendor to user
router.put("/switch-to-user/:userId", switchVendorToUser);
router.post("/getUserData", protect, authController);
router.post("/addProducts", protect, addProductsController);
router.post("/apply-seller", protect, applySellerController);

module.exports = router;
