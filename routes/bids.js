const express = require("express");
const router = express.Router();
const {
  placeBid,
  getAllBidsForProduct,
  approveBid,
  getBidsForProduct,
} = require("../controllers/bids");
const { protect } = require("../middlewares/authMiddleware");

// Place a bid on a product
router.post("/:productId", placeBid);
router.put("/:bidId/approve", approveBid);

// Mark a bid as complete

router.get("/product/:productId/bids", protect, getAllBidsForProduct);
router.get("/product/:productId/bid", getBidsForProduct);

module.exports = router;
