const express = require("express");
const router = express.Router();
const bidsController = require("../controllers/bids");
const { protect } = require("../middlewares/authMiddleware");

// Place a bid on a product
router.post("/", bidsController.placeBid);

module.exports = router;
