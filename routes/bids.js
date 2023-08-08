const express = require("express");
const router = express.Router();
const { placeBid } = require("../controllers/bids");
const { protect } = require("../middlewares/authMiddleware");

// Place a bid on a product
router.post("/:productId", placeBid);

module.exports = router;
