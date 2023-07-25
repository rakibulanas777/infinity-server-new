const express = require("express");
const {
  getProductsController,
  getProductController,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
} = require("../controllers/products");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", getProductsController);
router.get("/:id", getProductById);
router.delete("/:id", deleteProduct);
router.put("/:id", updateProduct);
router.post("/", protect, getProductController);
router.post("/", createProduct);

module.exports = router;
