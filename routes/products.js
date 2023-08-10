const express = require("express");
const {
  getProductsController,
  getProductController,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  markDelivered,
} = require("../controllers/products");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", getProductsController);
router.patch("/:productId/complete", protect, markDelivered);
router.get("/:id", getProductById);
router.delete("/:id", deleteProduct);
router.put("/:id", updateProduct);
router.post("/", protect, getProductController);
router.post("/", createProduct);

module.exports = router;
