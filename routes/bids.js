const express = require("express");
const router = express.Router();
const {
  placeBid,
  getAllBidsForProduct,
  approveBid,
  getBidsForProduct,
  winBidAndPay,
} = require("../controllers/bids");
const { protect } = require("../middlewares/authMiddleware");

// Place a bid on a product
router.post("/:productId", placeBid);
router.put("/:bidId/approve", approveBid);
router.post("/:bidId/win-and-pay", winBidAndPay);
router.get("/product/:productId/bids", protect, getAllBidsForProduct);
router.get("/product/:productId/bid", getBidsForProduct);

module.exports = router;
