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
} = require("../controllers/products");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", getProductsController);
router.get("/products/new", getNewProducts);
router.get("/products/ending-soon", getEndingSoonProducts);

router.get("/products/most-bids", getMostBidsProducts);
router.get("/products/category", getProductsByCategory);
router.patch("/:productId/complete", protect, markDelivered);
router.patch("/:productId/select-winner", selectWinner);

router.get("/:id", getProductById);
router.delete("/:id", deleteProduct);
router.get("/vendor/:vendorId", getProductsForVendor);
router.put("/:id", updateProduct);
router.put("/pause/:id", pauseProduct);
router.post("/", protect, getProductController);
router.post("/", createProduct);

module.exports = router;
