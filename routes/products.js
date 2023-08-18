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
  getTopBiddingProducts,
} = require("../controllers/products");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", getProductsController);
router.patch("/:productId/complete", protect, markDelivered);
router.patch("/:productId/select-winner", selectWinner);
router.get("/:id", getProductById);
router.delete("/:id", deleteProduct);
router.get("/vendor/:vendorId", protect, getProductsForVendor);
router.put("/:id", updateProduct);
router.post("/", protect, getProductController);
router.post("/", createProduct);
router.get("/top-bidding", getTopBiddingProducts);
module.exports = router;
