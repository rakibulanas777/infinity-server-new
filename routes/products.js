const express = require("express");
const {
  getProductsController,
  getProductController,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  markDelivered,
  selectWinner,
  getProductsForVendor,
  getNewProducts,
} = require("../controllers/products");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", getProductsController);
router.get("/products/new", getNewProducts);
router.patch("/:productId/complete", protect, markDelivered);
router.patch("/:productId/select-winner", selectWinner);
router.get("/:id", getProductById);
router.delete("/:id", deleteProduct);
router.get("/vendor/:vendorId", getProductsForVendor);
router.put("/:id", updateProduct);
router.post("/", protect, getProductController);
router.post("/", createProduct);

module.exports = router;
