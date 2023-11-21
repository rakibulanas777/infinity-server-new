const express = require("express");
const {
  getProductsController,
  getProductController,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  markDelivered,
  getMostBidsProducts,
  selectWinner,
  getProductsForVendor,
  getNewProducts,
  getEndingSoonProducts,
  getProductsByCategory,
  pauseProduct,
  activeProduct,
  getProductsForUserBids,
  getPaidProductsForVendor,
  getTotalPaidProductsAndWinningAmount,
} = require("../controllers/products");

const { protect } = require("../middlewares/authMiddleware");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destinationDir = "public/products";
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

router.get("/", getProductsController);
router.get("/products/new", getNewProducts);
router.get("/products/ending-soon", getEndingSoonProducts);

router.get("/products/most-bids", getMostBidsProducts);
router.get("/products/category", getProductsByCategory);
router.patch("/:productId/complete", markDelivered);
router.patch("/:productId/select-winner", selectWinner);
router.get(
  "/vendor/:vendorId/total-paid-products-and-winning-amount",
  getTotalPaidProductsAndWinningAmount
);

router.get("/:id", getProductById);
router.delete("/:id", deleteProduct);
router.get("/vendor/:vendorId", getProductsForVendor);
router.get("/vendor/:vendorId/paid", getPaidProductsForVendor);
router.put("/:id", updateProduct);
router.put("/pause/:id", pauseProduct);
router.put("/active/:id", activeProduct);
router.post("/", protect, getProductController);
router.post("/", createProduct);

router.get("/bids/products/:userId", getProductsForUserBids);

module.exports = router;
